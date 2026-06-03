import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, type AuthContext } from '@/server/middleware/auth'
import { gitHubConnections } from '@/server/db/git-ocean-schema'

const app = new Hono<AuthContext>()

app.use('*', authMiddleware)

const connectSchema = z.object({
  accessToken: z.string().min(1),
  githubUsername: z.string().min(1),
  githubAvatarUrl: z.string().optional(),
  scope: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
})

app.post('/connect', zValidator('json', connectSchema), async (c) => {
  const userId = c.get('userId')
  const body = c.req.valid('json')
  const db = drizzle(c.env.DB)

  const existing = await db
    .select({ id: gitHubConnections.id })
    .from(gitHubConnections)
    .where(eq(gitHubConnections.userId, userId))
    .get()

  if (existing) {
    const updated = await db
      .update(gitHubConnections)
      .set({
        accessToken: body.accessToken,
        githubUsername: body.githubUsername,
        githubAvatarUrl: body.githubAvatarUrl,
        scope: body.scope,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        updatedAt: new Date(),
      })
      .where(eq(gitHubConnections.userId, userId))
      .returning()
      .get()
    return c.json(updated)
  }

  const created = await db
    .insert(gitHubConnections)
    .values({
      userId,
      accessToken: body.accessToken,
      githubUsername: body.githubUsername,
      githubAvatarUrl: body.githubAvatarUrl,
      scope: body.scope,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    })
    .returning()
    .get()

  return c.json(created)
})

app.get('/profile', async (c) => {
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)

  const connection = await db
    .select()
    .from(gitHubConnections)
    .where(eq(gitHubConnections.userId, userId))
    .get()

  if (!connection) {
    return c.json({ error: 'No GitHub connection found' }, 404)
  }

  const resp = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${connection.accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (!resp.ok) {
    return c.json({ error: 'Failed to fetch GitHub profile' }, resp.status as 401 | 403 | 404 | 500)
  }

  const profile = await resp.json()
  return c.json(profile)
})

app.get('/repos', async (c) => {
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)

  const connection = await db
    .select()
    .from(gitHubConnections)
    .where(eq(gitHubConnections.userId, userId))
    .get()

  if (!connection) {
    return c.json({ error: 'No GitHub connection found' }, 404)
  }

  const resp = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
    headers: {
      Authorization: `Bearer ${connection.accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (!resp.ok) {
    return c.json({ error: 'Failed to fetch GitHub repos' }, resp.status as 401 | 403 | 404 | 500)
  }

  const repos = await resp.json()
  return c.json(repos)
})

export default app
