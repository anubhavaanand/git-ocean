import type { RepoDetails } from './github-api'

export interface CreatureInstruction {
  creatureType: string
  count: number
  scaleX: number
  scaleY: number
  scaleZ: number
  level: number
  trophicLevel: number
  orbitRadius: number
  orbitSpeed: number
  inclination: number
  eccentricity: number
  orbitalGroup: number
  dataAccessLevel: string
}

export interface KelpTowerData {
  height: number
  frondDensity: number
  hasWiki: boolean
  hasHomepage: boolean
  hasPages: boolean
  hasProjects: boolean
  hasDiscussions: boolean
  releaseCount: number
  releaseRecencyDays: number
}

export interface OceanAggregate {
  whaleSize: number
  bioluminescenceCount: number
  oceanDepth: number
  coralCount: number
  totalCreatures: number
  totalTrophicMass: number
  speciesRichness: number
  activityIndex: number
  securityScore: number
  communityHealthAvg: number
}

export function mapRepoToCreatureMetrics(repo: RepoDetails): CreatureInstruction[] {
  const instructions: CreatureInstruction[] = []

  const codeFrequencyAdditions = (repo.code_frequency ?? []).reduce((sum, entry) => sum + Math.max(0, entry.additions), 0)
  const commitStreak = (repo.commit_activity_weekly ?? []).slice(-8).some(v => v > 0) ? 1 : 0
  const participationOwnerRatio = repo.participation_ratio ?? 0
  const ratio = repo.bot_vs_human_ratio
  let botContributorCount = 0
  if (ratio != null && ratio !== Infinity && ratio >= 0) {
    botContributorCount = Math.round((ratio * repo.contributor_count) / (1 + ratio))
  } else if (ratio != null && ratio === Infinity) {
    botContributorCount = repo.contributor_count
  }

  // ── GROUP 1 — BUILDERS (innermost orbits) ──────────────────────

  const dolphinCount = Math.min(repo.contributor_count, 20)
  if (dolphinCount > 0) {
    instructions.push({
      creatureType: 'bottlenose-dolphin', count: dolphinCount,
      scaleX: 1, scaleY: 1, scaleZ: 1, level: 3, trophicLevel: 1,
      orbitRadius: 1.5, orbitSpeed: 1.5, inclination: 10, eccentricity: 0.1,
      orbitalGroup: 1, dataAccessLevel: 'L1',
    })
  }

  const spinnerCount = Math.min(repo.new_contributors_this_month, 8)
  if (spinnerCount > 0) {
    instructions.push({
      creatureType: 'spinner-dolphin', count: spinnerCount,
      scaleX: 1, scaleY: 1, scaleZ: 1, level: 2, trophicLevel: 2,
      orbitRadius: 1.8, orbitSpeed: 1.3, inclination: 10, eccentricity: 0.2,
      orbitalGroup: 1, dataAccessLevel: 'L2',
    })
  }

  if (commitStreak > 0) {
    instructions.push({
      creatureType: 'sailfish', count: 1,
      scaleX: 1.2, scaleY: 1.2, scaleZ: 1.2, level: 2, trophicLevel: 1,
      orbitRadius: 1.6, orbitSpeed: 2.0, inclination: 10, eccentricity: 0.15,
      orbitalGroup: 1, dataAccessLevel: 'L1',
    })
  }

  const tunaCount = Math.min(botContributorCount, 10)
  if (tunaCount > 0) {
    instructions.push({
      creatureType: 'bluefin-tuna', count: tunaCount,
      scaleX: 1, scaleY: 1, scaleZ: 1, level: 2, trophicLevel: 2,
      orbitRadius: 2.0, orbitSpeed: 1.1, inclination: 10, eccentricity: 0.2,
      orbitalGroup: 1, dataAccessLevel: 'L2',
    })
  }

  const cuttlefishDominance = repo.top_contributor_dominance ?? 0
  if (cuttlefishDominance > 0) {
    instructions.push({
      creatureType: 'cuttlefish', count: 1,
      scaleX: 0.8, scaleY: 0.8, scaleZ: 0.8, level: 1, trophicLevel: 2,
      orbitRadius: 1.7, orbitSpeed: 1.2, inclination: 10, eccentricity: 0.1,
      orbitalGroup: 1, dataAccessLevel: 'L2',
    })
  }

  const krillCount = Math.min(Math.floor(codeFrequencyAdditions / 100), 30)
  if (krillCount > 0) {
    instructions.push({
      creatureType: 'krill-swarm', count: krillCount,
      scaleX: 0.5, scaleY: 0.5, scaleZ: 0.5, level: 2, trophicLevel: 1,
      orbitRadius: 2.5, orbitSpeed: 1.4, inclination: 10, eccentricity: 0.3,
      orbitalGroup: 1, dataAccessLevel: 'L1',
    })
  }

  const swordfishCount = Math.min(repo.deployments_count, 10)
  if (swordfishCount > 0) {
    instructions.push({
      creatureType: 'swordfish', count: swordfishCount,
      scaleX: 1.1, scaleY: 1.1, scaleZ: 1.1, level: 2, trophicLevel: 2,
      orbitRadius: 2.2, orbitSpeed: 1.8, inclination: 10, eccentricity: 0.2,
      orbitalGroup: 1, dataAccessLevel: 'L2',
    })
  }

  const herringCount = Math.min(Math.round(participationOwnerRatio * 10), 20)
  if (herringCount > 0) {
    instructions.push({
      creatureType: 'herring-school', count: herringCount,
      scaleX: 0.6, scaleY: 0.6, scaleZ: 0.6, level: 2, trophicLevel: 2,
      orbitRadius: 2.3, orbitSpeed: 1.0, inclination: 10, eccentricity: 0.15,
      orbitalGroup: 1, dataAccessLevel: 'L2',
    })
  }

  // ── GROUP 2 — ADMIRERS (outermost orbits) ──────────────────────

  const moonJellyfishCount = Math.min(repo.watchers_count, 15)
  if (moonJellyfishCount > 0) {
    instructions.push({
      creatureType: 'moon-jellyfish', count: moonJellyfishCount,
      scaleX: 0.8, scaleY: 0.8, scaleZ: 0.8, level: 2, trophicLevel: 1,
      orbitRadius: 4.0, orbitSpeed: 0.4, inclination: 30, eccentricity: 0.05,
      orbitalGroup: 2, dataAccessLevel: 'L1',
    })
  }

  const lionsManeCount = Math.min((repo as any).sponsors_count ?? 0, 5)
  if (lionsManeCount > 0) {
    instructions.push({
      creatureType: 'lions-mane-jellyfish', count: lionsManeCount,
      scaleX: 1.3, scaleY: 1.3, scaleZ: 1.3, level: 2, trophicLevel: 1,
      orbitRadius: 4.5, orbitSpeed: 0.3, inclination: 30, eccentricity: 0.05,
      orbitalGroup: 2, dataAccessLevel: 'L1',
    })
  }

  const dinoCount = Math.min(Math.floor(repo.stargazers_count / 2), 50)
  if (dinoCount > 0) {
    instructions.push({
      creatureType: 'dinoflagellates', count: dinoCount,
      scaleX: 0.3, scaleY: 0.3, scaleZ: 0.3, level: 1, trophicLevel: 1,
      orbitRadius: 5.0, orbitSpeed: 0.2, inclination: 30, eccentricity: 0.05,
      orbitalGroup: 2, dataAccessLevel: 'L1',
    })
  }

  const seaSparkleActive = (repo as any).trending ?? false
  if (seaSparkleActive) {
    instructions.push({
      creatureType: 'sea-sparkle', count: 1,
      scaleX: 0.6, scaleY: 0.6, scaleZ: 0.6, level: 4, trophicLevel: 1,
      orbitRadius: 5.5, orbitSpeed: 0.25, inclination: 30, eccentricity: 0.02,
      orbitalGroup: 2, dataAccessLevel: 'L1',
    })
  }

  const salpPinned = (repo as any).isPinned ?? false
  if (salpPinned) {
    instructions.push({
      creatureType: 'salps', count: 1,
      scaleX: 0.7, scaleY: 0.7, scaleZ: 0.7, level: 1, trophicLevel: 1,
      orbitRadius: 4.8, orbitSpeed: 0.2, inclination: 30, eccentricity: 0.05,
      orbitalGroup: 2, dataAccessLevel: 'L1',
    })
  }

  const copepodCount = Math.min(Math.floor(repo.traffic_views_count / 100), 40)
  if (copepodCount > 0) {
    instructions.push({
      creatureType: 'copepods', count: copepodCount,
      scaleX: 0.3, scaleY: 0.3, scaleZ: 0.3, level: 1, trophicLevel: 3,
      orbitRadius: 6.0, orbitSpeed: 0.3, inclination: 30, eccentricity: 0.08,
      orbitalGroup: 2, dataAccessLevel: 'L3',
    })
  }

  // ── GROUP 3 — OFFSPRING (trailing orbits) ──────────────────────

  const whaleCalfCount = Math.min(Math.floor(repo.forks_count / 10), 5)
  if (whaleCalfCount > 0) {
    instructions.push({
      creatureType: 'whale-calf', count: whaleCalfCount,
      scaleX: 1.5, scaleY: 1.5, scaleZ: 1.5, level: 4, trophicLevel: 1,
      orbitRadius: 2.5, orbitSpeed: 0.8, inclination: 15, eccentricity: 0.4,
      orbitalGroup: 3, dataAccessLevel: 'L1',
    })
  }

  const mantaCount = Math.min(repo.dependents_count, 8)
  if (mantaCount > 0) {
    instructions.push({
      creatureType: 'manta-ray', count: mantaCount,
      scaleX: 1.2, scaleY: 1.2, scaleZ: 1.2, level: 4, trophicLevel: 1,
      orbitRadius: 3.0, orbitSpeed: 0.7, inclination: 15, eccentricity: 0.35,
      orbitalGroup: 3, dataAccessLevel: 'L1',
    })
  }

  const hammerheadCount = Math.min(Math.floor(repo.used_by_count / 5), 10)
  if (hammerheadCount > 0) {
    instructions.push({
      creatureType: 'hammerhead-school', count: hammerheadCount,
      scaleX: 0.9, scaleY: 0.9, scaleZ: 0.9, level: 2, trophicLevel: 1,
      orbitRadius: 3.5, orbitSpeed: 0.6, inclination: 15, eccentricity: 0.4,
      orbitalGroup: 3, dataAccessLevel: 'L1',
    })
  }

  const flyingFishCount = Math.min(Math.floor(((repo as any).mention_count ?? 0) / 3), 6)
  if (flyingFishCount > 0) {
    instructions.push({
      creatureType: 'flying-fish', count: flyingFishCount,
      scaleX: 0.7, scaleY: 0.7, scaleZ: 0.7, level: 2, trophicLevel: 1,
      orbitRadius: 4.0, orbitSpeed: 0.8, inclination: 15, eccentricity: 0.45,
      orbitalGroup: 3, dataAccessLevel: 'L1',
    })
  }

  const amphipodCount = Math.min(Math.floor(repo.traffic_clones_count / 10), 15)
  if (amphipodCount > 0) {
    instructions.push({
      creatureType: 'amphipod-surge', count: amphipodCount,
      scaleX: 0.4, scaleY: 0.4, scaleZ: 0.4, level: 1, trophicLevel: 3,
      orbitRadius: 2.8, orbitSpeed: 0.9, inclination: 15, eccentricity: 0.5,
      orbitalGroup: 3, dataAccessLevel: 'L3',
    })
  }

  // ── GROUP 4 — PROBLEMS (erratic orbits) ────────────────────────

  const barracudaCount = Math.min(repo.open_issues_count, 10)
  if (barracudaCount > 0) {
    instructions.push({
      creatureType: 'barracuda', count: barracudaCount,
      scaleX: 0.7, scaleY: 0.7, scaleZ: 0.7, level: 1, trophicLevel: 1,
      orbitRadius: 2.0, orbitSpeed: 1.2, inclination: 20, eccentricity: 0.6,
      orbitalGroup: 4, dataAccessLevel: 'L1',
    })
  }

  const octopusCount = Math.min(repo.open_pr_count, 8)
  if (octopusCount > 0) {
    instructions.push({
      creatureType: 'giant-pacific-octopus', count: octopusCount,
      scaleX: 1.2, scaleY: 1.2, scaleZ: 1.2, level: 3, trophicLevel: 2,
      orbitRadius: 2.2, orbitSpeed: 1.0, inclination: 20, eccentricity: 0.6,
      orbitalGroup: 4, dataAccessLevel: 'L2',
    })
  }

  const lionfishCount = Math.min(repo.security_advisories_open_count, 5)
  if (lionfishCount > 0) {
    instructions.push({
      creatureType: 'lionfish', count: lionfishCount,
      scaleX: 0.8, scaleY: 0.8, scaleZ: 0.8, level: 3, trophicLevel: 3,
      orbitRadius: 2.5, orbitSpeed: 0.8, inclination: 20, eccentricity: 0.7,
      orbitalGroup: 4, dataAccessLevel: 'L3',
    })
  }

  const morayCount = Math.min(repo.dependabot_alerts_count, 8)
  if (morayCount > 0) {
    instructions.push({
      creatureType: 'moray-eel', count: morayCount,
      scaleX: 0.9, scaleY: 0.9, scaleZ: 0.9, level: 2, trophicLevel: 3,
      orbitRadius: 2.3, orbitSpeed: 0.9, inclination: 20, eccentricity: 0.65,
      orbitalGroup: 4, dataAccessLevel: 'L3',
    })
  }

  const mantisShrimpCount = Math.min((repo as any).critical_pr_count ?? 0, 5)
  if (mantisShrimpCount > 0) {
    instructions.push({
      creatureType: 'mantis-shrimp', count: mantisShrimpCount,
      scaleX: 0.6, scaleY: 0.6, scaleZ: 0.6, level: 2, trophicLevel: 2,
      orbitRadius: 1.8, orbitSpeed: 1.5, inclination: 20, eccentricity: 0.7,
      orbitalGroup: 4, dataAccessLevel: 'L2',
    })
  }

  const arrowWormCount = Math.min((repo as any).bug_issue_count ?? 0, 20)
  if (arrowWormCount > 0) {
    instructions.push({
      creatureType: 'arrow-worms', count: arrowWormCount,
      scaleX: 0.4, scaleY: 0.4, scaleZ: 0.4, level: 1, trophicLevel: 1,
      orbitRadius: 2.5, orbitSpeed: 1.1, inclination: 20, eccentricity: 0.7,
      orbitalGroup: 4, dataAccessLevel: 'L1',
    })
  }

  const decoratorCrabCount = Math.min((repo as any).stalled_issue_count ?? 0, 6)
  if (decoratorCrabCount > 0) {
    instructions.push({
      creatureType: 'decorator-crab', count: decoratorCrabCount,
      scaleX: 0.5, scaleY: 0.5, scaleZ: 0.5, level: 1, trophicLevel: 2,
      orbitRadius: 3.0, orbitSpeed: 0.3, inclination: 20, eccentricity: 0.8,
      orbitalGroup: 4, dataAccessLevel: 'L2',
    })
  }

  const giantSquidCount = Math.min(repo.open_milestones_count, 3)
  if (giantSquidCount > 0) {
    instructions.push({
      creatureType: 'giant-squid', count: giantSquidCount,
      scaleX: 1.5, scaleY: 1.5, scaleZ: 1.5, level: 5, trophicLevel: 2,
      orbitRadius: 3.5, orbitSpeed: 0.5, inclination: 20, eccentricity: 0.65,
      orbitalGroup: 4, dataAccessLevel: 'L2',
    })
  }

  // ── GROUP 5 — RESOLUTIONS (spiral orbits) ──────────────────────

  const leatherbackCount = Math.min(repo.merged_pr_count, 8)
  if (leatherbackCount > 0) {
    instructions.push({
      creatureType: 'leatherback-turtle', count: leatherbackCount,
      scaleX: 1.2, scaleY: 1.2, scaleZ: 1.2, level: 3, trophicLevel: 2,
      orbitRadius: 3.0, orbitSpeed: 0.5, inclination: 25, eccentricity: 0.15,
      orbitalGroup: 5, dataAccessLevel: 'L2',
    })
  }

  const greenTurtleCount = Math.min(Math.floor(((repo as any).closed_issues_count ?? 0) / 3), 6)
  if (greenTurtleCount > 0) {
    instructions.push({
      creatureType: 'green-sea-turtle', count: greenTurtleCount,
      scaleX: 1, scaleY: 1, scaleZ: 1, level: 2, trophicLevel: 1,
      orbitRadius: 3.5, orbitSpeed: 0.4, inclination: 25, eccentricity: 0.15,
      orbitalGroup: 5, dataAccessLevel: 'L1',
    })
  }

  const avgIssueCloseTimeHours = repo.avg_pr_issue_close_time_hours ?? (repo as any).avg_issue_close_time_hours ?? 0
  const nautilusCount = avgIssueCloseTimeHours > 0 ? 1 : 0
  if (nautilusCount > 0) {
    instructions.push({
      creatureType: 'nautilus', count: nautilusCount,
      scaleX: 0.8, scaleY: 0.8, scaleZ: 0.8, level: 1, trophicLevel: 2,
      orbitRadius: 4.0, orbitSpeed: 0.35, inclination: 25, eccentricity: 0.15,
      orbitalGroup: 5, dataAccessLevel: 'L2',
    })
  }

  const cleanerWrasseCount = Math.min(Math.floor(((repo as any).test_coverage_percent ?? 0) / 20), 5)
  if (cleanerWrasseCount > 0) {
    instructions.push({
      creatureType: 'cleaner-wrasse', count: cleanerWrasseCount,
      scaleX: 0.5, scaleY: 0.5, scaleZ: 0.5, level: 2, trophicLevel: 3,
      orbitRadius: 1.5, orbitSpeed: 0.6, inclination: 25, eccentricity: 0.12,
      orbitalGroup: 5, dataAccessLevel: 'L3',
    })
  }

  const starfishCount = Math.min((repo as any).resolved_security_advisories ?? 0, 5)
  if (starfishCount > 0) {
    instructions.push({
      creatureType: 'starfish', count: starfishCount,
      scaleX: 0.6, scaleY: 0.6, scaleZ: 0.6, level: 3, trophicLevel: 3,
      orbitRadius: 5.0, orbitSpeed: 0.3, inclination: 25, eccentricity: 0.18,
      orbitalGroup: 5, dataAccessLevel: 'L3',
    })
  }

  const baskingSharkCount = Math.min(repo.closed_milestones_count, 3)
  if (baskingSharkCount > 0) {
    instructions.push({
      creatureType: 'basking-shark', count: baskingSharkCount,
      scaleX: 1.5, scaleY: 1.5, scaleZ: 1.5, level: 4, trophicLevel: 2,
      orbitRadius: 4.5, orbitSpeed: 0.45, inclination: 25, eccentricity: 0.15,
      orbitalGroup: 5, dataAccessLevel: 'L2',
    })
  }

  return instructions
}

