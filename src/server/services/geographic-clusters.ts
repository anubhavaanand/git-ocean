import { geocodeLocation } from './geocoding'

export interface GeocodedUser {
  userId: string
  username?: string
  location?: string
  languages?: string[]
  repoCount: number
  contributionCount: number
}

export interface CountryCluster {
  countryCode: string
  countryName: string
  lat: number
  lng: number
  userCount: number
  repoCount: number
  contributorCount: number
  topLanguages: string[]
}

export interface CityCluster {
  countryCode: string
  city: string
  lat: number
  lng: number
  userCount: number
  topLanguages: string[]
}

export interface LanguageDistrict {
  name: string
  percentage: number
}

export interface LanguageColony {
  name: string
  language: string
  terrainType: string
  visualCharacter: string
  users: GeocodedUser[]
  position: { lat: number; lng: number }
}

export interface ColonyStatistic {
  colonyName: string
  language: string
  totalUsers: number
  languageDiversityIndex: number
  averageActivityLevel: number
}

export function aggregateByCountry(users: GeocodedUser[]): CountryCluster[] {
  const geoUsers = users.map((u) => ({
    user: u,
    geo: u.location ? geocodeLocation(u.location) : null,
  }))

  const countryMap = new Map<
    string,
    {
      countryName: string
      lat: number
      lng: number
      users: Set<string>
      repoCount: number
      contributionCount: number
      languages: Map<string, number>
    }
  >()

  for (const { user, geo } of geoUsers) {
    if (!geo || geo.confidence === 'low') continue

    const code = geo.countryCode
    const existing = countryMap.get(code)
    if (existing) {
      existing.users.add(user.userId)
      existing.repoCount += user.repoCount
      existing.contributionCount += user.contributionCount
      for (const lang of user.languages ?? []) {
        existing.languages.set(lang, (existing.languages.get(lang) ?? 0) + 1)
      }
    } else {
      const languages = new Map<string, number>()
      for (const lang of user.languages ?? []) {
        languages.set(lang, 1)
      }
      countryMap.set(code, {
        countryName: geo.countryName,
        lat: geo.lat,
        lng: geo.lng,
        users: new Set([user.userId]),
        repoCount: user.repoCount,
        contributionCount: user.contributionCount,
        languages,
      })
    }
  }

  return Array.from(countryMap.entries())
    .map(([code, data]) => ({
      countryCode: code,
      countryName: data.countryName,
      lat: data.lat,
      lng: data.lng,
      userCount: data.users.size,
      repoCount: data.repoCount,
      contributorCount: data.contributionCount,
      topLanguages: Array.from(data.languages.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([lang]) => lang),
    }))
    .sort((a, b) => b.userCount - a.userCount)
}

export function clusterByCity(users: GeocodedUser[]): CityCluster[] {
  const geoUsers = users.map((u) => ({
    user: u,
    geo: u.location ? geocodeLocation(u.location) : null,
  }))

  type CityKey = string
  const cityMap = new Map<
    CityKey,
    {
      countryCode: string
      city: string
      lat: number
      lng: number
      users: Set<string>
      languages: Map<string, number>
    }
  >()

  for (const { user, geo } of geoUsers) {
    if (!geo || geo.confidence === 'low') continue

    const key = `${geo.countryCode}:${geo.city}`
    const existing = cityMap.get(key)

    if (existing) {
      existing.users.add(user.userId)
      for (const lang of user.languages ?? []) {
        existing.languages.set(lang, (existing.languages.get(lang) ?? 0) + 1)
      }
    } else {
      const languages = new Map<string, number>()
      for (const lang of user.languages ?? []) {
        languages.set(lang, 1)
      }
      cityMap.set(key, {
        countryCode: geo.countryCode,
        city: geo.city,
        lat: geo.lat,
        lng: geo.lng,
        users: new Set([user.userId]),
        languages,
      })
    }
  }

  return Array.from(cityMap.values())
    .map((data) => ({
      countryCode: data.countryCode,
      city: data.city,
      lat: data.lat,
      lng: data.lng,
      userCount: data.users.size,
      topLanguages: Array.from(data.languages.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([lang]) => lang),
    }))
    .sort((a, b) => b.userCount - a.userCount)
}

const LANGUAGE_DISTRICT_ORDER = [
  'JavaScript',
  'Python',
  'Java',
  'TypeScript',
  'C/C++',
  'Go',
  'Rust',
] as const

