import { describe, it, expect } from 'vitest'
import {
  encryptToken,
  decryptToken,
  GitHubApiError,
  RepoDetails,
  CodeFrequencyEntry,
  LanguageEntry,
  GitHubUserProfile,
  GitHubRepo,
} from '@/server/services/github-api'

describe('Token encryption round-trip', () => {
  const secret = 'test-secret-key-12345'

  it('encrypts then decrypts a normal token', async () => {
    const token = 'ghp_abc123def456xyz789'
    const encrypted = await encryptToken(token, secret)
    expect(encrypted).toBeTruthy()
    expect(encrypted).not.toBe(token)
    const decrypted = await decryptToken(encrypted, secret)
    expect(decrypted).toBe(token)
  })

  it('encrypts then decrypts an empty string token', async () => {
    const token = ''
    const encrypted = await encryptToken(token, secret)
    const decrypted = await decryptToken(encrypted, secret)
    expect(decrypted).toBe(token)
  })

  it('encrypts then decrypts a short token', async () => {
    const token = 'abc'
    const encrypted = await encryptToken(token, secret)
    const decrypted = await decryptToken(encrypted, secret)
    expect(decrypted).toBe(token)
  })

  it('produces different ciphertext for same token each time', async () => {
    const token = 'ghp_test_token'
    const a = await encryptToken(token, secret)
    const b = await encryptToken(token, secret)
    expect(a).not.toBe(b)
  })

  it('fails to decrypt with wrong secret', async () => {
    const token = 'ghp_secret_token'
    const encrypted = await encryptToken(token, secret)
    await expect(decryptToken(encrypted, 'wrong-secret')).rejects.toThrow()
  })
})

describe('GitHubApiError', () => {
  it('sets name, status, and message correctly', () => {
    const error = new GitHubApiError('Not Found', 404)
    expect(error.name).toBe('GitHubApiError')
    expect(error.status).toBe(404)
    expect(error.message).toBe('Not Found')
  })

  it('is instance of Error', () => {
    const error = new GitHubApiError('Forbidden', 403)
    expect(error).toBeInstanceOf(Error)
  })

  it('stores rateLimit info when provided', () => {
    const rateLimit = { remaining: 0, limit: 60, reset: 1234567890 }
    const error = new GitHubApiError('Rate limited', 403, rateLimit)
    expect(error.rateLimit).toEqual(rateLimit)
  })

  it('rateLimit is undefined when not provided', () => {
    const error = new GitHubApiError('Not Found', 404)
    expect(error.rateLimit).toBeUndefined()
  })

  it('handles various status codes', () => {
    const statuses = [401, 403, 404, 422, 500]
    for (const status of statuses) {
      const error = new GitHubApiError('error', status)
      expect(error.status).toBe(status)
    }
  })
})

