import {
  fetchUserProfile as rawFetchUserProfile,
  fetchUserRepos as rawFetchUserRepos,
  fetchRepoDetails as rawFetchRepoDetails,
  fetchWorkflowRunStatus as rawFetchWorkflowRunStatus,
} from './github-api'
import type {
  GitHubUserProfile,
  GitHubRepo,
  RepoDetails,
  RateLimitInfo,
} from './github-api'

const CACHE_TTL = {
  PROFILE: 300,
  REPOS: 300,
  REPO_DETAILS: 120,
  WORKFLOW_STATUS: 120,
}

function cacheKey(prefix: string, ...parts: string[]): string {
  return `github:${prefix}:${parts.join(':')}`
}

async function kvGet<T>(cache: KVNamespace, key: string): Promise<{ data: T; cachedAt: string } | null> {
  try {
    const raw = await cache.get(key)
    if (!raw) return null
    return JSON.parse(raw) as { data: T; cachedAt: string }
  } catch {
    return null
  }
}

async function kvSet<T>(cache: KVNamespace, key: string, data: T, ttl: number): Promise<void> {
  const entry = { data, cachedAt: new Date().toISOString() }
  await cache.put(key, JSON.stringify(entry), { expirationTtl: ttl })
}

export async function fetchUserProfile(
  token: string,
  cache?: KVNamespace,
): Promise<{ profile: GitHubUserProfile; rateLimit: RateLimitInfo; cachedAt?: string }> {
  if (!cache) return rawFetchUserProfile(token)

  const key = cacheKey('profile', token.slice(-8))
  const cached = await kvGet<GitHubUserProfile>(cache, key)
  if (cached) return { profile: cached.data, rateLimit: { remaining: -1, limit: -1, reset: 0 }, cachedAt: cached.cachedAt }

  const result = await rawFetchUserProfile(token)
  await kvSet(cache, key, result.profile, CACHE_TTL.PROFILE)
  return { ...result, cachedAt: new Date().toISOString() }
}

export async function fetchUserRepos(
  token: string,
  cache?: KVNamespace,
): Promise<{ repos: GitHubRepo[]; rateLimit: RateLimitInfo; cachedAt?: string }> {
  if (!cache) return rawFetchUserRepos(token)

  const key = cacheKey('repos', token.slice(-8))
  const cached = await kvGet<GitHubRepo[]>(cache, key)
  if (cached) return { repos: cached.data, rateLimit: { remaining: -1, limit: -1, reset: 0 }, cachedAt: cached.cachedAt }

  const result = await rawFetchUserRepos(token)
  await kvSet(cache, key, result.repos, CACHE_TTL.REPOS)
  return { ...result, cachedAt: new Date().toISOString() }
}

export async function fetchRepoDetails(
  token: string,
  owner: string,
  repo: string,
  cache?: KVNamespace,
): Promise<{ details: RepoDetails; rateLimit: RateLimitInfo; cachedAt?: string }> {
  if (!cache) return rawFetchRepoDetails(token, owner, repo)

  const key = cacheKey('details', owner, repo)
  const cached = await kvGet<RepoDetails>(cache, key)
  if (cached) return { details: cached.data, rateLimit: { remaining: -1, limit: -1, reset: 0 }, cachedAt: cached.cachedAt }

  const result = await rawFetchRepoDetails(token, owner, repo)
  await kvSet(cache, key, result.details, CACHE_TTL.REPO_DETAILS)
  return { ...result, cachedAt: new Date().toISOString() }
}

export async function fetchWorkflowRunStatus(
  token: string,
  owner: string,
  repo: string,
  cache?: KVNamespace,
): Promise<{ conclusion: string | null; rateLimit: RateLimitInfo; cachedAt?: string }> {
  if (!cache) return rawFetchWorkflowRunStatus(token, owner, repo)

  const key = cacheKey('actions', owner, repo)
  const cached = await kvGet<{ conclusion: string | null }>(cache, key)
  if (cached) return { conclusion: cached.data.conclusion, rateLimit: { remaining: -1, limit: -1, reset: 0 }, cachedAt: cached.cachedAt }

  const result = await rawFetchWorkflowRunStatus(token, owner, repo)
  await kvSet(cache, key, { conclusion: result.conclusion }, CACHE_TTL.WORKFLOW_STATUS)
  return { ...result, cachedAt: new Date().toISOString() }
}
