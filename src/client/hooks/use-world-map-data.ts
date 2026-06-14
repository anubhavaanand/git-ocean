export interface CountryData {
  code: string
  name: string
  repoCount: number
  contributorCount: number
  lat: number
  lng: number
  topLanguages: string[]
  languageBreakdown: { name: string; percentage: number }[]
}

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/client/lib/api-client'

export interface CountryData {
  code: string
  name: string
  repoCount: number
  contributorCount: number
  lat: number
  lng: number
  topLanguages: string[]
  languageBreakdown: { name: string; percentage: number }[]
}

export function useWorldMapData() {
  const { data: dbCountries = [], isLoading } = useQuery<any[]>({
    queryKey: ['geography-countries'],
    queryFn: () => apiClient.get<any[]>('/api/geography/countries'),
  })

  const countries: CountryData[] = dbCountries.map((c) => ({
    code: c.countryCode,
    name: c.countryName,
    repoCount: c.repoCount,
    contributorCount: c.contributorCount,
    lat: c.lat,
    lng: c.lng,
    topLanguages: c.topLanguages || [],
    languageBreakdown: [],
  }))

  return {
    countries,
    loading: isLoading,
  }
}
