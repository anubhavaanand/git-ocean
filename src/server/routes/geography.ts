import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, type AuthContext } from '@/server/middleware/auth'
import { worldMapData } from '@/server/db/git-ocean-schema'
import {
  geocodeLocation,
  searchLocations,
  getAllCountries,
  getCitiesByCountry,
} from '@/server/services/geocoding'
import {
  type GeocodedUser,
  aggregateByCountry,
  getUnlocatedUsers,
} from '@/server/services/geographic-clusters'

const app = new Hono<AuthContext>()

app.use('*', authMiddleware)

const countryCodeParamsSchema = z.object({
  code: z.string().min(1).max(3),
})

const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
})

const locateBodySchema = z.object({
  location: z.string().min(1).max(200),
})

app.get('/countries', async (c) => {
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)

  const allWorldData = await db
    .select()
    .from(worldMapData)
    .where(eq(worldMapData.userId, userId))

  if (allWorldData.length === 0) {
    return c.json([])
  }

  const userMap = new Map<string, {
    username: string
    repoCount: number
    contributionCount: number
    languages: string[]
  }>()

  const languagesByCountry = new Map<string, Set<string>>()

  for (const row of allWorldData) {
    languagesByCountry.set(row.country, new Set())

    userMap.set(row.country, {
      username: row.country,
      repoCount: (userMap.get(row.country)?.repoCount ?? 0) + row.repoCount,
      contributionCount: (userMap.get(row.country)?.contributionCount ?? 0) + row.contributionCount,
      languages: [],
    })
  }

  const geocodedUsers: GeocodedUser[] = Array.from(userMap.entries()).map(([country, data]) => ({
    userId: `${userId}-${country}`,
    username: data.username,
    location: country,
    languages: Array.from(languagesByCountry.get(country) ?? []),
    repoCount: data.repoCount,
    contributionCount: data.contributionCount,
  }))

  const countries = aggregateByCountry(geocodedUsers)

  return c.json(countries)
})

app.get('/countries/:code', zValidator('param', countryCodeParamsSchema), async (c) => {
  const { code } = c.req.valid('param')
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)

  const countryRows = await db
    .select()
    .from(worldMapData)
    .where(sql`${worldMapData.country} = ${code} AND ${worldMapData.userId} = ${userId}`)

  const cities = getCitiesByCountry(code.toUpperCase())

  const dbRepos = countryRows.reduce((sum, r) => sum + r.repoCount, 0)
  const dbContribs = countryRows.reduce((sum, r) => sum + r.contributionCount, 0)

  let lat: number
  let lng: number
  let countryName: string
  if (cities.length > 0) {
    lat = cities.reduce((s, c) => s + c.lat, 0) / cities.length
    lng = cities.reduce((s, c) => s + c.lng, 0) / cities.length
    countryName = cities[0]!.countryName
  } else {
    lat = 0
    lng = 0
    countryName = code.toUpperCase()
  }

  const cityClusters = Array.from(
    new Map(
      cities.map((c) => [
        c.city,
        {
          city: c.city,
          lat: c.lat,
          lng: c.lng,
          userCount: 1,
          topLanguages: ['JavaScript', 'TypeScript', 'Python'],
        },
      ]),
    ).values(),
  )

  return c.json({
    countryCode: code.toUpperCase(),
    countryName,
    lat,
    lng,
    userCount: countryRows.length,
    repoCount: dbRepos,
    contributionCount: dbContribs,
    cities: cityClusters,
  })
})

app.get('/search', zValidator('query', searchQuerySchema), async (c) => {
  const { q } = c.req.valid('query')
  const results = searchLocations(q)
  return c.json(results)
})

app.get('/colonies', async (c) => {
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)

  const allWorldData = await db
    .select()
    .from(worldMapData)
    .where(eq(worldMapData.userId, userId))

  const geocodedUsers: GeocodedUser[] = allWorldData.map((row) => ({
    userId: `${userId}-${row.country}`,
    location: row.country,
    repoCount: row.repoCount,
    contributionCount: row.contributionCount,
    languages: [],
  }))

  const unlocated = getUnlocatedUsers(geocodedUsers)

  return c.json(
    unlocated.map((u) => ({
      userId: u.userId,
      location: u.location,
      repoCount: u.repoCount,
      contributionCount: u.contributionCount,
    })),
  )
})

app.post('/locate', zValidator('json', locateBodySchema), async (c) => {
  const { location } = c.req.valid('json')
  const result = geocodeLocation(location)
  return c.json(result)
})

app.get('/stats', async (c) => {
  const allCountries = getAllCountries()
  return c.json({
    totalCountries: allCountries.length,
    trackedCountries: allCountries,
  })
})

export default app
