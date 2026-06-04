import { describe, it, expect } from 'vitest'
import type { RepoDetails } from '@/server/services/github-api'
import {
  mapRepoToCreatureMetrics,
  mapRepoToKelpTower,
  mapReposToOceanState,
} from '@/server/services/repo-mapping'
import type { CreatureInstruction } from '@/server/services/repo-mapping'

function createMockRepo(overrides: Partial<RepoDetails> = {}): RepoDetails {
  return {
    full_name: 'test-owner/test-repo',
    description: 'A test repo',
    primary_language: 'TypeScript',
    language_breakdown: [],
    topics: [],
    topics_count: 0,
    stargazers_count: 0,
    forks_count: 0,
    watchers_count: 0,
    open_issues_count: 0,
    repo_size_kb: 100,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    pushed_at: '2024-01-01T00:00:00Z',
    default_branch: 'main',
    license: 'MIT',
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
    contributors_list: [],
    contributor_count: 0,
    release_count: 0,
    latest_release_version: null,
    latest_release_prerelease: false,
    days_since_last_release: null,
    commit_activity_weekly: [],
    code_frequency: [],
    community_health_percentage: null,
    participation_ratio: null,
    commit_punch_card: null,
    top_contributor_dominance: null,
    bot_vs_human_ratio: null,
    new_contributors_this_month: 0,
    total_branches_count: 0,
    protected_branches_count: 0,
    deployments_count: 0,
    environments_list: [],
    open_pr_count: 0,
    merged_pr_count: 0,
    avg_pr_issue_close_time_hours: null,
    open_milestones_count: 0,
    closed_milestones_count: 0,
    labels_total_count: 0,
    labels_list: [],
    discussions_open_count: 0,
    discussions_closed_count: 0,
    has_contributing_guide: false,
    has_code_of_conduct: false,
    has_issue_template: false,
    has_pr_template: false,
    dependents_count: 0,
    traffic_views_count: 0,
    traffic_clones_count: 0,
    referring_sites: [],
    dependabot_alerts_count: 0,
    secret_scanning_alerts_count: 0,
    secret_scanning_push_protection_enabled: false,
    security_advisories_open_count: 0,
    used_by_count: 0,
    readme_length: null,
    ci_cd_workflow_status: 'unknown',
    vulnerability_alerts: 0,
    ...overrides,
  }
}

function findCreature(instructions: CreatureInstruction[], type: string): CreatureInstruction | undefined {
  return instructions.find((i) => i.creatureType === type)
}

function sumCounts(instructions: CreatureInstruction[]): number {
  return instructions.reduce((sum, i) => sum + i.count, 0)
}

