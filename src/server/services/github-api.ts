import { z } from 'zod'

// ─── Keep existing user/repo types ──────────────────────────────────

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

// ─── Repo details sub-types ──────────────────────────────────────────

export const LanguageEntry = z.object({
  name: z.string(),
  percentage: z.number(),
})
export type LanguageEntry = z.infer<typeof LanguageEntry>

export const CodeFrequencyEntry = z.object({
  week: z.number(),
  additions: z.number(),
  deletions: z.number(),
})
export type CodeFrequencyEntry = z.infer<typeof CodeFrequencyEntry>

// ─── RepoDetails — all 71 data points across 3 tiers ─────────────────

export const RepoDetails = z.object({
  // L1 — Public (38)
  full_name: z.string(),
  description: z.string().nullable(),
  primary_language: z.string().nullable(),
  language_breakdown: z.array(LanguageEntry),
  topics: z.array(z.string()),
  topics_count: z.number(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  watchers_count: z.number(),
  open_issues_count: z.number(),
  repo_size_kb: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  pushed_at: z.string(),
  default_branch: z.string(),
  license: z.string().nullable(),
  has_wiki: z.boolean(),
  has_pages: z.boolean(),
  has_discussions: z.boolean(),
  has_projects: z.boolean(),
  has_downloads: z.boolean(),
  has_issues_enabled: z.boolean(),
  is_fork: z.boolean(),
  fork_source: z.string().nullable(),
  is_archived: z.boolean(),
  is_disabled: z.boolean(),
  is_template: z.boolean(),
  visibility: z.string(),
  homepage_url: z.string().nullable(),
  contributors_list: z.array(z.string()),
  contributor_count: z.number(),
  release_count: z.number(),
  latest_release_version: z.string().nullable(),
  latest_release_prerelease: z.boolean(),
  days_since_last_release: z.number().nullable(),
  commit_activity_weekly: z.array(z.number()),
  code_frequency: z.array(CodeFrequencyEntry),
  community_health_percentage: z.number().nullable(),

  // L2 — Standard OAuth (22)
  participation_ratio: z.number().nullable(),
  commit_punch_card: z.array(z.array(z.number())).nullable(),
  top_contributor_dominance: z.number().nullable(),
  bot_vs_human_ratio: z.number().nullable(),
  new_contributors_this_month: z.number(),
  total_branches_count: z.number(),
  protected_branches_count: z.number(),
  deployments_count: z.number(),
  environments_list: z.array(z.string()),
  open_pr_count: z.number(),
  merged_pr_count: z.number(),
  avg_pr_issue_close_time_hours: z.number().nullable(),
  open_milestones_count: z.number(),
  closed_milestones_count: z.number(),
  labels_total_count: z.number(),
  labels_list: z.array(z.string()),
  discussions_open_count: z.number(),
  discussions_closed_count: z.number(),
  has_contributing_guide: z.boolean(),
  has_code_of_conduct: z.boolean(),
  has_issue_template: z.boolean(),
  has_pr_template: z.boolean(),
  dependents_count: z.number(),

  // L3 — Elevated OAuth (11)
  traffic_views_count: z.number(),
  traffic_clones_count: z.number(),
  referring_sites: z.array(z.string()),
  dependabot_alerts_count: z.number(),
  secret_scanning_alerts_count: z.number(),
  secret_scanning_push_protection_enabled: z.boolean(),
  security_advisories_open_count: z.number(),
  used_by_count: z.number(),
  readme_length: z.number().nullable(),
  ci_cd_workflow_status: z.string(),

  // backward compat alias for dependabot_alerts_count
  vulnerability_alerts: z.number(),
})
export type RepoDetails = z.infer<typeof RepoDetails>

// ─── Rate limit & error types ────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────

function extractRateLimit(headers: Headers): RateLimitInfo {
  return {
    remaining: Number(headers.get('X-RateLimit-Remaining') ?? '0'),
    limit: Number(headers.get('X-RateLimit-Limit') ?? '0'),
    reset: Number(headers.get('X-RateLimit-Reset') ?? '0'),
  }
}

function repoPath(owner: string, repo: string): string {
  return `/repos/${owner}/${repo}`
}

// ─── Token encryption / decryption (unchanged) ───────────────────────

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

// ─── Low-level HTTP helpers ──────────────────────────────────────────

async function graphqlRequest(
  query: string,
  variables: Record<string, string>,
  token: string | null,
): Promise<{ data?: Record<string, unknown>; errors?: Array<{ message: string }> }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'git-ocean',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const resp = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  })

  if (!resp.ok) {
    throw new GitHubApiError('GraphQL query failed', resp.status, extractRateLimit(resp.headers))
  }

  const body = (await resp.json()) as {
    data?: Record<string, unknown>
    errors?: Array<{ message: string }>
  }

  if (body.errors || !body.data?.['repository']) {
    const msg = body.errors?.map((e) => e.message).join(', ') ?? 'GraphQL query failed'
    throw new GitHubApiError(msg, 422)
  }

  return body
}

