import { describe, it, expect } from 'vitest'
import {
  geocodeLocation,
  searchLocations,
  getAllCountries,
  getCityCount,
  getCitiesByCountry,
} from '@/server/services/geocoding'

describe('geocodeLocation', () => {
  it('returns high confidence with correct lat/lng for exact city name', () => {
    const result = geocodeLocation('Tokyo')
    expect(result.confidence).toBe('high')
    expect(result.city).toBe('Tokyo')
    expect(result.countryCode).toBe('JP')
    expect(result.countryName).toBe('Japan')
    expect(result.lat).toBe(35.6762)
    expect(result.lng).toBe(139.6503)
  })

  it('returns high confidence for "City, Country" format with known city', () => {
    const result = geocodeLocation('London, United Kingdom')
    expect(result.confidence).toBe('high')
    expect(result.city).toBe('London')
    expect(result.countryCode).toBe('GB')
    expect(result.countryName).toBe('United Kingdom')
    expect(result.lat).toBe(51.5074)
    expect(result.lng).toBe(-0.1278)
  })

  it('returns high confidence for "City, State, Country" format with known city', () => {
    const result = geocodeLocation('San Francisco, California, United States')
    expect(result.confidence).toBe('high')
    expect(result.city).toBe('San Francisco')
    expect(result.countryCode).toBe('US')
    expect(result.lat).toBe(37.7749)
    expect(result.lng).toBe(-122.4194)
  })

  it('returns medium confidence with country center when city is unknown', () => {
    const result = geocodeLocation('Nowhereville, Australia')
    expect(result.confidence).toBe('medium')
    expect(result.countryCode).toBe('AU')
    expect(result.countryName).toBe('Australia')
    expect(result.city).toBe('Nowhereville')
    expect(result.lat).toBeCloseTo(-33.552, 1)
    expect(result.lng).toBeCloseTo(142.131, 1)
  })

  it('returns medium confidence for fuzzy city name match', () => {
    const result = geocodeLocation('New Yor')
    expect(result.confidence).toBe('medium')
    expect(result.city).toBe('New York')
    expect(result.countryCode).toBe('US')
    expect(result.lat).toBe(40.7128)
    expect(result.lng).toBe(-74.006)
  })

  it('returns low confidence for completely unknown location', () => {
    const result = geocodeLocation('Atlantis')
    expect(result.confidence).toBe('low')
    expect(result.lat).toBe(0)
    expect(result.lng).toBe(0)
    expect(result.countryCode).toBe('XX')
    expect(result.countryName).toBe('Unknown')
    expect(result.city).toBe('Atlantis')
  })

  it('returns high confidence for "Delhi, India" mapping to New Delhi', () => {
    const result = geocodeLocation('Delhi, India')
    expect(result.confidence).toBe('high')
    expect(result.city).toBe('New Delhi')
    expect(result.countryCode).toBe('IN')
    expect(result.countryName).toBe('India')
    expect(result.lat).toBe(28.7041)
    expect(result.lng).toBe(77.1025)
  })

  it('returns medium confidence for "India" mapping to New Delhi station default', () => {
    const result = geocodeLocation('India')
    expect(result.confidence).toBe('medium')
    expect(result.city).toBe('New Delhi')
    expect(result.countryCode).toBe('IN')
    expect(result.countryName).toBe('India')
    expect(result.lat).toBe(28.7041)
    expect(result.lng).toBe(77.1025)
  })

  it('returns low confidence for "Earth" mapping to deep ocean scatter fallback', () => {
    const result = geocodeLocation('Earth')
    expect(result.confidence).toBe('low')
    expect(result.city).toBe('Earth')
    expect(result.countryCode).toBe('XX')
    expect(result.countryName).toBe('Unknown')
    expect(result.lat).toBe(0)
    expect(result.lng).toBe(0)
  })

  it('returns low confidence for empty string', () => {
    const result = geocodeLocation('')
    expect(result.confidence).toBe('low')
    expect(result.lat).toBe(0)
    expect(result.lng).toBe(0)
    expect(result.countryCode).toBe('XX')
    expect(result.countryName).toBe('Unknown')
  })

  it('returns low confidence for whitespace-only string', () => {
    const result = geocodeLocation('   ')
    expect(result.confidence).toBe('low')
    expect(result.lat).toBe(0)
    expect(result.lng).toBe(0)
  })
})

describe('searchLocations', () => {
  it('finds cities by partial city name', () => {
    const results = searchLocations('York')
    expect(results.length).toBeGreaterThan(0)
    expect(results.some((r) => r.city === 'New York')).toBe(true)
  })

  it('finds cities by country name', () => {
    const results = searchLocations('Australia')
    expect(results).toHaveLength(6)
    expect(results.every((r) => r.countryCode === 'AU')).toBe(true)
  })

  it('finds cities by country name', () => {
    const results = searchLocations('Germany')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((r) => r.countryName === 'Germany')).toBe(true)
  })

  it('finds cities by region', () => {
    const results = searchLocations('California')
    expect(results).toHaveLength(3)
    expect(results.every((r) => r.countryCode === 'US')).toBe(true)
    expect(results.map((r) => r.city)).toContain('San Francisco')
    expect(results.map((r) => r.city)).toContain('Los Angeles')
    expect(results.map((r) => r.city)).toContain('San Diego')
  })

  it('returns empty array for empty query', () => {
    expect(searchLocations('')).toHaveLength(0)
  })

  it('returns results with high confidence', () => {
    const results = searchLocations('London')
    for (const r of results) {
      expect(r.confidence).toBe('high')
    }
  })
})

describe('getAllCountries', () => {
  it('returns unique country entries with no duplicate codes', () => {
    const countries = getAllCountries()
    const codes = countries.map((c) => c.countryCode)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('includes US, GB, JP, and AU', () => {
    const codes = getAllCountries().map((c) => c.countryCode)
    expect(codes).toContain('US')
    expect(codes).toContain('GB')
    expect(codes).toContain('JP')
    expect(codes).toContain('AU')
  })

  it('each entry has non-zero coordinates', () => {
    const countries = getAllCountries()
    for (const c of countries) {
      expect(typeof c.lat).toBe('number')
      expect(typeof c.lng).toBe('number')
      expect(c.lat).not.toBe(0)
      expect(c.lng).not.toBe(0)
    }
  })

  it('returns a reasonable number of unique countries', () => {
    const count = getAllCountries().length
    expect(count).toBeGreaterThan(40)
    expect(count).toBeLessThan(100)
  })
})

describe('getCityCount', () => {
  it('returns the total number of cities in the lookup', () => {
    const count = getCityCount()
    expect(count).toBeGreaterThanOrEqual(159)
  })
})

describe('getCitiesByCountry', () => {
  it('returns all 17 US cities', () => {
    const cities = getCitiesByCountry('US')
    expect(cities).toHaveLength(17)
    expect(cities.every((c) => c.countryCode === 'US')).toBe(true)
  })

  it('returns all 6 Australian cities', () => {
    const cities = getCitiesByCountry('AU')
    expect(cities).toHaveLength(6)
    expect(cities.map((c) => c.city)).toEqual(
      expect.arrayContaining(['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra']),
    )
  })

  it('returns all 5 British cities', () => {
    const cities = getCitiesByCountry('GB')
    expect(cities).toHaveLength(5)
    expect(cities.map((c) => c.city)).toEqual(
      expect.arrayContaining(['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Glasgow']),
    )
  })

  it('returns empty array for unknown country code', () => {
    expect(getCitiesByCountry('ZZ')).toHaveLength(0)
  })
})