export function mapRepoToKelpTower(repo: RepoDetails): KelpTowerData {
  const totalCommits = repo.contributor_count * 10 + repo.release_count * 50
  const height = Math.min(Math.max(Math.floor(totalCommits / 10), 1), 50)
  const frondDensity = Math.min(Math.floor(repo.contributor_count / 2), 10)

  return {
    height,
    frondDensity,
    hasWiki: repo.has_wiki,
    hasHomepage: !!repo.homepage_url,
    hasPages: repo.has_pages,
    hasProjects: repo.has_projects,
    hasDiscussions: repo.has_discussions,
    releaseCount: repo.release_count,
    releaseRecencyDays: repo.days_since_last_release ?? 0,
  }
}

export function mapReposToOceanState(repos: RepoDetails[]): OceanAggregate {
  let totalCreatures = 0
  let totalTrophicMass = 0
  const allCreatureTypes = new Set<string>()
  let totalOpenActivity = 0
  let totalSecurityIssues = 0
  let totalCommunityHealth = 0
  let communityHealthCount = 0

  for (const repo of repos) {
    const creatures = mapRepoToCreatureMetrics(repo)
    for (const c of creatures) {
      totalCreatures += c.count
      totalTrophicMass += c.count * c.trophicLevel
      allCreatureTypes.add(c.creatureType)
    }

    totalOpenActivity += repo.open_issues_count + repo.open_pr_count
    totalSecurityIssues += repo.dependabot_alerts_count + repo.security_advisories_open_count

    if (repo.community_health_percentage != null) {
      totalCommunityHealth += repo.community_health_percentage
      communityHealthCount++
    }
  }

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0)
  const totalIssues = repos.reduce((s, r) => s + r.open_issues_count, 0)
  const totalReleases = repos.reduce((s, r) => s + r.release_count, 0)

  const whaleSize = Math.min(Math.floor(totalStars / 10) + 1, 10)
  const bioluminescenceCount = Math.min(totalReleases, 100)
  const oceanDepth = Math.min(Math.floor(totalIssues / 5), 50)
  const coralCount = Math.min(Math.floor(totalForks / 2), 30)
  const activityIndex = Math.min(Math.floor(totalOpenActivity / 3), 50)
  const securityScore = Math.max(0, 100 - totalSecurityIssues * 5)
  const communityHealthAvg = communityHealthCount > 0 ? Math.round(totalCommunityHealth / communityHealthCount) : 0

  return {
    whaleSize,
    bioluminescenceCount,
    oceanDepth,
    coralCount,
    totalCreatures: Math.min(totalCreatures, 200),
    totalTrophicMass,
    speciesRichness: allCreatureTypes.size,
    activityIndex,
    securityScore,
    communityHealthAvg,
  }
}