async function restFetch(
  path: string,
  token: string | null,
): Promise<{ data: unknown; rateLimit: RateLimitInfo }> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'git-ocean',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const resp = await fetch(`https://api.github.com${path}`, { headers })

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

  return { data: await resp.json(), rateLimit: extractRateLimit(resp.headers) }
}

async function fetchStatsWithRetry(
  url: string,
  token: string | null,
  retries = 2,
): Promise<unknown> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'git-ocean',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const resp = await fetch(url, { headers })

    if (resp.status === 202) {
      await new Promise((r) => setTimeout(r, 2000))
      continue
    }

    if (!resp.ok) {
      const rateLimit = extractRateLimit(resp.headers)
      let message = `GitHub API error: ${resp.status}`
      if (resp.status === 403 && rateLimit.remaining === 0) {
        message = 'GitHub API rate limit exceeded'
      }
      throw new GitHubApiError(message, resp.status, rateLimit)
    }

    return resp.json()
  }

  throw new GitHubApiError('Stats endpoint timed out (202)', 202)
}

async function contentExists(
  owner: string,
  repo: string,
  path: string,
  token: string | null,
): Promise<boolean> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'git-ocean',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const resp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers, method: 'HEAD' },
    )
    return resp.status === 200
  } catch {
    return false
  }
}

// ─── GraphQL query (used by L1 – also supplies some L2 fields) ──────

const REPO_DETAILS_QUERY = `
  query RepoData($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      nameWithOwner description stargazerCount forkCount
      watchers { totalCount }
      primaryLanguage { name }
      languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
        edges { node { name } size }
      }
      issues(states: OPEN) { totalCount }
      pullRequests(states: OPEN) { totalCount }
      mergedPRs: pullRequests(states: MERGED) { totalCount }
      releases(first: 1, orderBy: {field: CREATED_AT, direction: DESC}) {
        totalCount
        nodes { isPrerelease tagName publishedAt }
      }
      repositoryTopics(first: 20) { nodes { topic { name } } }
      defaultBranchRef { name }
      createdAt pushedAt updatedAt diskUsage
      isArchived isDisabled isFork isTemplate hasWikiEnabled
      hasProjectsEnabled hasDiscussionsEnabled hasIssuesEnabled
      licenseInfo { name }
      homepageUrl visibility
      openMilestones: milestones(states: OPEN) { totalCount }
      closedMilestones: milestones(states: CLOSED) { totalCount }
      labels(first: 100) { totalCount nodes { name } }
      deployments { totalCount }
      branchProtectionRules { totalCount }
      parent { nameWithOwner }
      mentionableUsers { totalCount }
      pages(first: 1) { totalCount }
    }
  }
`

// ─── L1 – Public (no auth needed, 38 fields) ────────────────────────

