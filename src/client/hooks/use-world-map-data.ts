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
  { code: 'CN', name: 'China', repoCount: 240, contributorCount: 920, lat: 35.86, lng: 104.19 },
  { code: 'BR', name: 'Brazil', repoCount: 112, contributorCount: 410, lat: -14.23, lng: -51.93 },
  { code: 'CA', name: 'Canada', repoCount: 145, contributorCount: 530, lat: 56.13, lng: -106.35 },
  { code: 'FR', name: 'France', repoCount: 138, contributorCount: 510, lat: 46.60, lng: 1.88 },
  { code: 'KR', name: 'South Korea', repoCount: 120, contributorCount: 450, lat: 35.91, lng: 127.77 },
  { code: 'NL', name: 'Netherlands', repoCount: 85, contributorCount: 310, lat: 52.13, lng: 5.29 },
  { code: 'RU', name: 'Russia', repoCount: 130, contributorCount: 470, lat: 61.52, lng: 105.32 },
  { code: 'SE', name: 'Sweden', repoCount: 72, contributorCount: 260, lat: 60.13, lng: 18.64 },
  { code: 'SG', name: 'Singapore', repoCount: 65, contributorCount: 230, lat: 1.35, lng: 103.82 },
  { code: 'IL', name: 'Israel', repoCount: 78, contributorCount: 290, lat: 31.05, lng: 34.85 },
  { code: 'ES', name: 'Spain', repoCount: 88, contributorCount: 320, lat: 40.46, lng: -3.75 },
  { code: 'IT', name: 'Italy', repoCount: 82, contributorCount: 300, lat: 41.87, lng: 12.57 },
  { code: 'PL', name: 'Poland', repoCount: 68, contributorCount: 250, lat: 51.92, lng: 19.15 },
  { code: 'TW', name: 'Taiwan', repoCount: 75, contributorCount: 270, lat: 23.70, lng: 120.96 },
  { code: 'CH', name: 'Switzerland', repoCount: 60, contributorCount: 220, lat: 46.82, lng: 8.23 },
  { code: 'FI', name: 'Finland', repoCount: 45, contributorCount: 160, lat: 61.92, lng: 25.75 },
  { code: 'NO', name: 'Norway', repoCount: 48, contributorCount: 170, lat: 60.47, lng: 8.47 },
  { code: 'DK', name: 'Denmark', repoCount: 52, contributorCount: 190, lat: 56.26, lng: 9.50 },
]

export function useWorldMapData() {
  return {
    countries: mockCountries,
    loading: false,
  }
}