describe('mapRepoToCreatureMetrics', () => {

  // ── GROUP 1 — BUILDERS ─────────────────────────────────────────────

  it('returns bottlenose dolphins based on contributor count', () => {
    const repo = createMockRepo({ contributor_count: 5 })
    const result = mapRepoToCreatureMetrics(repo)
    const dolphin = findCreature(result, 'bottlenose-dolphin')
    expect(dolphin).toBeDefined()
    expect(dolphin!.count).toBe(5)
    expect(dolphin!.orbitalGroup).toBe(1)
  })

  it('caps bottlenose dolphins at 20', () => {
    const repo = createMockRepo({ contributor_count: 50 })
    const result = mapRepoToCreatureMetrics(repo)
    const dolphin = findCreature(result, 'bottlenose-dolphin')
    expect(dolphin!.count).toBe(20)
  })

  it('returns spinner dolphins from new contributors', () => {
    const repo = createMockRepo({ contributor_count: 5, new_contributors_this_month: 3 })
    const result = mapRepoToCreatureMetrics(repo)
    const spinner = findCreature(result, 'spinner-dolphin')
    expect(spinner).toBeDefined()
    expect(spinner!.count).toBe(3)
    expect(spinner!.orbitalGroup).toBe(1)
  })

  it('caps spinner dolphins at 8', () => {
    const repo = createMockRepo({ new_contributors_this_month: 20 })
    const result = mapRepoToCreatureMetrics(repo)
    const spinner = findCreature(result, 'spinner-dolphin')
    expect(spinner!.count).toBe(8)
  })

  it('returns sailfish when commit streak exists', () => {
    const repo = createMockRepo({ commit_activity_weekly: [0, 0, 0, 0, 0, 0, 0, 5] })
    const result = mapRepoToCreatureMetrics(repo)
    const sailfish = findCreature(result, 'sailfish')
    expect(sailfish).toBeDefined()
    expect(sailfish!.count).toBe(1)
    expect(sailfish!.orbitalGroup).toBe(1)
  })

  it('does not return sailfish when no commit streak', () => {
    const repo = createMockRepo({ commit_activity_weekly: [0, 0, 0, 0, 0, 0, 0, 0] })
    const result = mapRepoToCreatureMetrics(repo)
    expect(findCreature(result, 'sailfish')).toBeUndefined()
  })

  it('returns bluefin tuna matching bot contributor count', () => {
    const repo = createMockRepo({
      contributor_count: 10,
      bot_vs_human_ratio: 0.25,
    })
    const result = mapRepoToCreatureMetrics(repo)
    const tuna = findCreature(result, 'bluefin-tuna')
    expect(tuna).toBeDefined()
    expect(tuna!.count).toBe(2)
    expect(tuna!.orbitalGroup).toBe(1)
  })

  it('caps bluefin tuna at 10', () => {
    const repo = createMockRepo({
      contributor_count: 100,
      bot_vs_human_ratio: 1,
    })
    const result = mapRepoToCreatureMetrics(repo)
    const tuna = findCreature(result, 'bluefin-tuna')
    expect(tuna!.count).toBe(10)
  })

  it('handles Infinity bot_vs_human_ratio', () => {
    const repo = createMockRepo({
      contributor_count: 5,
      bot_vs_human_ratio: Infinity,
    })
    const result = mapRepoToCreatureMetrics(repo)
    const tuna = findCreature(result, 'bluefin-tuna')
    expect(tuna!.count).toBe(5)
  })

  it('returns cuttlefish from top contributor dominance', () => {
    const repo = createMockRepo({ top_contributor_dominance: 50 })
    const result = mapRepoToCreatureMetrics(repo)
    const cuttlefish = findCreature(result, 'cuttlefish')
    expect(cuttlefish).toBeDefined()
    expect(cuttlefish!.count).toBe(1)
    expect(cuttlefish!.orbitalGroup).toBe(1)
  })

  it('returns krill swarm from code frequency additions', () => {
    const repo = createMockRepo({
      code_frequency: [
        { week: 1, additions: 5000, deletions: 0 },
      ],
    })
    const result = mapRepoToCreatureMetrics(repo)
    const krill = findCreature(result, 'krill-swarm')
    expect(krill).toBeDefined()
    expect(krill!.count).toBe(30)
    expect(krill!.orbitalGroup).toBe(1)
  })

  it('returns swordfish from deployments', () => {
    const repo = createMockRepo({ deployments_count: 3 })
    const result = mapRepoToCreatureMetrics(repo)
    const swordfish = findCreature(result, 'swordfish')
    expect(swordfish).toBeDefined()
    expect(swordfish!.count).toBe(3)
    expect(swordfish!.orbitalGroup).toBe(1)
  })

  it('caps swordfish at 10', () => {
    const repo = createMockRepo({ deployments_count: 50 })
    const result = mapRepoToCreatureMetrics(repo)
    const swordfish = findCreature(result, 'swordfish')
    expect(swordfish!.count).toBe(10)
  })

  it('returns herring school from participation ratio', () => {
    const repo = createMockRepo({ participation_ratio: 0.8 })
    const result = mapRepoToCreatureMetrics(repo)
    const herring = findCreature(result, 'herring-school')
    expect(herring).toBeDefined()
    expect(herring!.count).toBe(8)
    expect(herring!.orbitalGroup).toBe(1)
  })

  // ── GROUP 2 — ADMIRERS ────────────────────────────────────────────

  it('returns moon jellyfish from watchers', () => {
    const repo = createMockRepo({ watchers_count: 10 })
    const result = mapRepoToCreatureMetrics(repo)
    const jelly = findCreature(result, 'moon-jellyfish')
    expect(jelly).toBeDefined()
    expect(jelly!.count).toBe(10)
    expect(jelly!.orbitalGroup).toBe(2)
  })

  it('returns dinoflagellates from stargazers', () => {
    const repo = createMockRepo({ stargazers_count: 20 })
    const result = mapRepoToCreatureMetrics(repo)
    const dino = findCreature(result, 'dinoflagellates')
    expect(dino).toBeDefined()
    expect(dino!.count).toBe(10)
    expect(dino!.orbitalGroup).toBe(2)
  })

  it('caps dinoflagellates at 50', () => {
    const repo = createMockRepo({ stargazers_count: 200 })
    const result = mapRepoToCreatureMetrics(repo)
    const dino = findCreature(result, 'dinoflagellates')
    expect(dino!.count).toBe(50)
  })

  it('returns copepods from traffic views', () => {
    const repo = createMockRepo({ traffic_views_count: 500 })
    const result = mapRepoToCreatureMetrics(repo)
    const copepod = findCreature(result, 'copepods')
    expect(copepod).toBeDefined()
    expect(copepod!.count).toBe(5)
    expect(copepod!.orbitalGroup).toBe(2)
  })

  it('caps copepods at 40', () => {
    const repo = createMockRepo({ traffic_views_count: 10000 })
    const result = mapRepoToCreatureMetrics(repo)
    const copepod = findCreature(result, 'copepods')
    expect(copepod!.count).toBe(40)
  })

  it('returns lions-mane jellyfish from sponsors', () => {
    const repo = createMockRepo({} as Partial<RepoDetails>)
    ;(repo as any).sponsors_count = 3
    const result = mapRepoToCreatureMetrics(repo)
    const lionsMane = findCreature(result, 'lions-mane-jellyfish')
    expect(lionsMane).toBeDefined()
    expect(lionsMane!.count).toBe(3)
    expect(lionsMane!.orbitalGroup).toBe(2)
  })

  it('returns sea-sparkle when trending', () => {
    const repo = createMockRepo({} as Partial<RepoDetails>)
    ;(repo as any).trending = true
    const result = mapRepoToCreatureMetrics(repo)
    const sparkle = findCreature(result, 'sea-sparkle')
    expect(sparkle).toBeDefined()
    expect(sparkle!.count).toBe(1)
    expect(sparkle!.orbitalGroup).toBe(2)
  })

  it('returns salps when isPinned', () => {
    const repo = createMockRepo({} as Partial<RepoDetails>)
    ;(repo as any).isPinned = true
    const result = mapRepoToCreatureMetrics(repo)
    const salp = findCreature(result, 'salps')
    expect(salp).toBeDefined()
    expect(salp!.count).toBe(1)
    expect(salp!.orbitalGroup).toBe(2)
  })

  // ── GROUP 3 — OFFSPRING ───────────────────────────────────────────

  it('returns whale calf from forks', () => {
    const repo = createMockRepo({ forks_count: 30 })
    const result = mapRepoToCreatureMetrics(repo)
    const calf = findCreature(result, 'whale-calf')
    expect(calf).toBeDefined()
    expect(calf!.count).toBe(3)
    expect(calf!.orbitalGroup).toBe(3)
  })

  it('caps whale calf at 5', () => {
    const repo = createMockRepo({ forks_count: 200 })
    const result = mapRepoToCreatureMetrics(repo)
    const calf = findCreature(result, 'whale-calf')
    expect(calf!.count).toBe(5)
  })

  it('returns manta ray from dependents', () => {
    const repo = createMockRepo({ dependents_count: 6 })
    const result = mapRepoToCreatureMetrics(repo)
    const manta = findCreature(result, 'manta-ray')
    expect(manta).toBeDefined()
    expect(manta!.count).toBe(6)
    expect(manta!.orbitalGroup).toBe(3)
  })

  it('caps manta ray at 8', () => {
    const repo = createMockRepo({ dependents_count: 20 })
    const result = mapRepoToCreatureMetrics(repo)
    const manta = findCreature(result, 'manta-ray')
    expect(manta!.count).toBe(8)
  })

  it('returns hammerhead school from used_by_count', () => {
    const repo = createMockRepo({ used_by_count: 25 })
    const result = mapRepoToCreatureMetrics(repo)
    const hammerhead = findCreature(result, 'hammerhead-school')
    expect(hammerhead).toBeDefined()
    expect(hammerhead!.count).toBe(5)
    expect(hammerhead!.orbitalGroup).toBe(3)
  })

  it('returns flying fish from mention count', () => {
    const repo = createMockRepo({} as Partial<RepoDetails>)
    ;(repo as any).mention_count = 9
    const result = mapRepoToCreatureMetrics(repo)
    const flyingFish = findCreature(result, 'flying-fish')
    expect(flyingFish).toBeDefined()
    expect(flyingFish!.count).toBe(3)
    expect(flyingFish!.orbitalGroup).toBe(3)
  })

  it('returns amphipod surge from traffic clones', () => {
    const repo = createMockRepo({ traffic_clones_count: 50 })
    const result = mapRepoToCreatureMetrics(repo)
    const amphipod = findCreature(result, 'amphipod-surge')
    expect(amphipod).toBeDefined()
    expect(amphipod!.count).toBe(5)
    expect(amphipod!.orbitalGroup).toBe(3)
  })

  // ── GROUP 4 — PROBLEMS ────────────────────────────────────────────

  it('returns barracuda from open issues', () => {
    const repo = createMockRepo({ open_issues_count: 5 })
    const result = mapRepoToCreatureMetrics(repo)
    const barracuda = findCreature(result, 'barracuda')
    expect(barracuda).toBeDefined()
    expect(barracuda!.count).toBe(5)
    expect(barracuda!.orbitalGroup).toBe(4)
  })

  it('caps barracuda at 10', () => {
    const repo = createMockRepo({ open_issues_count: 50 })
    const result = mapRepoToCreatureMetrics(repo)
    const barracuda = findCreature(result, 'barracuda')
    expect(barracuda!.count).toBe(10)
  })

  it('returns giant pacific octopus from open PRs', () => {
    const repo = createMockRepo({ open_pr_count: 4 })
    const result = mapRepoToCreatureMetrics(repo)
    const octopus = findCreature(result, 'giant-pacific-octopus')
    expect(octopus).toBeDefined()
    expect(octopus!.count).toBe(4)
    expect(octopus!.orbitalGroup).toBe(4)
  })

  it('caps giant pacific octopus at 8', () => {
    const repo = createMockRepo({ open_pr_count: 20 })
    const result = mapRepoToCreatureMetrics(repo)
    const octopus = findCreature(result, 'giant-pacific-octopus')
    expect(octopus!.count).toBe(8)
  })

  it('returns lionfish from security advisories', () => {
    const repo = createMockRepo({ security_advisories_open_count: 2 })
    const result = mapRepoToCreatureMetrics(repo)
    const lionfish = findCreature(result, 'lionfish')
    expect(lionfish).toBeDefined()
    expect(lionfish!.count).toBe(2)
    expect(lionfish!.orbitalGroup).toBe(4)
  })

  it('caps lionfish at 5', () => {
    const repo = createMockRepo({ security_advisories_open_count: 10 })
    const result = mapRepoToCreatureMetrics(repo)
    const lionfish = findCreature(result, 'lionfish')
    expect(lionfish!.count).toBe(5)
  })

  it('returns moray eel from dependabot alerts', () => {
    const repo = createMockRepo({ dependabot_alerts_count: 4 })
    const result = mapRepoToCreatureMetrics(repo)
    const moray = findCreature(result, 'moray-eel')
    expect(moray).toBeDefined()
    expect(moray!.count).toBe(4)
    expect(moray!.orbitalGroup).toBe(4)
  })

  it('caps moray eel at 8', () => {
    const repo = createMockRepo({ dependabot_alerts_count: 20 })
    const result = mapRepoToCreatureMetrics(repo)
    const moray = findCreature(result, 'moray-eel')
    expect(moray!.count).toBe(8)
  })

  it('returns mantis shrimp from critical PR count', () => {
    const repo = createMockRepo({} as Partial<RepoDetails>)
    ;(repo as any).critical_pr_count = 3
    const result = mapRepoToCreatureMetrics(repo)
    const mantis = findCreature(result, 'mantis-shrimp')
    expect(mantis).toBeDefined()
    expect(mantis!.count).toBe(3)
    expect(mantis!.orbitalGroup).toBe(4)
  })

  it('returns arrow worms from bug issues', () => {
    const repo = createMockRepo({} as Partial<RepoDetails>)
    ;(repo as any).bug_issue_count = 10
    const result = mapRepoToCreatureMetrics(repo)
    const worms = findCreature(result, 'arrow-worms')
    expect(worms).toBeDefined()
    expect(worms!.count).toBe(10)
    expect(worms!.orbitalGroup).toBe(4)
  })

  it('returns decorator crab from stalled issues', () => {
    const repo = createMockRepo({} as Partial<RepoDetails>)
    ;(repo as any).stalled_issue_count = 4
    const result = mapRepoToCreatureMetrics(repo)
    const crab = findCreature(result, 'decorator-crab')
    expect(crab).toBeDefined()
    expect(crab!.count).toBe(4)
    expect(crab!.orbitalGroup).toBe(4)
  })

  it('returns giant squid from open milestones', () => {
    const repo = createMockRepo({ open_milestones_count: 2 })
    const result = mapRepoToCreatureMetrics(repo)
    const squid = findCreature(result, 'giant-squid')
    expect(squid).toBeDefined()
    expect(squid!.count).toBe(2)
    expect(squid!.orbitalGroup).toBe(4)
  })

  // ── GROUP 5 — RESOLUTIONS ─────────────────────────────────────────

  it('returns leatherback turtle from merged PRs', () => {
    const repo = createMockRepo({ merged_pr_count: 5 })
    const result = mapRepoToCreatureMetrics(repo)
    const turtle = findCreature(result, 'leatherback-turtle')
    expect(turtle).toBeDefined()
    expect(turtle!.count).toBe(5)
    expect(turtle!.orbitalGroup).toBe(5)
  })

  it('caps leatherback turtle at 8', () => {
    const repo = createMockRepo({ merged_pr_count: 20 })
    const result = mapRepoToCreatureMetrics(repo)
    const turtle = findCreature(result, 'leatherback-turtle')
    expect(turtle!.count).toBe(8)
  })

  it('returns green sea turtle from closed issues', () => {
    const repo = createMockRepo({} as Partial<RepoDetails>)
    ;(repo as any).closed_issues_count = 12
    const result = mapRepoToCreatureMetrics(repo)
    const greenTurtle = findCreature(result, 'green-sea-turtle')
    expect(greenTurtle).toBeDefined()
    expect(greenTurtle!.count).toBe(4)
    expect(greenTurtle!.orbitalGroup).toBe(5)
  })

  it('returns nautilus from avg close time', () => {
    const repo = createMockRepo({ avg_pr_issue_close_time_hours: 48 })
    const result = mapRepoToCreatureMetrics(repo)
    const nautilus = findCreature(result, 'nautilus')
    expect(nautilus).toBeDefined()
    expect(nautilus!.count).toBe(1)
    expect(nautilus!.orbitalGroup).toBe(5)
  })

  it('returns cleaner wrasse from test coverage', () => {
    const repo = createMockRepo({} as Partial<RepoDetails>)
    ;(repo as any).test_coverage_percent = 60
    const result = mapRepoToCreatureMetrics(repo)
    const wrasse = findCreature(result, 'cleaner-wrasse')
    expect(wrasse).toBeDefined()
    expect(wrasse!.count).toBe(3)
    expect(wrasse!.orbitalGroup).toBe(5)
  })

  it('returns starfish from resolved security advisories', () => {
    const repo = createMockRepo({} as Partial<RepoDetails>)
    ;(repo as any).resolved_security_advisories = 3
    const result = mapRepoToCreatureMetrics(repo)
    const starfish = findCreature(result, 'starfish')
    expect(starfish).toBeDefined()
    expect(starfish!.count).toBe(3)
    expect(starfish!.orbitalGroup).toBe(5)
  })

  it('returns basking shark from closed milestones', () => {
    const repo = createMockRepo({ closed_milestones_count: 2 })
    const result = mapRepoToCreatureMetrics(repo)
    const shark = findCreature(result, 'basking-shark')
    expect(shark).toBeDefined()
    expect(shark!.count).toBe(2)
    expect(shark!.orbitalGroup).toBe(5)
  })

  // ── EMPTY REPO ────────────────────────────────────────────────────

  it('returns empty array for repo with all zeros', () => {
    const repo = createMockRepo()
    const result = mapRepoToCreatureMetrics(repo)
    expect(result).toHaveLength(0)
  })

  // ── VALIDATION OF ALL CREATURE ORBIT GROUPS ───────────────────────

  it('all creatures have valid orbitalGroup (1-5) and trophicLevel (1-3)', () => {
    const repo = createMockRepo({
      contributor_count: 10,
      new_contributors_this_month: 5,
      commit_activity_weekly: [0, 0, 0, 0, 0, 0, 0, 5],
      bot_vs_human_ratio: 0.5,
      top_contributor_dominance: 40,
      code_frequency: [{ week: 1, additions: 1000, deletions: 0 }],
      deployments_count: 3,
      participation_ratio: 0.5,
      watchers_count: 10,
      stargazers_count: 20,
      traffic_views_count: 200,
      forks_count: 20,
      dependents_count: 5,
      used_by_count: 15,
      traffic_clones_count: 30,
      open_issues_count: 5,
      open_pr_count: 3,
      security_advisories_open_count: 2,
      dependabot_alerts_count: 3,
      open_milestones_count: 2,
      closed_milestones_count: 2,
      merged_pr_count: 4,
      avg_pr_issue_close_time_hours: 24,
    })
    const withExtras = repo as any
    withExtras.sponsors_count = 2
    withExtras.trending = true
    withExtras.isPinned = true
    withExtras.mention_count = 6
    withExtras.critical_pr_count = 2
    withExtras.bug_issue_count = 5
    withExtras.stalled_issue_count = 3
    withExtras.closed_issues_count = 9
    withExtras.test_coverage_percent = 40
    withExtras.resolved_security_advisories = 2

    const result = mapRepoToCreatureMetrics(withExtras)

    expect(result.length).toBeGreaterThan(0)
    for (const c of result) {
      expect(c.orbitalGroup).toBeGreaterThanOrEqual(1)
      expect(c.orbitalGroup).toBeLessThanOrEqual(5)
      expect(c.trophicLevel).toBeGreaterThanOrEqual(1)
      expect(c.trophicLevel).toBeLessThanOrEqual(3)
    }
  })

  // ── EDGE CASES ────────────────────────────────────────────────────

  it('handles null participation_ratio gracefully', () => {
    const repo = createMockRepo({
      participation_ratio: null,
      contributor_count: 5,
    })
    const result = mapRepoToCreatureMetrics(repo)
    expect(findCreature(result, 'herring-school')).toBeUndefined()
  })

  it('handles negative bot_vs_human_ratio', () => {
    const repo = createMockRepo({
      contributor_count: 5,
      bot_vs_human_ratio: -1,
    })
    const result = mapRepoToCreatureMetrics(repo)
    expect(findCreature(result, 'bluefin-tuna')).toBeUndefined()
  })

  describe('Keplerian orbital parameters and eccentricity scaling', () => {
    it('correctly maps Keplerian group parameters for each group', () => {
      const repo = createMockRepo({
        contributor_count: 5, // Builders (group 1)
        watchers_count: 5,    // Admirers (group 2)
        forks_count: 10,      // Offspring (group 3)
        open_issues_count: 5, // Problems (group 4)
        merged_pr_count: 5,   // Resolutions (group 5)
      })

      const results = mapRepoToCreatureMetrics(repo)

      const builder = findCreature(results, 'bottlenose-dolphin')!
      expect(builder).toBeDefined()
      expect(builder.orbitalGroup).toBe(1)
      expect(builder.orbitRadius).toBe(8)
      expect(builder.inclination).toBe(5)
      expect(builder.orbitSpeed).toBe(2.0)

      const admirer = findCreature(results, 'moon-jellyfish')!
      expect(admirer).toBeDefined()
      expect(admirer.orbitalGroup).toBe(2)
      expect(admirer.orbitRadius).toBe(30)
      expect(admirer.inclination).toBe(70)
      expect(admirer.orbitSpeed).toBe(0.3)

      const offspring = findCreature(results, 'whale-calf')!
      expect(offspring).toBeDefined()
      expect(offspring.orbitalGroup).toBe(3)
      expect(offspring.orbitRadius).toBe(22)
      expect(offspring.inclination).toBe(50)
      expect(offspring.orbitSpeed).toBe(0.8)

      const problem = findCreature(results, 'barracuda')!
      expect(problem).toBeDefined()
      expect(problem.orbitalGroup).toBe(4)
      expect(problem.orbitRadius).toBe(14)
      expect(problem.inclination).toBe(35)
      expect(problem.orbitSpeed).toBe(1.4)

      const resolution = findCreature(results, 'leatherback-turtle')!
      expect(resolution).toBeDefined()
      expect(resolution.orbitalGroup).toBe(5)
      expect(resolution.orbitRadius).toBe(18)
      expect(resolution.inclination).toBe(15)
      expect(resolution.orbitSpeed).toBe(0.6)
    })

    it('scales eccentricity with open issues according to the formula', () => {
      // With 50 open issues
      const repo50 = createMockRepo({
        contributor_count: 5,
        watchers_count: 5,
        forks_count: 10,
        open_issues_count: 50,
        merged_pr_count: 5,
      })
      const results50 = mapRepoToCreatureMetrics(repo50)

      // Expected eccentricity = base_ecc + (50 / 100) * 0.3 = base_ecc + 0.15
      expect(findCreature(results50, 'bottlenose-dolphin')!.eccentricity).toBeCloseTo(0.25)
      expect(findCreature(results50, 'moon-jellyfish')!.eccentricity).toBeCloseTo(0.25)
      expect(findCreature(results50, 'whale-calf')!.eccentricity).toBeCloseTo(0.55)
      expect(findCreature(results50, 'barracuda')!.eccentricity).toBeCloseTo(0.75)
      expect(findCreature(results50, 'leatherback-turtle')!.eccentricity).toBeCloseTo(0.35)

      // With 200 open issues, should be capped at 0.9
      const repo200 = createMockRepo({
        contributor_count: 5,
        watchers_count: 5,
        forks_count: 10,
        open_issues_count: 200,
        merged_pr_count: 5,
      })
      const results200 = mapRepoToCreatureMetrics(repo200)

      // Builders: 0.1 + 0.6 = 0.7
      expect(findCreature(results200, 'bottlenose-dolphin')!.eccentricity).toBeCloseTo(0.7)
      // Offspring: 0.4 + 0.6 = 1.0 -> capped at 0.9
      expect(findCreature(results200, 'whale-calf')!.eccentricity).toBeCloseTo(0.9)
      // Problems: 0.6 + 0.6 = 1.2 -> capped at 0.9
      expect(findCreature(results200, 'barracuda')!.eccentricity).toBeCloseTo(0.9)
      // Resolutions: 0.2 + 0.6 = 0.8
      expect(findCreature(results200, 'leatherback-turtle')!.eccentricity).toBeCloseTo(0.8)
    })
  })
})