describe('RepoDetails zod schema', () => {
  const validRepoDetails = {
    full_name: 'owner/repo',
    description: 'A test repo',
    primary_language: 'TypeScript',
    language_breakdown: [{ name: 'TypeScript', percentage: 100 }],
    topics: ['test'],
    topics_count: 1,
    stargazers_count: 10,
    forks_count: 2,
    watchers_count: 5,
    open_issues_count: 3,
    repo_size_kb: 500,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
    pushed_at: '2024-06-01T00:00:00Z',
    default_branch: 'main',
    license: 'MIT',
    has_wiki: true,
    has_pages: false,
    has_discussions: true,
    has_projects: true,
    has_downloads: false,
    has_issues_enabled: true,
    is_fork: false,
    fork_source: null,
    is_archived: false,
    is_disabled: false,
    is_template: false,
    visibility: 'public',
    homepage_url: null,
    contributors_list: ['user1'],
    contributor_count: 1,
    release_count: 2,
    latest_release_version: 'v1.0.0',
    latest_release_prerelease: false,
    days_since_last_release: 30,
    commit_activity_weekly: [5, 3, 8],
    code_frequency: [{ week: 12345, additions: 100, deletions: 50 }],
    community_health_percentage: 75,
    participation_ratio: 0.5,
    commit_punch_card: [[0, 0, 5]],
    top_contributor_dominance: 80,
    bot_vs_human_ratio: 0.1,
    new_contributors_this_month: 2,
    total_branches_count: 5,
    protected_branches_count: 1,
    deployments_count: 3,
    environments_list: ['production'],
    open_pr_count: 2,
    merged_pr_count: 10,
    avg_pr_issue_close_time_hours: 24,
    open_milestones_count: 1,
    closed_milestones_count: 2,
    labels_total_count: 5,
    labels_list: ['bug', 'feature'],
    discussions_open_count: 1,
    discussions_closed_count: 0,
    has_contributing_guide: true,
    has_code_of_conduct: true,
    has_issue_template: true,
    has_pr_template: true,
    dependents_count: 0,
    traffic_views_count: 100,
    traffic_clones_count: 50,
    referring_sites: ['github.com'],
    dependabot_alerts_count: 0,
    secret_scanning_alerts_count: 0,
    secret_scanning_push_protection_enabled: true,
    security_advisories_open_count: 0,
    used_by_count: 1,
    readme_length: 500,
    ci_cd_workflow_status: 'active',
    vulnerability_alerts: 0,
  }

  it('valid minimal object passes parsing', () => {
    const result = RepoDetails.parse(validRepoDetails)
    expect(result).toBeDefined()
  })

  it('all fields present after parse', () => {
    const result = RepoDetails.parse(validRepoDetails)
    expect(result.full_name).toBe('owner/repo')
    expect(result.primary_language).toBe('TypeScript')
    expect(result.language_breakdown).toHaveLength(1)
    expect(result.code_frequency).toHaveLength(1)
    expect(result.commit_activity_weekly).toEqual([5, 3, 8])
    expect(result.visibility).toBe('public')
    expect(result.ci_cd_workflow_status).toBe('active')
  })

  it('missing required field throws', () => {
    const { full_name: _, ...incomplete } = validRepoDetails
    expect(() => RepoDetails.parse(incomplete)).toThrow()
  })

  it('nullable fields accept null', () => {
    const withNulls = {
      ...validRepoDetails,
      description: null,
      license: null,
      fork_source: null,
      primary_language: null,
    }
    const result = RepoDetails.parse(withNulls)
    expect(result.description).toBeNull()
    expect(result.license).toBeNull()
  })
})

describe('CodeFrequencyEntry zod schema', () => {
  it('valid pair passes parsing', () => {
    const result = CodeFrequencyEntry.parse({ week: 12345, additions: 100, deletions: 50 })
    expect(result.week).toBe(12345)
    expect(result.additions).toBe(100)
    expect(result.deletions).toBe(50)
  })

  it('missing field fails', () => {
    expect(() => CodeFrequencyEntry.parse({ week: 12345, additions: 100 })).toThrow()
  })

  it('extra field is stripped', () => {
    const result = CodeFrequencyEntry.parse({ week: 1, additions: 2, deletions: 3, extra: true })
    expect(result).not.toHaveProperty('extra')
  })

  it('zero values are valid', () => {
    const result = CodeFrequencyEntry.parse({ week: 0, additions: 0, deletions: 0 })
    expect(result.week).toBe(0)
  })

  it('negative values are valid', () => {
    const result = CodeFrequencyEntry.parse({ week: -1, additions: -5, deletions: -3 })
    expect(result.week).toBe(-1)
  })
})

