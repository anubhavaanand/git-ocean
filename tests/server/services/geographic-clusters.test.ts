import { describe, it, expect, vi } from 'vitest'
import type { GeocodedUser, LanguageColony } from '@/server/services/geographic-clusters'

const { mockGeocodeLocation } = vi.hoisted(() => ({
  mockGeocodeLocation: vi.fn(),
}))

vi.mock('@/server/services/geocoding', () => ({
  geocodeLocation: mockGeocodeLocation,
}))

const {
  aggregateByCountry,
  clusterByCity,
  sortLanguageDistricts,
  getLanguageColonies,
  getColonyStatistics,
  getUnlocatedUsers,
} = await import('@/server/services/geographic-clusters')

const usHigh = { lat: 40.7128, lng: -74.006, countryCode: 'US', countryName: 'United States', city: 'New York', confidence: 'high' as const }
const sfHigh = { lat: 37.7749, lng: -122.4194, countryCode: 'US', countryName: 'United States', city: 'San Francisco', confidence: 'high' as const }
const gbHigh = { lat: 51.5074, lng: -0.1278, countryCode: 'GB', countryName: 'United Kingdom', city: 'London', confidence: 'high' as const }
const auHigh = { lat: -33.8688, lng: 151.2093, countryCode: 'AU', countryName: 'Australia', city: 'Sydney', confidence: 'high' as const }
const lowConf = { lat: 0, lng: 0, countryCode: 'XX', countryName: 'Unknown', city: 'Unknown', confidence: 'low' as const }

describe('aggregateByCountry', () => {
  beforeEach(() => {
    mockGeocodeLocation.mockReset()
  })

  it('groups users by country and returns clusters sorted by userCount desc', () => {
    mockGeocodeLocation
      .mockReturnValueOnce(usHigh)
      .mockReturnValueOnce(sfHigh)
      .mockReturnValueOnce(gbHigh)
      .mockReturnValueOnce(auHigh)

    const users: GeocodedUser[] = [
      { userId: '1', location: 'New York, USA', languages: ['JavaScript', 'TypeScript'], repoCount: 10, contributionCount: 50 },
      { userId: '2', location: 'San Francisco, USA', languages: ['Python', 'TypeScript'], repoCount: 5, contributionCount: 30 },
      { userId: '3', location: 'London, UK', languages: ['JavaScript'], repoCount: 8, contributionCount: 20 },
      { userId: '4', location: 'Sydney, AU', languages: ['Rust', 'Go'], repoCount: 15, contributionCount: 40 },
    ]

    const clusters = aggregateByCountry(users)

    expect(clusters).toHaveLength(3)
    expect(clusters[0]!.countryCode).toBe('US')
    expect(clusters[0]!.userCount).toBe(2)
    expect(clusters[0]!.repoCount).toBe(15)
    expect(clusters[0]!.contributorCount).toBe(80)
    expect(clusters[0]!.topLanguages).toEqual(['TypeScript', 'JavaScript', 'Python'])

    expect(clusters[1]!.countryCode).toBe('GB')
    expect(clusters[1]!.userCount).toBe(1)

    expect(clusters[2]!.countryCode).toBe('AU')
    expect(clusters[2]!.userCount).toBe(1)
  })

  it('filters out low-confidence geocode results', () => {
    mockGeocodeLocation
      .mockReturnValueOnce(usHigh)
      .mockReturnValueOnce(lowConf)
      .mockReturnValueOnce(gbHigh)

    const users: GeocodedUser[] = [
      { userId: '1', location: 'New York, USA', languages: ['JavaScript'], repoCount: 5, contributionCount: 10 },
      { userId: '2', location: 'Unknown', languages: ['Java'], repoCount: 3, contributionCount: 5 },
      { userId: '3', location: 'London, UK', languages: ['Python'], repoCount: 7, contributionCount: 15 },
    ]

    const clusters = aggregateByCountry(users)
    expect(clusters).toHaveLength(2)
    expect(clusters.every((c) => c.countryCode !== 'XX')).toBe(true)
  })

  it('returns empty array when all users have low confidence', () => {
    mockGeocodeLocation.mockReturnValue(lowConf)
    const users: GeocodedUser[] = [
      { userId: '1', location: 'Unknown', languages: [], repoCount: 0, contributionCount: 0 },
    ]
    expect(aggregateByCountry(users)).toHaveLength(0)
  })

  it('handles users without location gracefully', () => {
    const users: GeocodedUser[] = [
      { userId: '1', location: 'New York, USA', languages: ['JavaScript'], repoCount: 5, contributionCount: 10 },
      { userId: '2', languages: [], repoCount: 0, contributionCount: 0 },
    ]
    mockGeocodeLocation.mockReturnValueOnce(usHigh)
    const clusters = aggregateByCountry(users)
    expect(clusters).toHaveLength(1)
  })
})

