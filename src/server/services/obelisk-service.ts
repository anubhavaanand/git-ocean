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
  rawOreColor?: string
  refinedColor?: string
  crystallineColor?: string
  latticePattern?: string
}

export interface ObeliskSkin {
  id: string
  name: string
  description: string | null
  modelConfig: ObeliskSkinModelConfig
  createdBy: string
  createdAt: Date
  epoch: number
  scientificExplanation?: string
  citySpecific?: string
}

export interface ObeliskEpoch {
  id: string
  epoch: number
  startDate: Date
  endDate: Date
  active: boolean
}

export interface EtchedSkinRecord {
  skin: ObeliskSkin
  countryCode: string
  epoch: number
  totalVotes: number
  etchedAt: Date
}

const EPOCH_DURATION_DAYS = 7
const CITY_SKIN_THEMES: Record<string, Partial<ObeliskSkinModelConfig>> = {
  silicon: {
    color: '#4a90d9',
    rawOreColor: '#1a1a2e',
    refinedColor: '#3a6ea5',
    crystallineColor: '#6ab0e6',
    pattern: 'crystal-lattice',
    tipColor: '#ffffff',
  },
  coral: {
    color: '#ff6b6b',
    rawOreColor: '#2d1a1a',
    refinedColor: '#c94a4a',
    crystallineColor: '#ff8e8e',
    pattern: 'reef-structure',
    tipColor: '#ffd700',
  },
  abyssal: {
    color: '#1a1a3e',
    rawOreColor: '#0d0d1a',
    refinedColor: '#2a2a4e',
    crystallineColor: '#4a4a7e',
    pattern: 'deep-thermal',
    tipColor: '#00ff88',
  },
  tech: {
    color: '#00d4ff',
    rawOreColor: '#0a1628',
    refinedColor: '#0d47a1',
    crystallineColor: '#00bcd4',
    pattern: 'circuit-board',
    tipColor: '#76ff03',
  },
}

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
    name: 'Silicon Wafer Tower',
    description: 'A towering landmark built from refined ocean-floor silicon dioxide (SiO2), extracted through deep-sea mineral mining. Bottom: raw silicon ore. Top: crystalline wafer.',
    modelConfig: {
      color: '#06B6D4',
      height: 1.2,
      rings: 3,
      glowColor: '#06B6D4',
      tipColor: '#ffffff',
      pattern: 'crystal-lattice',
      rawOreColor: '#1a1a2e',
      refinedColor: '#3a6ea5',
      crystallineColor: '#6ab0e6',
    },
    createdBy: 'system',
    createdAt: new Date(),
    epoch: 0,
    scientificExplanation: 'Silicon dioxide (SiO2) is extracted from real deep ocean sediment mineral mining operations. The tower represents what happens when you refine raw geological ore into pure crystalline wafers.',
  }
}

export async function getCitySkinTheme(
  _city: string,
  dominantLanguage: string,
): Promise<Partial<ObeliskSkinModelConfig>> {
  const langLower = dominantLanguage.toLowerCase()
  if (langLower === 'python' || langLower === 'ruby') return CITY_SKIN_THEMES['coral'] ?? {}
  if (langLower === 'c++' || langLower === 'rust') return CITY_SKIN_THEMES['abyssal'] ?? {}
  if (langLower === 'typescript' || langLower === 'go') return CITY_SKIN_THEMES['tech'] ?? {}
  return CITY_SKIN_THEMES['silicon'] ?? {}
}

export async function getEtchedSkins(
  db: DrizzleD1Database,
  countryCode: string,
): Promise<EtchedSkinRecord[]> {
  const pastWinners = await db
    .select({
      skinId: obeliskVotes.skinId,
      epoch: obeliskVotes.epoch,
      count: sql<number>`COUNT(*)`,
    })
    .from(obeliskVotes)
    .where(
      and(
        eq(obeliskVotes.countryCode, countryCode),
        sql`${obeliskVotes.epoch} < (SELECT COALESCE(MAX(epoch), 0) FROM ${obeliskEpochs} WHERE active = true)`,
      ),
    )
    .groupBy(obeliskVotes.skinId, obeliskVotes.epoch)
    .orderBy(desc(obeliskVotes.epoch))
    .limit(10)

  if (pastWinners.length === 0) return []

  const records: EtchedSkinRecord[] = []
  for (const winner of pastWinners) {
    const [skin] = await db
      .select()
      .from(obeliskSkins)
      .where(eq(obeliskSkins.id, winner.skinId))
      .limit(1)
    if (skin) {
      records.push({
        skin: {
          id: skin.id,
          name: skin.name,
          description: skin.description,
          modelConfig: JSON.parse(skin.modelConfig) as ObeliskSkinModelConfig,
          createdBy: skin.createdBy,
          createdAt: skin.createdAt,
          epoch: skin.epoch,
        },
        countryCode,
        epoch: winner.epoch,
        totalVotes: winner.count,
        etchedAt: new Date(),
      })
    }
  }

  return records
}