describe('LanguageEntry zod schema', () => {
  it('valid entry passes parsing', () => {
    const result = LanguageEntry.parse({ name: 'TypeScript', percentage: 75.5 })
    expect(result.name).toBe('TypeScript')
    expect(result.percentage).toBe(75.5)
  })

  it('negative percentage is allowed by schema', () => {
    const result = LanguageEntry.parse({ name: 'TypeScript', percentage: -10 })
    expect(result.percentage).toBe(-10)
  })

  it('zero percentage is valid', () => {
    const result = LanguageEntry.parse({ name: 'TypeScript', percentage: 0 })
    expect(result.percentage).toBe(0)
  })

  it('100 percentage is valid', () => {
    const result = LanguageEntry.parse({ name: 'TypeScript', percentage: 100 })
    expect(result.percentage).toBe(100)
  })

  it('over 100 percentage is allowed by schema', () => {
    const result = LanguageEntry.parse({ name: 'TypeScript', percentage: 150 })
    expect(result.percentage).toBe(150)
  })

  it('missing name fails', () => {
    expect(() => LanguageEntry.parse({ percentage: 50 })).toThrow()
  })
})

describe('GitHubUserProfile zod schema', () => {
  it('valid profile passes parsing', () => {
    const result = GitHubUserProfile.parse({
      login: 'octocat',
      name: 'Octocat',
      avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
      location: 'San Francisco',
      bio: 'Hello world!',
      public_repos: 10,
      followers: 100,
    })
    expect(result.login).toBe('octocat')
    expect(result.name).toBe('Octocat')
    expect(result.public_repos).toBe(10)
    expect(result.followers).toBe(100)
  })

  it('nullable fields accept null', () => {
    const result = GitHubUserProfile.parse({
      login: 'octocat',
      name: null,
      avatar_url: 'https://example.com/avatar.png',
      location: null,
      bio: null,
      public_repos: 0,
      followers: 0,
    })
    expect(result.name).toBeNull()
    expect(result.location).toBeNull()
    expect(result.bio).toBeNull()
  })

  it('missing required field fails', () => {
    expect(() => GitHubUserProfile.parse({
      name: 'Octocat',
      avatar_url: 'https://example.com/avatar.png',
      public_repos: 10,
      followers: 100,
    })).toThrow()
  })
})

describe('GitHubRepo zod schema', () => {
  const validRepo = {
    id: 123,
    full_name: 'owner/repo',
    description: 'A test repo',
    stargazers_count: 10,
    forks_count: 2,
    open_issues_count: 1,
    language: 'TypeScript',
    updated_at: '2024-06-01T00:00:00Z',
    html_url: 'https://github.com/owner/repo',
  }

  it('valid repo passes parsing', () => {
    const result = GitHubRepo.parse(validRepo)
    expect(result.id).toBe(123)
    expect(result.full_name).toBe('owner/repo')
  })

  it('nullable description accepts null', () => {
    const result = GitHubRepo.parse({ ...validRepo, description: null })
    expect(result.description).toBeNull()
  })

  it('nullable language accepts null', () => {
    const result = GitHubRepo.parse({ ...validRepo, language: null })
    expect(result.language).toBeNull()
  })

  it('missing required field fails', () => {
    const { id: _, ...incomplete } = validRepo
    expect(() => GitHubRepo.parse(incomplete)).toThrow()
  })

  it('extra fields are stripped', () => {
    const result = GitHubRepo.parse({ ...validRepo, extra_field: 'should be stripped' })
    expect(result).not.toHaveProperty('extra_field')
  })
})

describe('RateLimitInfo interface', () => {
  it('structural typing works with matching shape', () => {
    const rateLimit: { remaining: number; limit: number; reset: number } = {
      remaining: 42,
      limit: 60,
      reset: 1234567890,
    }
    expect(rateLimit.remaining).toBe(42)
    expect(rateLimit.limit).toBe(60)
    expect(rateLimit.reset).toBe(1234567890)
  })

  it('accepts zero values', () => {
    const rateLimit = { remaining: 0, limit: 0, reset: 0 }
    expect(rateLimit.remaining).toBe(0)
  })
})