export function sortLanguageDistricts(languageCounts: Map<string, number>): LanguageDistrict[] {
  const total = Array.from(languageCounts.values()).reduce((sum, count) => sum + count, 0)
  if (total === 0) return []

  const ordered: { name: string; percentage: number }[] = []
  let nicheTotal = 0

  for (const lang of LANGUAGE_DISTRICT_ORDER) {
    const count = languageCounts.get(lang) ?? 0
    if (count > 0) {
      ordered.push({ name: lang, percentage: Math.round((count / total) * 100) })
    }
  }

  for (const [lang, count] of languageCounts) {
    if (!(LANGUAGE_DISTRICT_ORDER as readonly string[]).includes(lang)) {
      nicheTotal += count
    }
  }

  if (nicheTotal > 0) {
    ordered.push({ name: 'Niche', percentage: Math.round((nicheTotal / total) * 100) })
  }

  const used = ordered.reduce((sum, d) => sum + d.percentage, 0)
  if (used < 100 && ordered.length > 0) {
    ordered[ordered.length - 1]!.percentage += 100 - used
  }

  return ordered
}

const COLONY_DEFINITIONS: Omit<LanguageColony, 'users'>[] = [
  {
    name: 'The Python Trench',
    language: 'Python',
    terrainType: 'wide deep trench',
    visualCharacter: 'broad welcoming terrain',
    position: { lat: 0, lng: -30 },
  },
  {
    name: 'The JavaScript Current',
    language: 'JavaScript',
    terrainType: 'fast-moving water shader zone',
    visualCharacter: 'chaotic, massive',
    position: { lat: 0, lng: 30 },
  },
  {
    name: 'The Rust Ridge',
    language: 'Rust',
    terrainType: 'sharp dramatic rock formations',
    visualCharacter: 'precise angular',
    position: { lat: 30, lng: 0 },
  },
  {
    name: 'The Go Shelf',
    language: 'Go',
    terrainType: 'clean continental shelf',
    visualCharacter: 'minimal efficient flat terrain',
    position: { lat: -30, lng: 0 },
  },
  {
    name: 'The C++ Abyss',
    language: 'C++',
    terrainType: 'deep ancient geological',
    visualCharacter: 'intimidating scale',
    position: { lat: 20, lng: 20 },
  },
  {
    name: 'The TypeScript Plateau',
    language: 'TypeScript',
    terrainType: 'elevated structured plateau',
    visualCharacter: 'clearly bounded',
    position: { lat: -20, lng: -20 },
  },
  {
    name: 'The Ruby Cove',
    language: 'Ruby',
    terrainType: 'warm shallow cove',
    visualCharacter: 'small tight community feel',
    position: { lat: 10, lng: -40 },
  },
]

const OTHER_POSITIONS = [
  { lat: -10, lng: 50 },
  { lat: 15, lng: -60 },
  { lat: -25, lng: 70 },
  { lat: 40, lng: -50 },
  { lat: -35, lng: -10 },
]

export function getLanguageColonies(unlocatedUsers: GeocodedUser[]): LanguageColony[] {
  const colonyMap = new Map<string, GeocodedUser[]>()

  for (const user of unlocatedUsers) {
    const langs = user.languages ?? []
    const primaryLang = langs[0] ?? 'Other'

    const existing = colonyMap.get(primaryLang)
    if (existing) {
      existing.push(user)
    } else {
      colonyMap.set(primaryLang, [user])
    }
  }

  const colonies: LanguageColony[] = []

  let otherIndex = 0

  for (const [lang, users] of colonyMap) {
    const def = COLONY_DEFINITIONS.find((d) => d.language === lang)
    if (def) {
      colonies.push({
        ...def,
        users,
      })
    } else {
      const posIndex = otherIndex < OTHER_POSITIONS.length ? otherIndex : 0
      colonies.push({
        name: `The ${lang} Expanse`,
        language: lang,
        terrainType: 'Various',
        visualCharacter: 'Uncharted waters',
        users,
        position: OTHER_POSITIONS[posIndex]!,
      })
      otherIndex++
    }
  }

  return colonies.sort((a, b) => b.users.length - a.users.length)
}

export function getColonyStatistics(colonies: LanguageColony[]): ColonyStatistic[] {
  return colonies.map((colony) => {
    const allLangs = new Set<string>()
    let totalRepoCount = 0

    for (const user of colony.users) {
      for (const lang of user.languages ?? []) {
        allLangs.add(lang)
      }
      totalRepoCount += user.repoCount
    }

    const totalUsers = colony.users.length
    const languageDiversityIndex = totalUsers > 0 ? allLangs.size / totalUsers : 0
    const averageActivityLevel = totalUsers > 0 ? totalRepoCount / totalUsers : 0

    return {
      colonyName: colony.name,
      language: colony.language,
      totalUsers,
      languageDiversityIndex: Math.round(languageDiversityIndex * 100) / 100,
      averageActivityLevel: Math.round(averageActivityLevel * 100) / 100,
    }
  })
}

export function getUnlocatedUsers(users: GeocodedUser[]): GeocodedUser[] {
  return users.filter((u) => {
    if (!u.location) return true
    const result = geocodeLocation(u.location)
    return result.confidence === 'low'
  })
}