describe('mapRepoToKelpTower', () => {

  it('height is proportional to commits and releases', () => {
    const repo = createMockRepo({
      contributor_count: 10,
      release_count: 2,
    })
    const result = mapRepoToKelpTower(repo)
    const totalCommits = 10 * 10 + 2 * 50
    const expectedHeight = Math.min(Math.max(Math.floor(totalCommits / 10), 1), 50)
    expect(result.height).toBe(expectedHeight)
  })

  it('height is at least 1', () => {
    const repo = createMockRepo({
      contributor_count: 0,
      release_count: 0,
    })
    const result = mapRepoToKelpTower(repo)
    expect(result.height).toBe(1)
  })

  it('height is capped at 50', () => {
    const repo = createMockRepo({
      contributor_count: 100,
      release_count: 100,
    })
    const result = mapRepoToKelpTower(repo)
    expect(result.height).toBe(50)
  })

  it('frond density from contributor count', () => {
    const repo = createMockRepo({ contributor_count: 8 })
    const result = mapRepoToKelpTower(repo)
    expect(result.frondDensity).toBe(4)
  })

  it('frond density capped at 10', () => {
    const repo = createMockRepo({ contributor_count: 50 })
    const result = mapRepoToKelpTower(repo)
    expect(result.frondDensity).toBe(10)
  })

  it('boolean fields match input', () => {
    const repo = createMockRepo({
      has_wiki: true,
      homepage_url: 'https://example.com',
      has_pages: true,
      has_projects: true,
      has_discussions: true,
    })
    const result = mapRepoToKelpTower(repo)
    expect(result.hasWiki).toBe(true)
    expect(result.hasHomepage).toBe(true)
    expect(result.hasPages).toBe(true)
    expect(result.hasProjects).toBe(true)
    expect(result.hasDiscussions).toBe(true)
  })

  it('hasHomepage is false when homepage_url is null', () => {
    const repo = createMockRepo({ homepage_url: null })
    const result = mapRepoToKelpTower(repo)
    expect(result.hasHomepage).toBe(false)
  })

  it('releaseCount and releaseRecencyDays are passed through', () => {
    const repo = createMockRepo({
      release_count: 7,
      days_since_last_release: 14,
    })
    const result = mapRepoToKelpTower(repo)
    expect(result.releaseCount).toBe(7)
    expect(result.releaseRecencyDays).toBe(14)
  })

  it('releaseRecencyDays defaults to 0 when null', () => {
    const repo = createMockRepo({
      release_count: 0,
      days_since_last_release: null,
    })
    const result = mapRepoToKelpTower(repo)
    expect(result.releaseRecencyDays).toBe(0)
  })
})

