import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { createMiddleware } from 'hono/factory'
import { authMiddleware, type AuthContext } from '@/server/middleware/auth'
import {
  gitHubConnections,
  repositories,
} from '@/server/db/git-ocean-schema'
import {
  exchangeOAuthCode,
  decryptToken,
  encryptToken,
} from '@/server/services/github-api'
import {
  fetchUserProfile,
  fetchUserRepos,
  fetchRepoDetails,
  fetchWorkflowRunStatus,
} from '@/server/services/github-cache'

const app = new Hono<AuthContext>()

// ─── Webhook (no auth) ──────────────────────────────────────────────

const GITHUB_HOOK_IPS = [
  '192.30.252.0/22',
  '185.199.108.0/22',
  '140.82.112.0/20',
  '143.55.64.0/20',
  '2a0a:a440::/29',
  '2606:50c0::/32',
]

function ipInCIDR(ip: string, cidr: string): boolean {
  const [range, bits] = cidr.split('/')
  const mask = ~(2 ** (32 - Number(bits)) - 1) >>> 0
  const ipNum = ip.split('.').reduce((acc, oct) => (acc << 8) + Number(oct), 0) >>> 0
  const rangeNum = range!.split('.').reduce((acc, oct) => (acc << 8) + Number(oct), 0) >>> 0
  return (ipNum & mask) === (rangeNum & mask)
}

function isGitHubIP(ip: string): boolean {
  if (ip.includes(':')) return true
  return GITHUB_HOOK_IPS.some((cidr) => ipInCIDR(ip, cidr))
}

const githubWebhookIPCheck = createMiddleware<{ Bindings: AuthContext['Bindings'] }>(async (c, next) => {
  const ip = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ?? ''
  if (ip && !isGitHubIP(ip)) {
    return c.json({ error: 'Forbidden' }, 403)
  }
  await next()
})

async function verifyWebhookSignature(
  body: string,
  signature: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!signature || !secret) return false
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  const expected = 'sha256=' + Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('')
  return expected === signature
}

app.post('/webhook', githubWebhookIPCheck, async (c) => {
  const body = await c.req.text()
  const signature = c.req.header('x-hub-signature-256')
  const event = c.req.header('x-github-event')
  const secret = c.env.GITHUB_WEBHOOK_SECRET

  if (secret && !(await verifyWebhookSignature(body, signature, secret))) {
    return c.json({ error: 'Invalid signature' }, 401)
  }

  if (!event) {
    return c.json({ error: 'Missing x-github-event header' }, 400)
  }

  const payload = JSON.parse(body) as {
    repository?: {
      id: number
      full_name: string
      stargazers_count?: number
      forks_count?: number
      open_issues_count?: number
      pushed_at?: string
      owner?: { login: string }
    }
    action?: string
    sender?: { login: string }
  }

  const repoId = payload.repository?.id
  if (!repoId) {
    return c.json({ error: 'Missing repository id' }, 400)
  }

  c.executionCtx.waitUntil(
    (async () => {
      try {
        const db = drizzle(c.env.DB)

        switch (event) {
          case 'star': {
            await db
              .update(repositories)
              .set({ stars: payload.repository?.stargazers_count ?? 0, updatedAt: new Date() })
              .where(eq(repositories.githubRepoId, repoId))
              .run()
            break
          }
          case 'fork': {
            await db
              .update(repositories)
              .set({ forks: payload.repository?.forks_count ?? 0, updatedAt: new Date() })
              .where(eq(repositories.githubRepoId, repoId))
              .run()
            break
          }
          case 'push': {
            await db
              .update(repositories)
              .set({
                lastPushedAt: payload.repository?.pushed_at ? new Date(payload.repository.pushed_at) : new Date(),
                updatedAt: new Date(),
              })
              .where(eq(repositories.githubRepoId, repoId))
              .run()
            break
          }
          case 'issues': {
            const issuesCount = payload.repository?.open_issues_count ?? 0
            await db
              .update(repositories)
              .set({ issues: issuesCount, updatedAt: new Date() })
              .where(eq(repositories.githubRepoId, repoId))
              .run()
            break
          }
          case 'pull_request': {
            await db
              .update(repositories)
              .set({ updatedAt: new Date() })
              .where(eq(repositories.githubRepoId, repoId))
              .run()
            break
          }
        }
      } catch (err) {
        console.error('Webhook handler error:', err)
      }
    })(),
  )

  return c.json({ ok: true })
})

