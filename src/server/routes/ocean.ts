import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, type AuthContext } from '@/server/middleware/auth'
import { oceanStates, creatures, repositories } from '@/server/db/git-ocean-schema'

const app = new Hono<AuthContext>()

app.use('*', authMiddleware)

const updateOceanStateSchema = z.object({
  whaleColor: z.string().optional(),
  whaleSize: z.number().int().min(1).optional(),
  oceanDepth: z.number().int().min(0).optional(),
  coralCount: z.number().int().min(0).optional(),
  totalCreatures: z.number().int().min(0).optional(),
})

app.get('/state', async (c) => {
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)

  const state = await db
    .select()
    .from(oceanStates)
    .where(eq(oceanStates.userId, userId))
    .get()

  if (!state) {
    const created = await db
      .insert(oceanStates)
      .values({ userId })
      .returning()
      .get()
    return c.json(created)
  }

  return c.json(state)
})

app.put('/state', zValidator('json', updateOceanStateSchema), async (c) => {
  const userId = c.get('userId')
  const body = c.req.valid('json')
  const db = drizzle(c.env.DB)

  const existing = await db
    .select({ id: oceanStates.id })
    .from(oceanStates)
    .where(eq(oceanStates.userId, userId))
    .get()

  if (!existing) {
    const created = await db
      .insert(oceanStates)
      .values({ userId, ...body })
      .returning()
      .get()
    return c.json(created)
  }

  const updated = await db
    .update(oceanStates)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(oceanStates.userId, userId))
    .returning()
    .get()

  return c.json(updated)
})

app.get('/creatures', async (c) => {
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)

  const results = await db
    .select()
    .from(creatures)
    .where(eq(creatures.userId, userId))

  return c.json(results)
})

app.get('/repos', async (c) => {
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)

  const results = await db
    .select()
    .from(repositories)
    .where(eq(repositories.userId, userId))

  return c.json(results)
})

