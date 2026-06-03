import { z } from 'zod'

export const GitHubUserProfile = z.object({
  login: z.string(),
  name: z.string().nullable(),
  avatar_url: z.string(),
  location: z.string().nullable(),
  bio: z.string().nullable(),
  public_repos: z.number(),
  followers: z.number(),
})
export type GitHubUserProfile = z.infer<typeof GitHubUserProfile>

export const GitHubRepo = z.object({
  id: z.number(),
  full_name: z.string(),
  description: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  open_issues_count: z.number(),
  language: z.string().nullable(),
  updated_at: z.string(),
  html_url: z.string(),
})
export type GitHubRepo = z.infer<typeof GitHubRepo>

export const RepoDetails = z.object({
  full_name: z.string(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  open_issues_count: z.number(),
  updated_at: z.string(),
  html_url: z.string(),
  open_pr_count: z.number(),
  release_count: z.number(),
  watchers_count: z.number(),
  merged_pr_count: z.number(),
  contributor_count: z.number(),
  languages: z.array(z.object({ name: z.string(), size: z.number() })),
  topics: z.array(z.string()),
  vulnerability_alerts: z.number(),
  dependents_count: z.number(),
})
export type RepoDetails = z.infer<typeof RepoDetails>

export interface RateLimitInfo {
  remaining: number
  limit: number
  reset: number
}

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public rateLimit?: RateLimitInfo,
  ) {
    super(message)
    this.name = 'GitHubApiError'
  }
}

function extractRateLimit(headers: Headers): RateLimitInfo {
  return {
    remaining: Number(headers.get('X-RateLimit-Remaining') ?? '0'),
    limit: Number(headers.get('X-RateLimit-Limit') ?? '0'),
    reset: Number(headers.get('X-RateLimit-Reset') ?? '0'),
  }
}

async function deriveKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('git-ocean-github-token-v1'),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptToken(token: string, secret: string): Promise<string> {
  const key = await deriveKey(secret)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(token)
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)
  return btoa(String.fromCharCode(...combined))
}

export async function decryptToken(encrypted: string, secret: string): Promise<string> {
  const key = await deriveKey(secret)
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0))
  const iv = combined.slice(0, 12)
  const data = combined.slice(12)
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return new TextDecoder().decode(decrypted)
}

async function githubFetch(url: string, token: string, options?: RequestInit): Promise<Response> {
  const resp = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'git-ocean',
    },
  })

  if (!resp.ok) {
    const rateLimit = extractRateLimit(resp.headers)
    let message = `GitHub API error: ${resp.status}`
    if (resp.status === 401) {
      message = 'GitHub token expired or invalid'
    } else if (resp.status === 403 && rateLimit.remaining === 0) {
      message = 'GitHub API rate limit exceeded'
    } else if (resp.status === 403) {
      message = 'GitHub API access forbidden'
    }
    throw new GitHubApiError(message, resp.status, rateLimit)
  }

  return resp
}

export async function fetchUserProfile(token: string): Promise<{ profile: GitHubUserProfile; rateLimit: RateLimitInfo }> {
  const resp = await githubFetch('https://api.github.com/user', token)
  const raw = await resp.json()
  const profile = GitHubUserProfile.parse(raw)
  return { profile, rateLimit: extractRateLimit(resp.headers) }
}

export async function fetchUserRepos(token: string): Promise<{ repos: GitHubRepo[]; rateLimit: RateLimitInfo }> {
  const allRepos: GitHubRepo[] = []
  let page = 1
  let hasMore = true
  let lastResp: Response | undefined

  while (hasMore) {
    lastResp = await githubFetch(
      `https://api.github.com/user/repos?sort=updated&per_page=100&page=${page}`,
      token,
    )
    const raw = await lastResp.json()
    const pageRepos = z.array(GitHubRepo).parse(raw)
    allRepos.push(...pageRepos)
    const linkHeader = lastResp.headers.get('Link')
    hasMore = pageRepos.length === 100 && (linkHeader?.includes('rel="next"') ?? false)
    page++
  }

  return { repos: allRepos, rateLimit: extractRateLimit(lastResp!.headers) }
}