// ─── Auth middleware for all remaining routes ────────────────────────

app.use('*', authMiddleware)

// ─── Connect / OAuth ────────────────────────────────────────────────

const connectSchema = z.object({
  code: z.string().min(1),
})

app.post('/connect', zValidator('json', connectSchema), async (c) => {
  const userId = c.get('userId')
  const { code } = c.req.valid('json')
  const db = drizzle(c.env.DB)

  const clientId = c.env.GITHUB_CLIENT_ID
  const clientSecret = c.env.GITHUB_CLIENT_SECRET
  const redirectUri = c.env.GITHUB_REDIRECT_URI ?? 'http://localhost:5173/auth/github/callback'

  if (!clientId || !clientSecret) {
    return c.json({ error: 'GitHub OAuth not configured' }, 500)
  }

  let tokenResult: { accessToken: string; scope: string }
  try {
    tokenResult = await exchangeOAuthCode(code, clientId, clientSecret, redirectUri)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'OAuth code exchange failed'
    return c.json({ error: message }, 400)
  }

  let profile: { login: string; avatar_url: string }
  try {
    const result = await fetchUserProfile(tokenResult.accessToken)
    profile = { login: result.profile.login, avatar_url: result.profile.avatar_url }
  } catch {
    return c.json({ error: 'Failed to fetch GitHub profile after OAuth' }, 502)
  }

  const encryptedToken = await encryptToken(tokenResult.accessToken, c.env.BETTER_AUTH_SECRET)

  const existing = await db
    .select({ id: gitHubConnections.id })
    .from(gitHubConnections)
    .where(eq(gitHubConnections.userId, userId))
    .get()

  if (existing) {
    const updated = await db
      .update(gitHubConnections)
      .set({
        accessToken: encryptedToken,
        githubUsername: profile.login,
        githubAvatarUrl: profile.avatar_url,
        scope: tokenResult.scope,
        updatedAt: new Date(),
      })
      .where(eq(gitHubConnections.userId, userId))
      .returning()
      .get()
    return c.json({ ...updated, accessToken: undefined })
  }

  const created = await db
    .insert(gitHubConnections)
    .values({
      userId,
      accessToken: encryptedToken,
      githubUsername: profile.login,
      githubAvatarUrl: profile.avatar_url,
      scope: tokenResult.scope,
    })
    .returning()
    .get()

  return c.json({ ...created, accessToken: undefined })
})

// ─── Profile ────────────────────────────────────────────────────────

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

  let token: string
  try {
    token = await decryptToken(connection.accessToken, c.env.BETTER_AUTH_SECRET)
  } catch {
    return c.json({ error: 'Failed to decrypt stored token' }, 500)
  }

  try {
    const { profile, rateLimit, cachedAt } = await fetchUserProfile(token, c.env.GITHUB_CACHE)
    return c.json({
      profile,
      cachedAt: cachedAt ?? null,
      rateLimit,
    })
  } catch (err) {
    return c.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch GitHub profile' },
      502,
    )
  }
})

// ─── Repos ──────────────────────────────────────────────────────────

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

  let token: string
  try {
    token = await decryptToken(connection.accessToken, c.env.BETTER_AUTH_SECRET)
  } catch {
    return c.json({ error: 'Failed to decrypt stored token' }, 500)
  }

  try {
    const { repos, rateLimit, cachedAt } = await fetchUserRepos(token, c.env.GITHUB_CACHE)
    return c.json({ repos, rateLimit, cachedAt: cachedAt ?? null })
  } catch (err) {
    return c.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch GitHub repos' },
      502,
    )
  }
})

// ─── Repo Details ──────────────────────────────────────────────────

const repoParamsSchema = z.object({
  owner: z.string(),
  repo: z.string(),
})