function makeBaseDetails(r: Record<string, unknown>): Record<string, unknown> {
  const getCount = (val: unknown): number => {
    if (val && typeof val === 'object' && 'totalCount' in val) {
      return (val as { totalCount: number }).totalCount
    }
    return typeof val === 'number' ? val : 0
  }
  const getField = <T>(key: string): T | undefined => r[key] as T | undefined

  const nameWithOwner = getField<string>('nameWithOwner') ?? ''

  const langEdges =
    (getField<{ edges?: Array<{ node: { name: string }; size: number }> }>('languages')
      ?.edges) ?? []
  const totalLangSize = langEdges.reduce((sum, e) => sum + e.size, 0)
  const languageBreakdown = langEdges.map((e) => ({
    name: e.node.name,
    percentage: totalLangSize > 0 ? Math.round((e.size / totalLangSize) * 10_000) / 100 : 0,
  }))

  const topicNodes =
    (getField<{ nodes?: Array<{ topic: { name: string } }> }>('repositoryTopics')?.nodes) ?? []
  const topics = topicNodes.map((n) => n.topic.name)

  const releaseInfo = getField<{
    totalCount: number
    nodes?: Array<{ isPrerelease: boolean; tagName: string | null; publishedAt: string | null }>
  }>('releases')
  const latestRelease = releaseInfo?.nodes?.[0] ?? null
  const daysSinceRelease = latestRelease?.publishedAt
    ? Math.floor(
        (Date.now() - new Date(latestRelease.publishedAt).getTime()) / (1000 * 60 * 60 * 24),
      )
    : null

  const pagesInfo = getField<{ totalCount?: number }>('pages')

  return {
    full_name: nameWithOwner,
    description: getField<string | null>('description') ?? null,
    primary_language: (getField<{ name?: string } | null>('primaryLanguage'))?.name ?? null,
    language_breakdown: languageBreakdown,
    topics,
    topics_count: topics.length,
    stargazers_count: getField<number>('stargazerCount') ?? 0,
    forks_count: getField<number>('forkCount') ?? 0,
    watchers_count: getCount(getField('watchers')),
    open_issues_count: getCount(getField('issues')),
    repo_size_kb: getField<number>('diskUsage') ?? 0,
    created_at: getField<string>('createdAt') ?? '',
    updated_at: getField<string>('updatedAt') ?? '',
    pushed_at: getField<string>('pushedAt') ?? '',
    default_branch: (getField<{ name?: string } | null>('defaultBranchRef'))?.name ?? '',
    license: (getField<{ name?: string } | null>('licenseInfo'))?.name ?? null,
    has_wiki: getField<boolean>('hasWikiEnabled') ?? false,
    has_pages: (pagesInfo?.totalCount ?? 0) > 0,
    has_discussions: getField<boolean>('hasDiscussionsEnabled') ?? false,
    has_projects: getField<boolean>('hasProjectsEnabled') ?? false,
    has_downloads: false,
    has_issues_enabled: getField<boolean>('hasIssuesEnabled') ?? true,
    is_fork: getField<boolean>('isFork') ?? false,
    fork_source: (getField<{ nameWithOwner?: string } | null>('parent'))?.nameWithOwner ?? null,
    is_archived: getField<boolean>('isArchived') ?? false,
    is_disabled: getField<boolean>('isDisabled') ?? false,
    is_template: getField<boolean>('isTemplate') ?? false,
    visibility: getField<string>('visibility') ?? '',
    homepage_url: getField<string | null>('homepageUrl') ?? null,
    contributors_list: [] as string[],
    contributor_count: getCount(getField('mentionableUsers')),
    release_count: releaseInfo?.totalCount ?? 0,
    latest_release_version: latestRelease?.tagName ?? null,
    latest_release_prerelease: latestRelease?.isPrerelease ?? false,
    days_since_last_release: daysSinceRelease,
    commit_activity_weekly: [] as number[],
    code_frequency: [] as Array<{ week: number; additions: number; deletions: number }>,
    community_health_percentage: null,

    // L2 defaults
    participation_ratio: null,
    commit_punch_card: null,
    top_contributor_dominance: null,
    bot_vs_human_ratio: null,
    new_contributors_this_month: 0,
    total_branches_count: 0,
    protected_branches_count: getCount(getField('branchProtectionRules')),
    deployments_count: getCount(getField('deployments')),
    environments_list: [] as string[],
    open_pr_count: getCount(getField('pullRequests')),
    merged_pr_count: getCount(getField('mergedPRs')),
    avg_pr_issue_close_time_hours: null,
    open_milestones_count: getCount(getField('openMilestones')),
    closed_milestones_count: getCount(getField('closedMilestones')),
    labels_total_count: getCount(getField('labels')),
    labels_list:
      (
        getField<{ nodes?: Array<{ name: string }> }>('labels')
      )?.nodes?.map((n) => n.name) ?? [],
    discussions_open_count: getCount(getField('discussions')),
    discussions_closed_count: 0,
    has_contributing_guide: false,
    has_code_of_conduct: false,
    has_issue_template: false,
    has_pr_template: false,
    dependents_count: 0,

    // L3 defaults
    traffic_views_count: 0,
    traffic_clones_count: 0,
    referring_sites: [] as string[],
    dependabot_alerts_count: 0,
    secret_scanning_alerts_count: 0,
    secret_scanning_push_protection_enabled: false,
    security_advisories_open_count: 0,
    used_by_count: 0,
    readme_length: null,
    ci_cd_workflow_status: 'unknown',
    vulnerability_alerts: 0,
  }
}