function hashStringToInt(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

function mapDetailedTypeToEnum(type: string): 'jellyfish' | 'seahorse' | 'turtle' | 'dolphin' | 'shark' | 'whale' | 'octopus' | 'ray' | 'crab' | 'anglerfish' {
  const t = type.toLowerCase()
  if (t.includes('dolphin') || t.includes('tuna') || t.includes('fish') || t.includes('school')) return 'dolphin'
  if (t.includes('jellyfish') || t.includes('sparkle') || t.includes('salp') || t.includes('copepod') || t.includes('dino')) return 'jellyfish'
  if (t.includes('turtle')) return 'turtle'
  if (t.includes('octopus') || t.includes('squid')) return 'octopus'
  if (t.includes('ray')) return 'ray'
  if (t.includes('seahorse')) return 'seahorse'
  if (t.includes('crab') || t.includes('shrimp')) return 'crab'
  if (t.includes('angler')) return 'anglerfish'
  if (t.includes('shark')) return 'shark'
  if (t.includes('whale')) return 'whale'
  return 'dolphin'
}

import { decryptToken, type RepoDetails } from '@/server/services/github-api'
import { fetchUserRepos, fetchRepoDetails } from '@/server/services/github-cache'
import { mapRepoToCreatureMetrics, mapReposToOceanState } from '@/server/services/repo-mapping'
import { getCitiesByCountry } from '@/server/services/geocoding'
import { gitHubConnections, worldMapData } from '@/server/db/git-ocean-schema'

function getMockRepoDetailsList(): RepoDetails[] {
  return [
    {
      full_name: 'anubhavaanand/ocean-engine',
      description: 'A 3D ocean rendering engine powered by WebGL',
      primary_language: 'TypeScript',
      language_breakdown: [{ name: 'TypeScript', percentage: 80 }, { name: 'GLSL', percentage: 20 }],
      topics: ['threejs', 'webgl', '3d', 'ocean'],
      topics_count: 4,
      stargazers_count: 85,
      forks_count: 23,
      watchers_count: 85,
      open_issues_count: 5,
      repo_size_kb: 1024,
      created_at: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
      default_branch: 'main',
      license: 'MIT',
      has_wiki: true,
      has_pages: true,
      has_discussions: true,
      has_projects: true,
      has_downloads: true,
      has_issues_enabled: true,
      is_fork: false,
      fork_source: null,
      is_archived: false,
      is_disabled: false,
      is_template: false,
      visibility: 'public',
      homepage_url: 'https://ocean-engine.dev',
      contributors_list: ['anubhavaanand', 'contributor1', 'contributor2'],
      contributor_count: 3,
      release_count: 5,
      latest_release_version: 'v1.0.0',
      latest_release_prerelease: false,
      days_since_last_release: 10,
      commit_activity_weekly: [1, 2, 3, 4, 5, 6, 7, 8],
      code_frequency: [{ week: 1718000000, additions: 500, deletions: 100 }],
      community_health_percentage: 95,
      participation_ratio: 0.8,
      commit_punch_card: null,
      top_contributor_dominance: 75,
      bot_vs_human_ratio: 0.1,
      new_contributors_this_month: 1,
      total_branches_count: 3,
      protected_branches_count: 1,
      deployments_count: 12,
      environments_list: ['production', 'staging'],
      open_pr_count: 2,
      merged_pr_count: 15,
      avg_pr_issue_close_time_hours: 4.5,
      open_milestones_count: 1,
      closed_milestones_count: 3,
      labels_total_count: 5,
      labels_list: ['bug', 'enhancement', 'help wanted'],
      discussions_open_count: 1,
      discussions_closed_count: 2,
      has_contributing_guide: true,
      has_code_of_conduct: true,
      has_issue_template: true,
      has_pr_template: true,
      dependents_count: 5,
      traffic_views_count: 500,
      traffic_clones_count: 120,
      referring_sites: ['github.com'],
      dependabot_alerts_count: 1,
      secret_scanning_alerts_count: 0,
      secret_scanning_push_protection_enabled: true,
      security_advisories_open_count: 0,
      used_by_count: 15,
      readme_length: 5000,
      ci_cd_workflow_status: 'active',
      vulnerability_alerts: 1,
    },
    {
      full_name: 'anubhavaanand/coral-db',
      description: 'Distributed coral reef database',
      primary_language: 'Rust',
      language_breakdown: [{ name: 'Rust', percentage: 95 }, { name: 'Other', percentage: 5 }],
      topics: ['database', 'rust', 'distributed'],
      topics_count: 3,
      stargazers_count: 42,
      forks_count: 15,
      watchers_count: 42,
      open_issues_count: 12,
      repo_size_kb: 4096,
      created_at: new Date(Date.now() - 200 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
      default_branch: 'main',
      license: 'Apache-2.0',
      has_wiki: false,
      has_pages: false,
      has_discussions: false,
      has_projects: false,
      has_downloads: false,
      has_issues_enabled: true,
      is_fork: false,
      fork_source: null,
      is_archived: false,
      is_disabled: false,
      is_template: false,
      visibility: 'public',
      homepage_url: null,
      contributors_list: ['anubhavaanand'],
      contributor_count: 1,
      release_count: 2,
      latest_release_version: 'v0.2.0',
      latest_release_prerelease: true,
      days_since_last_release: 45,
      commit_activity_weekly: [0, 0, 1, 2, 0, 0, 5, 2],
      code_frequency: [{ week: 1718000000, additions: 2000, deletions: 500 }],
      community_health_percentage: 60,
      participation_ratio: 1.0,
      commit_punch_card: null,
      top_contributor_dominance: 100,
      bot_vs_human_ratio: 0,
      new_contributors_this_month: 0,
      total_branches_count: 2,
      protected_branches_count: 0,
      deployments_count: 0,
      environments_list: [],
      open_pr_count: 5,
      merged_pr_count: 6,
      avg_pr_issue_close_time_hours: 48,
      open_milestones_count: 0,
      closed_milestones_count: 1,
      labels_total_count: 2,
      labels_list: ['bug', 'help wanted'],
      discussions_open_count: 0,
      discussions_closed_count: 0,
      has_contributing_guide: false,
      has_code_of_conduct: false,
      has_issue_template: false,
      has_pr_template: false,
      dependents_count: 1,
      traffic_views_count: 200,
      traffic_clones_count: 40,
      referring_sites: [],
      dependabot_alerts_count: 3,
      secret_scanning_alerts_count: 0,
      secret_scanning_push_protection_enabled: false,
      security_advisories_open_count: 0,
      used_by_count: 2,
      readme_length: 2000,
      ci_cd_workflow_status: 'none',
      vulnerability_alerts: 3,
    },
    {
      full_name: 'anubhavaanand/whale-cli',
      description: 'A CLI tool for whale migration patterns',
      primary_language: 'Go',
      language_breakdown: [{ name: 'Go', percentage: 100 }],
      topics: ['cli', 'go', 'whale'],
      topics_count: 3,
      stargazers_count: 128,
      forks_count: 45,
      watchers_count: 128,
      open_issues_count: 3,
      repo_size_kb: 512,
      created_at: new Date(Date.now() - 500 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
      default_branch: 'master',
      license: 'MIT',
      has_wiki: true,
      has_pages: false,
      has_discussions: true,
      has_projects: true,
      has_downloads: true,
      has_issues_enabled: true,
      is_fork: false,
      fork_source: null,
      is_archived: false,
      is_disabled: false,
      is_template: false,
      visibility: 'public',
      homepage_url: null,
      contributors_list: ['anubhavaanand', 'helper1', 'helper2', 'helper3'],
      contributor_count: 4,
      release_count: 12,
      latest_release_version: 'v2.1.0',
      latest_release_prerelease: false,
      days_since_last_release: 3,
      commit_activity_weekly: [10, 15, 20, 5, 8, 12, 14, 18],
      code_frequency: [{ week: 1718000000, additions: 8000, deletions: 4000 }],
      community_health_percentage: 100,
      participation_ratio: 0.6,
      commit_punch_card: null,
      top_contributor_dominance: 50,
      bot_vs_human_ratio: 0.2,
      new_contributors_this_month: 2,
      total_branches_count: 5,
      protected_branches_count: 1,
      deployments_count: 45,
      environments_list: ['production'],
      open_pr_count: 1,
      merged_pr_count: 85,
      avg_pr_issue_close_time_hours: 1.2,
      open_milestones_count: 2,
      closed_milestones_count: 10,
      labels_total_count: 10,
      labels_list: ['bug', 'feature', 'documentation', 'duplicate'],
      discussions_open_count: 4,
      discussions_closed_count: 18,
      has_contributing_guide: true,
      has_code_of_conduct: true,
      has_issue_template: true,
      has_pr_template: true,
      dependents_count: 24,
      traffic_views_count: 1500,
      traffic_clones_count: 350,
      referring_sites: ['github.com', 'go.dev'],
      dependabot_alerts_count: 0,
      secret_scanning_alerts_count: 0,
      secret_scanning_push_protection_enabled: true,
      security_advisories_open_count: 0,
      used_by_count: 120,
      readme_length: 8000,
      ci_cd_workflow_status: 'active',
      vulnerability_alerts: 0,
    },
  ]
}

app.post('/sync', async (c) => {
  const userId = c.get('userId')
  const db = drizzle(c.env.DB)

  // Check if user has a connection
  const connection = await db
    .select()
    .from(gitHubConnections)
    .where(eq(gitHubConnections.userId, userId))
    .get()

  let reposDetails: RepoDetails[] = []
  
  if (connection) {
    let token: string
    try {
      token = await decryptToken(connection.accessToken, c.env.BETTER_AUTH_SECRET)
    } catch {
      return c.json({ error: 'Failed to decrypt stored token' }, 500)
    }

    try {
      const { repos } = await fetchUserRepos(token, c.env.GITHUB_CACHE)
      // limit to top 10 repos
      const topRepos = repos.slice(0, 10)
      
      for (const r of topRepos) {
        const parts = r.full_name.split('/')
        const owner = parts[0]!
        const repoName = parts[1]!
        try {
          const { details } = await fetchRepoDetails(token, owner, repoName, c.env.GITHUB_CACHE)
          reposDetails.push(details)
        } catch (err) {
          console.error(`Failed to fetch details for ${r.full_name}:`, err)
        }
      }
    } catch (err) {
      return c.json({ error: err instanceof Error ? err.message : 'Failed to fetch repositories from GitHub' }, 502)
    }
  } else {
    reposDetails = getMockRepoDetailsList()
  }

  if (reposDetails.length === 0) {
    return c.json({ error: 'No repositories found to sync' }, 400)
  }

  try {
    // Clean existing creatures
    await db.delete(creatures).where(eq(creatures.userId, userId)).run()
    // Clean existing world map data
    await db.delete(worldMapData).where(eq(worldMapData.userId, userId)).run()
    // Clean existing repositories
    await db.delete(repositories).where(eq(repositories.userId, userId)).run()

    for (const repo of reposDetails) {
      const githubRepoId = hashStringToInt(repo.full_name)
      
      const insertedRepo = await db
        .insert(repositories)
        .values({
          userId,
          githubRepoId,
          fullName: repo.full_name,
          description: repo.description,
          language: repo.primary_language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          issues: repo.open_issues_count,
          prs: repo.open_pr_count,
          lastPushedAt: repo.pushed_at ? new Date(repo.pushed_at) : new Date(),
        })
        .returning()
        .get()

      const creatureInstructions = mapRepoToCreatureMetrics(repo)
      for (const inst of creatureInstructions) {
        const mappedType = mapDetailedTypeToEnum(inst.creatureType)
        const countToInsert = Math.min(inst.count, 5)
        for (let i = 0; i < countToInsert; i++) {
          const creatureName = `${inst.creatureType}-${i + 1}`
          await db
            .insert(creatures)
            .values({
              userId,
              repoId: insertedRepo.id,
              creatureType: mappedType,
              creatureName,
              positionX: (Math.random() - 0.5) * 10,
              positionY: (Math.random() - 0.5) * 5 - 10,
              positionZ: (Math.random() - 0.5) * 10,
              scaleX: inst.scaleX,
              scaleY: inst.scaleY,
              scaleZ: inst.scaleZ,
              level: inst.level,
              health: 100,
            })
            .run()
        }
      }
    }

    const aggregate = mapReposToOceanState(reposDetails)
    
    const existingState = await db
      .select({ id: oceanStates.id })
      .from(oceanStates)
      .where(eq(oceanStates.userId, userId))
      .get()

    if (existingState) {
      await db
        .update(oceanStates)
        .set({
          whaleSize: aggregate.whaleSize,
          oceanDepth: aggregate.oceanDepth,
          coralCount: aggregate.coralCount,
          totalCreatures: aggregate.totalCreatures,
          updatedAt: new Date(),
        })
        .where(eq(oceanStates.userId, userId))
        .run()
    } else {
      await db
        .insert(oceanStates)
        .values({
          userId,
          whaleSize: aggregate.whaleSize,
          oceanDepth: aggregate.oceanDepth,
          coralCount: aggregate.coralCount,
          totalCreatures: aggregate.totalCreatures,
        })
        .run()
    }

    const countriesToPopulate = ['US', 'IN', 'DE', 'GB', 'FR', 'JP', 'BR', 'CA']
    for (let i = 0; i < countriesToPopulate.length; i++) {
      const countryCode = countriesToPopulate[i]!
      const cities = getCitiesByCountry(countryCode)
      let lat = 0
      let lng = 0
      if (cities.length > 0) {
        lat = cities[0]!.lat
        lng = cities[0]!.lng
      }
      
      const repoCount = Math.floor(Math.random() * 5) + 1
      const contributionCount = repoCount * (Math.floor(Math.random() * 50) + 10)

      await db
        .insert(worldMapData)
        .values({
          userId,
          country: countryCode,
          latitude: lat,
          longitude: lng,
          repoCount,
          contributionCount,
          unlocked: true,
        })
        .run()
    }

    return c.json({ ok: true })
  } catch (err) {
    console.error('Sync error:', err)
    return c.json({ error: err instanceof Error ? err.message : 'Sync failed' }, 500)
  }
})

export default app
