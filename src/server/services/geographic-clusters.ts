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

const LANGUAGE_WEIGHTS = [0.35, 0.25, 0.18, 0.12, 0.10]

export function sortLanguageDistricts(cluster: CityCluster): LanguageDistrict[] {
  const langs = cluster.topLanguages
  if (langs.length === 0) return []

  const weights = langs.slice(0, 5).map((name, i) => ({
    name,
    percentage: Math.round(LANGUAGE_WEIGHTS[i]! * 100),
  }))

  const used = weights.reduce((sum, w) => sum + w.percentage, 0)
  if (used < 100) {
    weights[weights.length - 1]!.percentage += 100 - used
  }

  return weights.sort((a, b) => b.percentage - a.percentage)
}

export function getUnlocatedUsers(users: GeocodedUser[]): GeocodedUser[] {
  return users.filter((u) => {
    if (!u.location) return true
    const result = geocodeLocation(u.location)
    return result.confidence === 'low'
  })
}