export async function fetchRepoDetailsL1(
  owner: string,
  repo: string,
  token?: string,
): Promise<{ details: Record<string, unknown>; rateLimit: RateLimitInfo }> {
  const t = token ?? null

  // 1. GraphQL query
  const gqlResult = await graphqlRequest(
    REPO_DETAILS_QUERY,
    { owner, name: repo },
    t,
  )
  const r = gqlResult.data!['repository'] as Record<string, unknown>
  const rateLimit = { remaining: 0, limit: 0, reset: 0 }

  const details = makeBaseDetails(r)

  // 2. Stats endpoints (commit activity, code frequency, community profile, contributors)
  try {
    const [commitActivity, codeFreq, community, contributors] = await Promise.all([
      fetchStatsWithRetry(
        `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
        t,
      ),
      fetchStatsWithRetry(
        `https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`,
        t,
      ),
      fetchStatsWithRetry(
        `https://api.github.com/repos/${owner}/${repo}/community/profile`,
        t,
      ),
      restFetch(`${repoPath(owner, repo)}/contributors?per_page=100&anon=true`, t)
        .then(
          (res) => res.data as Array<{ login: string; contributions: number }>,
        )
        .catch(() => []),
    ])

    if (Array.isArray(commitActivity)) {
      details['commit_activity_weekly'] = (commitActivity as Array<{
        week: number
        total: number
        days: number[]
      }>).map((w) => w.total)
    }

    if (Array.isArray(codeFreq)) {
      details['code_frequency'] = (codeFreq as [number, number, number][]).map(
        ([week, additions, deletions]) => ({ week, additions, deletions }),
      )
    }

    if (
      community &&
      typeof community === 'object' &&
      'health_percentage' in (community as Record<string, unknown>)
    ) {
      details['community_health_percentage'] = (
        community as { health_percentage: number }
      ).health_percentage
    }

    if (Array.isArray(contributors)) {
      const contribList = contributors as Array<{
        login: string
        contributions: number
      }>
      details['contributors_list'] = contribList.map((c) => c.login)
      details['contributor_count'] = contribList.length
    }
  } catch {
    // Non-fatal – stats endpoints are best-effort
  }

  return { details, rateLimit }
}

// ─── L2 – Standard OAuth (22 fields) ────────────────────────────────

