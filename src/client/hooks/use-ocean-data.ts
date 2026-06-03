export interface GitHubRepoData {
  id: number
  name: string
  fullName: string
  description: string
  stars: number
  forks: number
  issues: number
  language: string
  url: string
}

const mockRepos: GitHubRepoData[] = [
  {
    id: 1,
    name: 'ocean-engine',
    fullName: 'user/ocean-engine',
    description: 'A 3D ocean rendering engine powered by WebGL',
    stars: 85,
    forks: 23,
    issues: 5,
    language: 'TypeScript',
    url: 'https://github.com/user/ocean-engine',
  },
  {
    id: 2,
    name: 'coral-db',
    fullName: 'user/coral-db',
    description: 'Distributed coral reef database',
    stars: 42,
    forks: 15,
    issues: 12,
    language: 'Rust',
    url: 'https://github.com/user/coral-db',
  },
  {
    id: 3,
    name: 'whale-cli',
    fullName: 'user/whale-cli',
    description: 'A CLI tool for whale migration patterns',
    stars: 128,
    forks: 45,
    issues: 3,
    language: 'Go',
    url: 'https://github.com/user/whale-cli',
  },
]

export function useOceanData() {
  return {
    repos: mockRepos,
    loading: false,
    error: null as string | null,
  }
}