describe('clusterByCity', () => {
  beforeEach(() => {
    mockGeocodeLocation.mockReset()
  })

  it('groups users by city', () => {
    mockGeocodeLocation
      .mockReturnValueOnce(usHigh)
      .mockReturnValueOnce(usHigh)
      .mockReturnValueOnce(sfHigh)
      .mockReturnValueOnce(gbHigh)

    const users: GeocodedUser[] = [
      { userId: '1', location: 'New York, USA', languages: ['JavaScript'], repoCount: 1, contributionCount: 1 },
      { userId: '2', location: 'New York, USA', languages: ['TypeScript'], repoCount: 1, contributionCount: 1 },
      { userId: '3', location: 'San Francisco, USA', languages: ['Python'], repoCount: 1, contributionCount: 1 },
      { userId: '4', location: 'London, UK', languages: ['Rust'], repoCount: 1, contributionCount: 1 },
    ]

    const clusters = clusterByCity(users)
    expect(clusters).toHaveLength(3)

    const nyc = clusters.find((c) => c.city === 'New York')
    expect(nyc).toBeDefined()
    expect(nyc!.userCount).toBe(2)
    expect(nyc!.countryCode).toBe('US')
  })

  it('filters out low-confidence locations', () => {
    mockGeocodeLocation
      .mockReturnValueOnce(usHigh)
      .mockReturnValueOnce(lowConf)

    const users: GeocodedUser[] = [
      { userId: '1', location: 'New York, USA', languages: [], repoCount: 1, contributionCount: 1 },
      { userId: '2', location: 'Somewhere', languages: [], repoCount: 1, contributionCount: 1 },
    ]

    expect(clusterByCity(users)).toHaveLength(1)
  })
})

describe('sortLanguageDistricts', () => {
  it('returns languages in canonical order with correct percentages', () => {
    const counts = new Map<string, number>([
      ['JavaScript', 30],
      ['Python', 25],
      ['Java', 15],
      ['TypeScript', 10],
      ['C/C++', 5],
      ['Go', 5],
      ['Rust', 5],
      ['Kotlin', 3],
      ['Swift', 2],
    ])

    const districts = sortLanguageDistricts(counts)
    expect(districts.map((d) => d.name)).toEqual([
      'JavaScript',
      'Python',
      'Java',
      'TypeScript',
      'C/C++',
      'Go',
      'Rust',
      'Niche',
    ])
    expect(districts.map((d) => d.percentage)).toEqual([30, 25, 15, 10, 5, 5, 5, 5])
  })

  it('percentages always sum to 100', () => {
    const counts = new Map<string, number>([
      ['JavaScript', 33],
      ['Python', 33],
      ['Rust', 33],
    ])
    const districts = sortLanguageDistricts(counts)
    const total = districts.reduce((s, d) => s + d.percentage, 0)
    expect(total).toBe(100)
  })

  it('only listed languages appear in order when no niche languages', () => {
    const counts = new Map<string, number>([
      ['JavaScript', 50],
      ['Python', 30],
      ['Go', 20],
    ])
    const districts = sortLanguageDistricts(counts)
    expect(districts.map((d) => d.name)).toEqual(['JavaScript', 'Python', 'Go'])
    expect(districts.reduce((s, d) => s + d.percentage, 0)).toBe(100)
  })

  it('adds remainder to last entry when rounding loses precision', () => {
    const counts = new Map<string, number>([
      ['JavaScript', 33],
      ['Python', 33],
      ['Rust', 33],
      ['OtherLang', 1],
    ])
    const districts = sortLanguageDistricts(counts)
    const total = districts.reduce((s, d) => s + d.percentage, 0)
    expect(total).toBe(100)
    expect(districts[districts.length - 1]!.percentage).toBeGreaterThanOrEqual(1)
  })

  it('returns empty array for empty map', () => {
    expect(sortLanguageDistricts(new Map())).toHaveLength(0)
  })

  it('returns empty array when all counts are zero', () => {
    const counts = new Map([['JavaScript', 0]])
    expect(sortLanguageDistricts(counts)).toHaveLength(0)
  })
})