export async function fetchRepoDetailsL2(
  owner: string,
  repo: string,
  token: string,
): Promise<Record<string, unknown>> {
  const fields: Record<string, unknown> = {}

  const [participation, punchCard, branches, contributors, depGraph] =
    await Promise.all([
      fetchStatsWithRetry(
        `https://api.github.com/repos/${owner}/${repo}/stats/participation`,
        token,
      ).catch(() => null),
      fetchStatsWithRetry(
        `https://api.github.com/repos/${owner}/${repo}/stats/punch_card`,
        token,
      ).catch(() => null),
      restFetch(`${repoPath(owner, repo)}/branches?per_page=100`, token)
        .then((res) => res.data as Array<{ name: string; protected: boolean }>)
        .catch(() => []),
      restFetch(`${repoPath(owner, repo)}/contributors?per_page=100&anon=true`, token)
        .then(
          (res) => res.data as Array<{ login: string; contributions: number }>,
        )
        .catch(() => []),
      restFetch(`${repoPath(owner, repo)}/dependency-graph/dependencies`, token)
        .then((res) => res.data as { totalCount?: number })
        .catch(() => null),
    ])

  // participation: { all: number[], owner: number[] }
  if (participation && typeof participation === 'object') {
    const p = participation as { all: number[]; owner: number[] }
    if (Array.isArray(p.all) && Array.isArray(p.owner)) {
      const totalCommits = p.all.reduce((a: number, b: number) => a + b, 0)
      const ownerCommits = p.owner.reduce((a: number, b: number) => a + b, 0)
      fields['participation_ratio'] =
        totalCommits > 0
          ? Math.round((ownerCommits / totalCommits) * 10_000) / 10_000
          : 0
    }
  }

  // punch_card: [day, hour, count][]
  if (Array.isArray(punchCard)) {
    fields['commit_punch_card'] = punchCard as number[][]
  }

  // branches
  if (Array.isArray(branches)) {
    fields['total_branches_count'] = branches.length
  }

  // contributors – dominance and bot ratio
  if (Array.isArray(contributors)) {
    const contribs = contributors as Array<{
      login: string
      contributions: number
    }>

    if (contribs.length > 0) {
      const totalContribs = contribs.reduce(
        (sum, c) => sum + c.contributions,
        0,
      )
      const topContribs = contribs[0]!.contributions
      fields['top_contributor_dominance'] =
        totalContribs > 0
          ? Math.round((topContribs / totalContribs) * 10_000) / 100
          : 0

      const bots = contribs.filter((c) =>
        c.login.toLowerCase().includes('bot'),
      ).length
      const humans = contribs.length - bots
      fields['bot_vs_human_ratio'] =
        humans > 0 ? Math.round((bots / humans) * 100) / 100 : bots > 0 ? Infinity : 0
    }
  }

  // dependency graph
  if (depGraph && typeof depGraph === 'object') {
    const d = depGraph as { totalCount?: number }
    fields['dependents_count'] = d.totalCount ?? 0
  }

  // Content checks (contributing guide, code of conduct, issue/pr templates)
  const [hasContributing, hasCoC, hasIssueTemplate, hasPRTemplate] =
    await Promise.all([
      contentExists(
        owner,
        repo,
        'CONTRIBUTING.md',
        token,
      ),
      contentExists(
        owner,
        repo,
        'CODE_OF_CONDUCT.md',
        token,
      ),
      contentExists(
        owner,
        repo,
        '.github/ISSUE_TEMPLATE',
        token,
      ),
      contentExists(
        owner,
        repo,
        '.github/PULL_REQUEST_TEMPLATE.md',
        token,
      ),
    ])

  fields['has_contributing_guide'] = hasContributing
  fields['has_code_of_conduct'] = hasCoC
  fields['has_issue_template'] = hasIssueTemplate
  fields['has_pr_template'] = hasPRTemplate

  return fields
}

// ─── L3 – Elevated OAuth / owner only (11 fields) ───────────────────

