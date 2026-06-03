import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, type AuthContext } from '@/server/middleware/auth'
import { oceanStates, creatures, repositories } from '@/server/db/git-ocean-schema'

const app = new Hono<AuthContext>()

app.use('*', authMiddleware)

const updateOceanStateSchema = z.object({
  whaleColor: z.string().optional(),
  whaleSize: z.number().int().min(1).optional(),
  oceanDepth: z.number().int().min(0).optional(),
  coralCount: z.number().int().min(0).optional(),
  totalCreatures: z.number().int().min(0).optional(),
})

app.get('/state', async (c) => {
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)

  const state = await db
    .select()
    .from(oceanStates)
    .where(eq(oceanStates.userId, userId))
    .get()

  if (!state) {
    const created = await db
      .insert(oceanStates)
      .values({ userId })
      .returning()
      .get()
    return c.json(created)
  }

  return c.json(state)
})

app.put('/state', zValidator('json', updateOceanStateSchema), async (c) => {
  const userId = c.get('userId')
  const body = c.req.valid('json')
  const db = drizzle(c.env.DB)

  const existing = await db
    .select({ id: oceanStates.id })
    .from(oceanStates)
    .where(eq(oceanStates.userId, userId))
    .get()

  if (!existing) {
    const created = await db
      .insert(oceanStates)
      .values({ userId, ...body })
      .returning()
      .get()
    return c.json(created)
  }

  const updated = await db
    .update(oceanStates)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(oceanStates.userId, userId))
    .returning()
    .get()

  return c.json(updated)
})

app.get('/creatures', async (c) => {
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)

  const results = await db
    .select()
    .from(creatures)
    .where(eq(creatures.userId, userId))

  return c.json(results)
})

app.get('/repos', async (c) => {
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)

  const results = await db
    .select()
    .from(repositories)
    .where(eq(repositories.userId, userId))

  return c.json(results)
})

export default app
