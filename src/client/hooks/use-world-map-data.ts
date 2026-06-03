export interface CountryData {
  code: string
  name: string
  repoCount: number
  contributorCount: number
  lat: number
  lng: number
}

const mockCountries: CountryData[] = [
  { code: 'US', name: 'United States', repoCount: 342, contributorCount: 1280, lat: 37.09, lng: -95.71 },
  { code: 'GB', name: 'United Kingdom', repoCount: 189, contributorCount: 720, lat: 55.38, lng: -3.44 },
  { code: 'DE', name: 'Germany', repoCount: 156, contributorCount: 590, lat: 51.16, lng: 10.45 },
  { code: 'IN', name: 'India', repoCount: 210, contributorCount: 890, lat: 20.59, lng: 78.96 },
  { code: 'JP', name: 'Japan', repoCount: 134, contributorCount: 480, lat: 36.20, lng: 138.25 },
  { code: 'AU', name: 'Australia', repoCount: 98, contributorCount: 340, lat: -25.27, lng: 133.78 },
]

export function useWorldMapData() {
  return {
    countries: mockCountries,
    loading: false,
  }
}