describe('mapReposToOceanState', () => {

  it('aggregates across multiple repos', () => {
    const repo1 = createMockRepo({
      contributor_count: 5,
      watchers_count: 3,
      stargazers_count: 10,
      dependents_count: 2,
      used_by_count: 10,
      open_issues_count: 1,
      open_pr_count: 1,
      merged_pr_count: 2,
      community_health_percentage: 80,
    })
    const repo2 = createMockRepo({
      contributor_count: 3,
      watchers_count: 2,
      stargazers_count: 6,
      forks_count: 10,
      dependents_count: 1,
      used_by_count: 5,
      open_issues_count: 2,
      merged_pr_count: 1,
      community_health_percentage: 60,
    })

    const result = mapReposToOceanState([repo1, repo2])

    expect(result.totalCreatures).toBeGreaterThan(0)
    expect(result.speciesRichness).toBeGreaterThan(0)
    expect(result.communityHealthAvg).toBe(70)
  })

  it('total creatures is capped at 200', () => {
    const manyCreatures = createMockRepo({
      contributor_count: 20,
      new_contributors_this_month: 8,
      watchers_count: 15,
      stargazers_count: 100,
      forks_count: 50,
      dependents_count: 8,
      used_by_count: 50,
      traffic_views_count: 4000,
      traffic_clones_count: 150,
      code_frequency: [{ week: 1, additions: 6000, deletions: 0 }],
      participation_ratio: 1.0,
      open_issues_count: 10,
      open_pr_count: 8,
      merged_pr_count: 8,
      deployments_count: 10,
      dependabot_alerts_count: 8,
      security_advisories_open_count: 5,
    })
    const manyExtras = manyCreatures as any
    manyExtras.sponsors_count = 5
    manyExtras.mention_count = 18
    manyExtras.critical_pr_count = 5
    manyExtras.bug_issue_count = 20
    manyExtras.stalled_issue_count = 6
    manyExtras.closed_issues_count = 18
    manyExtras.test_coverage_percent = 100
    manyExtras.resolved_security_advisories = 5

    const result = mapReposToOceanState([manyCreatures, manyCreatures])
    expect(result.totalCreatures).toBeLessThanOrEqual(200)
  })

  it('security score: 100 minus alerts * 5', () => {
    const repo = createMockRepo({
      dependabot_alerts_count: 3,
      security_advisories_open_count: 2,
    })
    const result = mapReposToOceanState([repo])
    expect(result.securityScore).toBe(100 - 5 * 5)
  })

  it('security score floor at 0', () => {
    const repo = createMockRepo({
      dependabot_alerts_count: 50,
      security_advisories_open_count: 50,
    })
    const result = mapReposToOceanState([repo])
    expect(result.securityScore).toBe(0)
  })

  it('species richness counts unique creature types', () => {
    const repo = createMockRepo({
      contributor_count: 5,
      watchers_count: 5,
      stargazers_count: 10,
      forks_count: 10,
      merged_pr_count: 3,
    })
    const result = mapReposToOceanState([repo, repo])
    const types = new Set(
      mapRepoToCreatureMetrics(repo).map((c) => c.creatureType),
    )
    expect(result.speciesRichness).toBe(types.size)
  })

  it('community health average is correct', () => {
    const repo1 = createMockRepo({ community_health_percentage: 90 })
    const repo2 = createMockRepo({ community_health_percentage: 70 })
    const repo3 = createMockRepo({ community_health_percentage: 50 })
    const result = mapReposToOceanState([repo1, repo2, repo3])
    expect(result.communityHealthAvg).toBe(70)
  })

  it('community health is 0 when no repo has data', () => {
    const repo = createMockRepo({ community_health_percentage: null })
    const result = mapReposToOceanState([repo])
    expect(result.communityHealthAvg).toBe(0)
  })

  it('bioluminescence count matches total releases capped at 100', () => {
    const repo1 = createMockRepo({ release_count: 30 })
    const repo2 = createMockRepo({ release_count: 40 })
    const result = mapReposToOceanState([repo1, repo2])
    expect(result.bioluminescenceCount).toBe(70)
  })

  it('whale size scales with stargazers', () => {
    const repo = createMockRepo({ stargazers_count: 50 })
    const result = mapReposToOceanState([repo])
    expect(result.whaleSize).toBe(6)
  })

  it('ocean depth scales with open issues', () => {
    const repo = createMockRepo({ open_issues_count: 20 })
    const result = mapReposToOceanState([repo])
    expect(result.oceanDepth).toBe(4)
  })

  it('coral count scales with forks', () => {
    const repo = createMockRepo({ forks_count: 10 })
    const result = mapReposToOceanState([repo])
    expect(result.coralCount).toBe(5)
  })

  it('empty repos array returns base state', () => {
    const result = mapReposToOceanState([])
    expect(result.totalCreatures).toBe(0)
    expect(result.speciesRichness).toBe(0)
    expect(result.communityHealthAvg).toBe(0)
    expect(result.securityScore).toBe(100)
    expect(result.whaleSize).toBe(1)
    expect(result.activityIndex).toBe(0)
  })
})