export async function fetchRepoDetailsL3(
  owner: string,
  repo: string,
  token: string,
): Promise<Record<string, unknown>> {
  const fields: Record<string, unknown> = {}

  // Verify owner
  try {
    const userResp = await restFetch('/user', token)
    const user = userResp.data as { login?: string }
    if (user.login !== owner) return fields
  } catch {
    return fields
  }

  const [trafficViews, trafficClones, referring, dependabot, secretScan, advisories, readme, workflows] =
    await Promise.all([
      restFetch(
        `${repoPath(owner, repo)}/traffic/views`,
        token,
      )
        .then((res) => res.data as { count?: number; uniques?: number })
        .catch(() => null),
      restFetch(
        `${repoPath(owner, repo)}/traffic/clones`,
        token,
      )
        .then((res) => res.data as { count?: number; uniques?: number })
        .catch(() => null),
      restFetch(
        `${repoPath(owner, repo)}/traffic/popular/referrers`,
        token,
      )
        .then(
          (res) =>
            res.data as Array<{ referrer: string; count: number; uniques: number }>,
        )
        .catch(() => []),
      restFetch(
        `${repoPath(owner, repo)}/dependabot/alerts?per_page=1&state=open`,
        token,
      )
        .then((res) => ({
          count: Number(res.rateLimit.remaining),
          link: (res.data as Array<unknown>).length,
        }))
        .catch(() => null),
      restFetch(
        `${repoPath(owner, repo)}/secret-scanning/alerts?per_page=1&state=open`,
        token,
      )
        .then((res) => ({
          count: Number(res.rateLimit.remaining),
          data: res.data as Array<unknown>,
        }))
        .catch(() => null),
      restFetch(
        `${repoPath(owner, repo)}/security-advisories?per_page=1&state=open`,
        token,
      )
        .then((res) => ({
          count: Number(res.rateLimit.remaining),
          data: res.data as Array<unknown>,
        }))
        .catch(() => null),
      restFetch(
        `${repoPath(owner, repo)}/readme`,
        token,
      )
        .then((res) => res.data as { content?: string; size?: number })
        .catch(() => null),
      restFetch(
        `${repoPath(owner, repo)}/actions/workflows?per_page=1`,
        token,
      )
        .then(
          (res) =>
            res.data as { total_count?: number; workflows?: Array<{ state: string }> },
        )
        .catch(() => null),
    ])

  // Traffic views
  if (trafficViews && typeof trafficViews === 'object') {
    fields['traffic_views_count'] = (trafficViews as { count: number }).count ?? 0
  }

  // Traffic clones
  if (trafficClones && typeof trafficClones === 'object') {
    fields['traffic_clones_count'] = (trafficClones as { count: number }).count ?? 0
  }

  // Referring sites
  if (Array.isArray(referring)) {
    fields['referring_sites'] = (referring as Array<{ referrer: string }>).map(
      (r) => r.referrer,
    )
  }

  // Dependabot alerts
  if (dependabot && typeof dependabot === 'object') {
    const d = dependabot as { data?: unknown[] }
    fields['dependabot_alerts_count'] = (d.data ?? []).length
  }

  // Secret scanning alerts
  if (secretScan && typeof secretScan === 'object') {
    const s = secretScan as { data?: unknown[] }
    fields['secret_scanning_alerts_count'] = (s.data ?? []).length
  }

  // Security advisories
  if (advisories && typeof advisories === 'object') {
    const a = advisories as { data?: unknown[] }
    fields['security_advisories_open_count'] = (a.data ?? []).length
  }

  // README
  if (readme && typeof readme === 'object') {
    const rm = readme as { content?: string; size?: number }
    if (rm.content) {
      try {
        fields['readme_length'] = new TextDecoder().decode(
          Uint8Array.from(atob(rm.content), (c) => c.charCodeAt(0)),
        ).length
      } catch {
        fields['readme_length'] = rm.size ?? null
      }
    }
  }

  // Workflows
  if (workflows && typeof workflows === 'object') {
    const wf = workflows as { total_count?: number; workflows?: Array<{ state: string }> }
    if (wf.total_count && wf.total_count > 0) {
      const states = wf.workflows?.map((w) => w.state) ?? []
      fields['ci_cd_workflow_status'] =
        states.includes('active') ? 'active'
        : states.includes('disabled') ? 'disabled'
        : 'unknown'
    } else {
      fields['ci_cd_workflow_status'] = 'none'
    }
  }

  return fields
}