export async function fetchRepoDetails(
  token: string,
  owner: string,
  repo: string,
): Promise<{ details: RepoDetails; rateLimit: RateLimitInfo }> {
  const query = `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        nameWithOwner
        description
        stargazerCount
        forkCount
        primaryLanguage { name }
        updatedAt
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { node { name } size }
        }
        repositoryTopics(first: 10) {
          edges { node { topic { name } } }
        }
        openPRs: pullRequests(states: [OPEN]) { totalCount }
        mergedPRs: pullRequests(states: [MERGED]) { totalCount }
        releases { totalCount }
        watchers { totalCount }
        mentionableUsers { totalCount }
        vulnerabilityAlerts { totalCount }
        dependencyGraphManifests(first: 1) {
          totalCount
        }
      }
    }
  `

  const resp = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'git-ocean',
    },
    body: JSON.stringify({ query, variables: { owner, repo } }),
  })

  if (!resp.ok) {
    throw new GitHubApiError('GraphQL query failed', resp.status, extractRateLimit(resp.headers))
  }

  const body = (await resp.json()) as {
    data?: { repository?: Record<string, unknown> }
    errors?: Array<{ message: string }>
  }

  if (body.errors || !body.data?.repository) {
    const msg = body.errors?.map((e) => e.message).join(', ') ?? 'GraphQL query failed'
    throw new GitHubApiError(msg, 422)
  }

  const r: Record<string, unknown> = body.data.repository

  const getCount = (field: unknown): number => {
    if (field && typeof field === 'object' && 'totalCount' in field) {
      return (field as { totalCount: number }).totalCount
    }
    return 0
  }

  const getField = <T>(key: string): T | undefined => r[key] as T | undefined

  const languages = ((getField<{ edges?: Array<{ node: { name: string }; size: number }> }>('languages')?.edges) ?? []).map(
    (e) => ({ name: e.node.name, size: e.size }),
  )
  const topics = ((getField<{ edges?: Array<{ node: { topic: { name: string } } }> }>('repositoryTopics')?.edges) ?? []).map(
    (e) => e.node.topic.name,
  )

  const primaryLanguage = getField<{ name?: string } | null>('primaryLanguage')

  return {
    details: {
      full_name: getField<string>('nameWithOwner') ?? '',
      description: getField<string | null>('description') ?? null,
      language: primaryLanguage?.name ?? null,
      stargazers_count: getField<number>('stargazerCount') ?? 0,
      forks_count: getField<number>('forkCount') ?? 0,
      open_issues_count: getCount(getField('issues')),
      updated_at: getField<string>('updatedAt') ?? '',
      html_url: `https://github.com/${getField<string>('nameWithOwner') ?? ''}`,
      open_pr_count: getCount(getField('openPRs')),
      release_count: getCount(getField('releases')),
      watchers_count: getCount(getField('watchers')),
      merged_pr_count: getCount(getField('mergedPRs')),
      contributor_count: getCount(getField('mentionableUsers')),
      languages,
      topics,
      vulnerability_alerts: getCount(getField('vulnerabilityAlerts')),
      dependents_count: getCount(getField('dependencyGraphManifests')),
    },
    rateLimit: extractRateLimit(resp.headers),
  }
}

export async function exchangeOAuthCode(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
): Promise<{ accessToken: string; scope: string; tokenType: string }> {
  const resp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  })

  if (!resp.ok) {
    throw new Error(`OAuth token exchange failed: ${resp.status}`)
  }

  const body = (await resp.json()) as {
    access_token?: string
    token_type?: string
    scope?: string
    error?: string
    error_description?: string
  }

  if (body.error || !body.access_token) {
    throw new Error(body.error_description ?? body.error ?? 'OAuth code exchange failed')
  }

  return {
    accessToken: body.access_token,
    scope: body.scope ?? '',
    tokenType: body.token_type ?? 'bearer',
  }
}
