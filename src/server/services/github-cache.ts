import {
  fetchUserProfile as rawFetchUserProfile,
  fetchUserRepos as rawFetchUserRepos,
  fetchRepoDetails as rawFetchRepoDetails,
  fetchWorkflowRunStatus as rawFetchWorkflowRunStatus,
  RepoDetails,
} from './github-api'
import type {
  GitHubUserProfile,
  GitHubRepo,
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

  const staticKey = cacheKey('static', owner, repo)
  const statsKey = cacheKey('stats', owner, repo)
  const trafficKey = cacheKey('traffic', owner, repo)

  const [cachedStatic, cachedStats, cachedTraffic] = await Promise.all([
    kvGet<Record<string, unknown>>(cache, staticKey),
    kvGet<Record<string, unknown>>(cache, statsKey),
    kvGet<Record<string, unknown>>(cache, trafficKey),
  ])

  let staticData = cachedStatic?.data
  let statsData = cachedStats?.data
  let trafficData = cachedTraffic?.data

  let rateLimit: RateLimitInfo = { remaining: -1, limit: -1, reset: 0 }

  if (!staticData || !statsData || !trafficData) {
    const result = await rawFetchRepoDetails(token, owner, repo)
    rateLimit = result.rateLimit

    const details = result.details
    staticData = {
      full_name: details.full_name,
      description: details.description,
      primary_language: details.primary_language,
      topics: details.topics,
      topics_count: details.topics_count,
      created_at: details.created_at,
      updated_at: details.updated_at,
      pushed_at: details.pushed_at,
      default_branch: details.default_branch,
      license: details.license,
      has_wiki: details.has_wiki,
      has_pages: details.has_pages,
      has_discussions: details.has_discussions,
      has_projects: details.has_projects,
      has_downloads: details.has_downloads,
      has_issues_enabled: details.has_issues_enabled,
      is_fork: details.is_fork,
      fork_source: details.fork_source,
      is_archived: details.is_archived,
      is_disabled: details.is_disabled,
      is_template: details.is_template,
      visibility: details.visibility,
      homepage_url: details.homepage_url,
    }

    statsData = {
      stargazers_count: details.stargazers_count,
      forks_count: details.forks_count,
      watchers_count: details.watchers_count,
      open_issues_count: details.open_issues_count,
      repo_size_kb: details.repo_size_kb,
      contributors_list: details.contributors_list,
      contributor_count: details.contributor_count,
      release_count: details.release_count,
      latest_release_version: details.latest_release_version,
      latest_release_prerelease: details.latest_release_prerelease,
      days_since_last_release: details.days_since_last_release,
      commit_activity_weekly: details.commit_activity_weekly,
      code_frequency: details.code_frequency,
      language_breakdown: details.language_breakdown,
      community_health_percentage: details.community_health_percentage,
      participation_ratio: details.participation_ratio,
      commit_punch_card: details.commit_punch_card,
      top_contributor_dominance: details.top_contributor_dominance,
      bot_vs_human_ratio: details.bot_vs_human_ratio,
      new_contributors_this_month: details.new_contributors_this_month,
      total_branches_count: details.total_branches_count,
      protected_branches_count: details.protected_branches_count,
      deployments_count: details.deployments_count,
      environments_list: details.environments_list,
      open_pr_count: details.open_pr_count,
      merged_pr_count: details.merged_pr_count,
      avg_pr_issue_close_time_hours: details.avg_pr_issue_close_time_hours,
      open_milestones_count: details.open_milestones_count,
      closed_milestones_count: details.closed_milestones_count,
      labels_total_count: details.labels_total_count,
      labels_list: details.labels_list,
      discussions_open_count: details.discussions_open_count,
      discussions_closed_count: details.discussions_closed_count,
      has_contributing_guide: details.has_contributing_guide,
      has_code_of_conduct: details.has_code_of_conduct,
      has_issue_template: details.has_issue_template,
      has_pr_template: details.has_pr_template,
      dependents_count: details.dependents_count,
    }

    trafficData = {
      traffic_views_count: details.traffic_views_count,
      traffic_clones_count: details.traffic_clones_count,
      referring_sites: details.referring_sites,
      dependabot_alerts_count: details.dependabot_alerts_count,
      secret_scanning_alerts_count: details.secret_scanning_alerts_count,
      secret_scanning_push_protection_enabled: details.secret_scanning_push_protection_enabled,
      security_advisories_open_count: details.security_advisories_open_count,
      used_by_count: details.used_by_count,
      readme_length: details.readme_length,
      ci_cd_workflow_status: details.ci_cd_workflow_status,
      vulnerability_alerts: details.vulnerability_alerts,
    }

    await Promise.all([
      kvSet(cache, staticKey, staticData, 86400), // 24hr TTL
      kvSet(cache, statsKey, statsData, 3600),     // 1hr TTL
      kvSet(cache, trafficKey, trafficData, 1800), // 30min TTL
    ])
  }

  const merged = {
    ...staticData,
    ...statsData,
    ...trafficData,
  }

  const cachedAt = cachedStatic?.cachedAt ?? cachedStats?.cachedAt ?? cachedTraffic?.cachedAt ?? new Date().toISOString()

  return {
    details: RepoDetails.parse(merged),
    rateLimit,
    cachedAt,
  }
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
