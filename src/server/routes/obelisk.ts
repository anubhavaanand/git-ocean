import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq, sql, desc } from 'drizzle-orm'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, type AuthContext } from '@/server/middleware/auth'
import { obeliskSkins, obeliskVotes } from '@/server/db/git-ocean-schema'
import {
  getCurrentEpoch,
  getActiveSkinForCountry,
  getDefaultSkin,
  type ObeliskSkinModelConfig,
} from '@/server/services/obelisk-service'

const app = new Hono<AuthContext>()

app.use('*', authMiddleware)

const modelConfigSchema = z.object({
  color: z.string(),
  height: z.number().positive(),
  rings: z.number().int().positive(),
  glowColor: z.string(),
  tipColor: z.string(),
  pattern: z.string(),
})

const createSkinSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  modelConfig: modelConfigSchema,
})

const voteBodySchema = z.object({
  countryCode: z.string().min(1).max(3),
})

app.get('/skins', async (c) => {
  const db = drizzle(c.env.DB)
  const epoch = await getCurrentEpoch(db)

  const skins = await db
    .select()
    .from(obeliskSkins)
    .where(eq(obeliskSkins.epoch, epoch.epoch))
    .orderBy(desc(obeliskSkins.createdAt))

  const skinVoteCounts = await db
    .select({
      skinId: obeliskVotes.skinId,
      count: sql<number>`COUNT(*)`,
    })
    .from(obeliskVotes)
    .where(eq(obeliskVotes.epoch, epoch.epoch))
    .groupBy(obeliskVotes.skinId)

  const voteMap = new Map(skinVoteCounts.map((v) => [v.skinId, v.count]))

  return c.json(
    skins.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      modelConfig: JSON.parse(s.modelConfig) as ObeliskSkinModelConfig,
      createdBy: s.createdBy,
      createdAt: s.createdAt,
      epoch: s.epoch,
      voteCount: voteMap.get(s.id) ?? 0,
    })),
  )
})

app.post('/skins', zValidator('json', createSkinSchema), async (c) => {
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)
  const body = c.req.valid('json')
  const epoch = await getCurrentEpoch(db)

  const inserted = await db
    .insert(obeliskSkins)
    .values({
      name: body.name,
      description: body.description ?? null,
      modelConfig: JSON.stringify(body.modelConfig),
      createdBy: userId,
      epoch: epoch.epoch,
    })
    .returning()

  const skin = inserted[0]
  if (!skin) {
    return c.json({ error: 'Failed to create skin' }, 500)
  }

  return c.json(
    {
      id: skin.id,
      name: skin.name,
      description: skin.description,
      modelConfig: JSON.parse(skin.modelConfig) as ObeliskSkinModelConfig,
      createdBy: skin.createdBy,
      createdAt: skin.createdAt,
      epoch: skin.epoch,
    },
    201,
  )
})

app.post('/skins/:id/vote', zValidator('json', voteBodySchema), async (c) => {
  const userId = c.get('userId')
  const skinId = c.req.param('id')
  const db = drizzle(c.env.DB)
  const { countryCode } = c.req.valid('json')
  const epoch = await getCurrentEpoch(db)

  const [skin] = await db
    .select()
    .from(obeliskSkins)
    .where(eq(obeliskSkins.id, skinId))
    .limit(1)

  if (!skin) {
    return c.json({ error: 'Skin not found' }, 404)
  }

  const [existingVote] = await db
    .select()
    .from(obeliskVotes)
    .where(
      sql`${obeliskVotes.userId} = ${userId} AND ${obeliskVotes.skinId} = ${skinId} AND ${obeliskVotes.countryCode} = ${countryCode} AND ${obeliskVotes.epoch} = ${epoch.epoch}`,
    )
    .limit(1)

  if (existingVote) {
    return c.json({ error: 'Already voted for this skin on this country' }, 409)
  }

  const inserted = await db
    .insert(obeliskVotes)
    .values({
      skinId,
      userId,
      countryCode: countryCode.toUpperCase(),
      epoch: epoch.epoch,
    })
    .returning()

  const vote = inserted[0]
  if (!vote) {
    return c.json({ error: 'Failed to record vote' }, 500)
  }

  return c.json(
    {
      id: vote.id,
      skinId: vote.skinId,
      countryCode: vote.countryCode,
      epoch: vote.epoch,
      createdAt: vote.createdAt,
    },
    201,
  )
})

app.get('/skins/:id/votes', async (c) => {
  const skinId = c.req.param('id')
  const db = drizzle(c.env.DB)

  const [skin] = await db
    .select()
    .from(obeliskSkins)
    .where(eq(obeliskSkins.id, skinId))
    .limit(1)

  if (!skin) {
    return c.json({ error: 'Skin not found' }, 404)
  }

  const result = await db
    .select({
      countryCode: obeliskVotes.countryCode,
      count: sql<number>`COUNT(*)`,
    })
    .from(obeliskVotes)
    .where(eq(obeliskVotes.skinId, skinId))
    .groupBy(obeliskVotes.countryCode)
    .orderBy(desc(sql`COUNT(*)`))

  const totalVotes = result.reduce((sum, r) => sum + r.count, 0)

  return c.json({
    skinId,
    totalVotes,
    byCountry: result.map((r) => ({
      countryCode: r.countryCode,
      count: r.count,
    })),
  })
})

app.get('/:countryCode/active-skin', async (c) => {
  const countryCode = c.req.param('countryCode').toUpperCase()
  const db = drizzle(c.env.DB)

  const activeSkin = await getActiveSkinForCountry(db, countryCode)

  if (!activeSkin) {
    const defaultSkin = await getDefaultSkin()
    return c.json(defaultSkin)
  }

  return c.json(activeSkin)
})

app.get('/epochs/current', async (c) => {
  const db = drizzle(c.env.DB)
  const epoch = await getCurrentEpoch(db)

  const now = new Date()
  const remainingMs = epoch.endDate.getTime() - now.getTime()
  const remainingDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)))

  return c.json({
    epoch: epoch.epoch,
    startDate: epoch.startDate,
    endDate: epoch.endDate,
    active: epoch.active,
    remainingDays,
  })
})

export default app