describe('getLanguageColonies', () => {
  beforeEach(() => {
    mockGeocodeLocation.mockReset()
  })

  it('assigns users to correct colonies by primary language and sorts by size desc', () => {
    const users: GeocodedUser[] = [
      { userId: '1', languages: ['Python', 'JavaScript'], repoCount: 5, contributionCount: 10 },
      { userId: '2', languages: ['Python'], repoCount: 3, contributionCount: 5 },
      { userId: '3', languages: ['JavaScript'], repoCount: 8, contributionCount: 15 },
      { userId: '4', languages: [], repoCount: 2, contributionCount: 3 },
      { userId: '5', languages: ['Kotlin'], repoCount: 1, contributionCount: 2 },
      { userId: '6', languages: ['Rust'], repoCount: 7, contributionCount: 12 },
    ]

    const colonies = getLanguageColonies(users)

    expect(colonies).toHaveLength(5)

    const pythonColony = colonies.find((c) => c.name === 'The Python Trench')!
    expect(pythonColony.users).toHaveLength(2)
    expect(pythonColony.language).toBe('Python')

    expect(colonies.find((c) => c.name === 'The JavaScript Current')!.users).toHaveLength(1)
    expect(colonies.find((c) => c.name === 'The Rust Ridge')!.users).toHaveLength(1)

    const otherExpanse = colonies.find((c) => c.language === 'Other')!
    expect(otherExpanse.name).toBe('The Other Expanse')
    expect(otherExpanse.users).toHaveLength(1)

    const kotlinExpanse = colonies.find((c) => c.language === 'Kotlin')!
    expect(kotlinExpanse.name).toBe('The Kotlin Expanse')
    expect(kotlinExpanse.users).toHaveLength(1)

    expect(colonies[0]!.users).toHaveLength(2)
    expect(colonies[1]!.users).toHaveLength(1)
  })

  it('creates expanse colonies for unlisted languages', () => {
    const users: GeocodedUser[] = [
      { userId: '1', languages: ['COBOL'], repoCount: 1, contributionCount: 1 },
    ]
    const colonies = getLanguageColonies(users)
    expect(colonies).toHaveLength(1)
    expect(colonies[0]!.name).toBe('The COBOL Expanse')
    expect(colonies[0]!.language).toBe('COBOL')
    expect(colonies[0]!.terrainType).toBe('Various')
    expect(colonies[0]!.visualCharacter).toBe('Uncharted waters')
  })
})