app.get('/repos/:owner/:repo', zValidator('param', repoParamsSchema), async (c) => {
  const userId = c.get('userId')
  const { owner, repo } = c.req.valid('param')
  const db = drizzle(c.env.DB)

  const connection = await db
    .select()
    .from(gitHubConnections)
    .where(eq(gitHubConnections.userId, userId))
    .get()

  if (!connection) {
    return c.json({ error: 'No GitHub connection found' }, 404)
  }

  let token: string
  try {
    token = await decryptToken(connection.accessToken, c.env.BETTER_AUTH_SECRET)
  } catch {
    return c.json({ error: 'Failed to decrypt stored token' }, 500)
  }

  try {
    const { details, rateLimit, cachedAt } = await fetchRepoDetails(token, owner, repo, c.env.GITHUB_CACHE)
    return c.json({ details, rateLimit, cachedAt: cachedAt ?? null })
  } catch (err) {
    return c.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch repo details' },
      502,
    )
  }
})

// ─── Actions Workflow Status ───────────────────────────────────────

app.get('/repos/:owner/:repo/actions', async (c) => {
  const userId = c.get('userId')
  const owner = c.req.param('owner')
  const repo = c.req.param('repo')
  const db = drizzle(c.env.DB)

  const connection = await db
    .select()
    .from(gitHubConnections)
    .where(eq(gitHubConnections.userId, userId))
    .get()

  if (!connection) {
    return c.json({ error: 'No GitHub connection found' }, 404)
  }

  let token: string
  try {
    token = await decryptToken(connection.accessToken, c.env.BETTER_AUTH_SECRET)
  } catch {
    return c.json({ error: 'Failed to decrypt stored token' }, 500)
  }

  try {
    const { conclusion, rateLimit, cachedAt } = await fetchWorkflowRunStatus(token, owner, repo, c.env.GITHUB_CACHE)
    return c.json({ conclusion, rateLimit, cachedAt: cachedAt ?? null })
  } catch (err) {
    return c.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch workflow status' },
      502,
    )
  }
})

// ─── Disconnect ─────────────────────────────────────────────────────

app.post('/disconnect', async (c) => {
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)

  const existing = await db
    .select({ id: gitHubConnections.id })
    .from(gitHubConnections)
    .where(eq(gitHubConnections.userId, userId))
    .get()

  if (!existing) {
    return c.json({ error: 'No GitHub connection found' }, 404)
  }

  await db
    .delete(gitHubConnections)
    .where(eq(gitHubConnections.userId, userId))
    .run()

  return c.json({ ok: true })
})

app.get('/auth-url', (c) => {
  const clientId = c.env.GITHUB_CLIENT_ID
  if (!clientId) {
    return c.json({ configured: false })
  }
  const redirectUri = c.env.GITHUB_REDIRECT_URI ?? 'http://localhost:5173/auth/github/callback'
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,read:user`
  return c.json({ configured: true, url })
})

app.post('/connect-mock', async (c) => {
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)

  const encryptedToken = await encryptToken('mock-token', c.env.BETTER_AUTH_SECRET)

  const existing = await db
    .select({ id: gitHubConnections.id })
    .from(gitHubConnections)
    .where(eq(gitHubConnections.userId, userId))
    .get()

  if (existing) {
    const updated = await db
      .update(gitHubConnections)
      .set({
        accessToken: encryptedToken,
        githubUsername: 'MockOceanexplorer',
        githubAvatarUrl: 'https://github.com/identicons/mock.png',
        scope: 'repo,read:user',
        updatedAt: new Date(),
      })
      .where(eq(gitHubConnections.userId, userId))
      .returning()
      .get()
    return c.json({ ...updated, accessToken: undefined })
  }

  const created = await db
    .insert(gitHubConnections)
    .values({
      userId,
      accessToken: encryptedToken,
      githubUsername: 'MockOceanexplorer',
      githubAvatarUrl: 'https://github.com/identicons/mock.png',
      scope: 'repo,read:user',
    })
    .returning()
    .get()

  return c.json({ ...created, accessToken: undefined })
})

export default app