// ─── Combined fetchRepoDetails (keeps existing signature) ────────────

export async function fetchRepoDetails(
  token: string,
  owner: string,
  repo: string,
): Promise<{ details: RepoDetails; rateLimit: RateLimitInfo }> {
  const l1 = await fetchRepoDetailsL1(owner, repo, token)

  let l2: Record<string, unknown> = {}
  try {
    l2 = await fetchRepoDetailsL2(owner, repo, token)
  } catch {
    // L2 is best-effort
  }

  let l3: Record<string, unknown> = {}
  try {
    l3 = await fetchRepoDetailsL3(owner, repo, token)
  } catch {
    // L3 is best-effort (owner-only)
  }

  const depAlertCount = l3['dependabot_alerts_count']
  const merged = {
    ...l1.details,
    ...l2,
    ...l3,
    vulnerability_alerts: typeof depAlertCount === 'number' ? depAlertCount : 0,
  }

  return { details: RepoDetails.parse(merged), rateLimit: l1.rateLimit }
}

export async function fetchWorkflowRunStatus(
  token: string,
  owner: string,
  repo: string,
): Promise<{ conclusion: string | null; rateLimit: RateLimitInfo }> {
  try {
    const resp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'git-ocean',
        },
      },
    )
    if (!resp.ok) {
      return { conclusion: null, rateLimit: extractRateLimit(resp.headers) }
    }
    const body = (await resp.json()) as { workflow_runs?: Array<{ conclusion: string | null }> }
    const runs = body.workflow_runs ?? []
    const conclusion = runs.length > 0 ? (runs[0]?.conclusion ?? null) : null
    return { conclusion, rateLimit: extractRateLimit(resp.headers) }
  } catch {
    return { conclusion: null, rateLimit: { remaining: -1, limit: -1, reset: 0 } }
  }
}

// ─── Existing endpoints (unchanged signature) ────────────────────────

export async function fetchUserProfile(
  token: string,
): Promise<{ profile: GitHubUserProfile; rateLimit: RateLimitInfo }> {
  const resp = await fetch('https://api.github.com/user', {
    headers: {
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

  const raw = await resp.json()
  const profile = GitHubUserProfile.parse(raw)
  return { profile, rateLimit: extractRateLimit(resp.headers) }
}

export async function fetchUserRepos(
  token: string,
): Promise<{ repos: GitHubRepo[]; rateLimit: RateLimitInfo }> {
  const allRepos: GitHubRepo[] = []
  let page = 1
  let hasMore = true
  let lastResp: Response | undefined

  while (hasMore) {
    lastResp = await fetch(
      `https://api.github.com/user/repos?sort=updated&per_page=100&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'git-ocean',
        },
      },
    )

    if (!lastResp.ok) {
      const rateLimit = extractRateLimit(lastResp.headers)
      let message = `GitHub API error: ${lastResp.status}`
      if (lastResp.status === 401) {
        message = 'GitHub token expired or invalid'
      } else if (lastResp.status === 403 && rateLimit.remaining === 0) {
        message = 'GitHub API rate limit exceeded'
      } else if (lastResp.status === 403) {
        message = 'GitHub API access forbidden'
      }
      throw new GitHubApiError(message, lastResp.status, rateLimit)
    }

    const raw = await lastResp.json()
    const pageRepos = z.array(GitHubRepo).parse(raw)
    allRepos.push(...pageRepos)
    const linkHeader = lastResp.headers.get('Link')
    hasMore = pageRepos.length === 100 && (linkHeader?.includes('rel="next"') ?? false)
    page++
  }

  return { repos: allRepos, rateLimit: extractRateLimit(lastResp!.headers) }
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
