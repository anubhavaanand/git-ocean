import { eq, desc, and, sql } from 'drizzle-orm'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import { obeliskEpochs, obeliskSkins, obeliskVotes } from '@/server/db/git-ocean-schema'

export interface ObeliskSkinModelConfig {
  color: string
  height: number
  rings: number
  glowColor: string
  tipColor: string
  pattern: string
}

export interface ObeliskSkin {
  id: string
  name: string
  description: string | null
  modelConfig: ObeliskSkinModelConfig
  createdBy: string
  createdAt: Date
  epoch: number
}

export interface ObeliskEpoch {
  id: string
  epoch: number
  startDate: Date
  endDate: Date
  active: boolean
}

const EPOCH_DURATION_DAYS = 7

function generateEpochNumber(): number {
  return Math.floor(Date.now() / 1000)
}

export async function getCurrentEpoch(db: DrizzleD1Database): Promise<ObeliskEpoch> {
  const [activeEpoch] = await db
    .select()
    .from(obeliskEpochs)
    .where(eq(obeliskEpochs.active, true))
    .orderBy(desc(obeliskEpochs.epoch))
    .limit(1)

  if (activeEpoch && new Date(activeEpoch.endDate) > new Date()) {
    return {
      id: activeEpoch.id,
      epoch: activeEpoch.epoch,
      startDate: activeEpoch.startDate,
      endDate: activeEpoch.endDate,
      active: activeEpoch.active,
    }
  }

  const now = new Date()
  const endDate = new Date(now)
  endDate.setDate(endDate.getDate() + EPOCH_DURATION_DAYS)

  const inserted = await db
    .insert(obeliskEpochs)
    .values({
      epoch: generateEpochNumber(),
      startDate: now,
      endDate,
      active: true,
    })
    .returning()

  if (inserted.length === 0) {
    throw new Error('Failed to create new epoch')
  }

  const newEpoch = inserted[0]!

  return {
    id: newEpoch.id,
    epoch: newEpoch.epoch,
    startDate: newEpoch.startDate,
    endDate: newEpoch.endDate,
    active: newEpoch.active,
  }
}

export async function finalizeEpoch(db: DrizzleD1Database): Promise<ObeliskEpoch> {
  const [currentEpoch] = await db
    .select()
    .from(obeliskEpochs)
    .where(eq(obeliskEpochs.active, true))
    .orderBy(desc(obeliskEpochs.epoch))
    .limit(1)

  if (currentEpoch) {
    await db
      .update(obeliskEpochs)
      .set({ active: false })
      .where(eq(obeliskEpochs.id, currentEpoch.id))
  }

  const now = new Date()
  const endDate = new Date(now)
  endDate.setDate(endDate.getDate() + EPOCH_DURATION_DAYS)

  const inserted = await db
    .insert(obeliskEpochs)
    .values({
      epoch: generateEpochNumber(),
      startDate: now,
      endDate,
      active: true,
    })
    .returning()

  if (inserted.length === 0) {
    throw new Error('Failed to create new epoch')
  }

  const newEpoch = inserted[0]!

  return {
    id: newEpoch.id,
    epoch: newEpoch.epoch,
    startDate: newEpoch.startDate,
    endDate: newEpoch.endDate,
    active: newEpoch.active,
  }
}

export async function getActiveSkinForCountry(
  db: DrizzleD1Database,
  countryCode: string,
): Promise<ObeliskSkin | null> {
  const epoch = await getCurrentEpoch(db)

  const [winner] = await db
    .select({
      skinId: obeliskVotes.skinId,
      count: sql<number>`COUNT(*)`,
    })
    .from(obeliskVotes)
    .where(
      and(
        eq(obeliskVotes.countryCode, countryCode),
        eq(obeliskVotes.epoch, epoch.epoch),
      ),
    )
    .groupBy(obeliskVotes.skinId)
    .orderBy(desc(sql`COUNT(*)`))
    .limit(1)

  if (!winner) return null

  const [skin] = await db
    .select()
    .from(obeliskSkins)
    .where(eq(obeliskSkins.id, winner.skinId))
    .limit(1)

  if (!skin) return null

  return {
    id: skin.id,
    name: skin.name,
    description: skin.description,
    modelConfig: JSON.parse(skin.modelConfig) as ObeliskSkinModelConfig,
    createdBy: skin.createdBy,
    createdAt: skin.createdAt,
    epoch: skin.epoch,
  }
}

export async function getDefaultSkin(): Promise<ObeliskSkin> {
  return {
    id: 'default',
    name: 'Default Obelisk',
    description: 'The standard sonar obelisk',
    modelConfig: {
      color: '#06B6D4',
      height: 1.2,
      rings: 3,
      glowColor: '#06B6D4',
      tipColor: '#ffffff',
      pattern: 'standard',
    },
    createdBy: 'system',
    createdAt: new Date(),
    epoch: 0,
  }
}
