export type WorkflowStatus = 'success' | 'failure' | 'cancelled' | 'unknown'

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
  workflowStatus?: WorkflowStatus
}

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/client/lib/api-client'

export function useOceanData() {
  const { data: dbRepos = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['ocean-repos'],
    queryFn: () => apiClient.get<any[]>('/api/ocean/repos'),
  })

  const repos: GitHubRepoData[] = dbRepos.map((row) => ({
    id: row.githubRepoId,
    name: row.fullName.split('/')[1] || row.fullName,
    fullName: row.fullName,
    description: row.description || '',
    stars: row.stars,
    forks: row.forks,
    issues: row.issues,
    language: row.language || '',
    url: `https://github.com/${row.fullName}`,
    workflowStatus: 'success',
  }))

  return {
    repos,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
  }
}