describe('getColonyStatistics', () => {
  it('computes diversity index and average activity correctly', () => {
    const colony: LanguageColony = {
      name: 'The Python Trench',
      language: 'Python',
      terrainType: 'Trench',
      visualCharacter: 'Deep',
      position: { lat: 0, lng: -30 },
      users: [
        { userId: '1', languages: ['Python', 'JavaScript'], repoCount: 10, contributionCount: 20 },
        { userId: '2', languages: ['Python', 'Rust', 'Go'], repoCount: 5, contributionCount: 10 },
      ],
    }

    const stats = getColonyStatistics([colony])
    expect(stats).toHaveLength(1)
    expect(stats[0]!.colonyName).toBe('The Python Trench')
    expect(stats[0]!.language).toBe('Python')
    expect(stats[0]!.totalUsers).toBe(2)
    expect(stats[0]!.languageDiversityIndex).toBe(2)
    expect(stats[0]!.averageActivityLevel).toBe(7.5)
  })

  it('handles empty languages gracefully', () => {
    const colony: LanguageColony = {
      name: 'The Other Expanse',
      language: 'Other',
      terrainType: 'Various',
      visualCharacter: 'Uncharted waters',
      position: { lat: 0, lng: 0 },
      users: [
        { userId: '1', languages: [], repoCount: 0, contributionCount: 0 },
      ],
    }

    const stats = getColonyStatistics([colony])
    expect(stats[0]!.languageDiversityIndex).toBe(0)
    expect(stats[0]!.averageActivityLevel).toBe(0)
  })

  it('returns stats for multiple colonies', () => {
    const colonies: LanguageColony[] = [
      {
        name: 'The Python Trench',
        language: 'Python',
        terrainType: 'Trench',
        visualCharacter: 'Deep',
        position: { lat: 0, lng: 0 },
        users: [
          { userId: '1', languages: ['Python'], repoCount: 10, contributionCount: 20 },
        ],
      },
      {
        name: 'The JavaScript Current',
        language: 'JavaScript',
        terrainType: 'Current',
        visualCharacter: 'Fast',
        position: { lat: 0, lng: 0 },
        users: [
          { userId: '2', languages: ['JavaScript', 'TypeScript'], repoCount: 5, contributionCount: 10 },
        ],
      },
    ]

    const stats = getColonyStatistics(colonies)
    expect(stats).toHaveLength(2)
    expect(stats[0]!.colonyName).toBe('The Python Trench')
    expect(stats[1]!.colonyName).toBe('The JavaScript Current')
  })
})

describe('getUnlocatedUsers', () => {
  beforeEach(() => {
    mockGeocodeLocation.mockReset()
  })

  it('returns users without location', () => {
    mockGeocodeLocation.mockReturnValue(gbHigh)
    const users: GeocodedUser[] = [
      { userId: '1', location: 'London, UK', languages: [], repoCount: 1, contributionCount: 1 },
      { userId: '2', languages: [], repoCount: 1, contributionCount: 1 },
    ]
    const unlocated = getUnlocatedUsers(users)
    expect(unlocated).toHaveLength(1)
    expect(unlocated[0]!.userId).toBe('2')
  })

  it('returns users with low-confidence geocode result', () => {
    mockGeocodeLocation
      .mockReturnValueOnce(usHigh)
      .mockReturnValueOnce(gbHigh)
      .mockReturnValueOnce(lowConf)

    const users: GeocodedUser[] = [
      { userId: '1', location: 'New York, USA', languages: [], repoCount: 1, contributionCount: 1 },
      { userId: '2', location: 'London, UK', languages: [], repoCount: 1, contributionCount: 1 },
      { userId: '3', location: 'Atlantis', languages: [], repoCount: 1, contributionCount: 1 },
    ]
    const unlocated = getUnlocatedUsers(users)
    expect(unlocated).toHaveLength(1)
    expect(unlocated[0]!.userId).toBe('3')
  })

  it('excludes users with high or medium confidence geocode', () => {
    const medConf = { ...usHigh, confidence: 'medium' as const }
    mockGeocodeLocation
      .mockReturnValueOnce(usHigh)
      .mockReturnValueOnce(medConf)
      .mockReturnValueOnce(lowConf)

    const users: GeocodedUser[] = [
      { userId: '1', location: 'New York, USA', languages: [], repoCount: 1, contributionCount: 1 },
      { userId: '2', location: 'Somewhere, US', languages: [], repoCount: 1, contributionCount: 1 },
      { userId: '3', location: 'Unknown', languages: [], repoCount: 1, contributionCount: 1 },
    ]
    const unlocated = getUnlocatedUsers(users)
    expect(unlocated).toHaveLength(1)
    expect(unlocated[0]!.userId).toBe('3')
  })
})
