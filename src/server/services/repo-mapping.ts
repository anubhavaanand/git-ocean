import type { RepoDetails } from './github-api'

export interface CreatureInstruction {
  creatureType: string
  count: number
  scaleX: number
  scaleY: number
  scaleZ: number
  level: number
}

export interface KelpTowerData {
  height: number
  frondDensity: number
}

export interface OceanAggregate {
  whaleSize: number
  bioluminescenceCount: number
  oceanDepth: number
  coralCount: number
  totalCreatures: number
}

export function mapRepoToCreatureMetrics(repo: RepoDetails): CreatureInstruction[] {
  const instructions: CreatureInstruction[] = []

  const dolphinCount = Math.min(repo.contributor_count, 20)
  if (dolphinCount > 0) {
    instructions.push({ creatureType: 'dolphin', count: dolphinCount, scaleX: 1, scaleY: 1, scaleZ: 1, level: 3 })
  }

  const jellyfishCount = Math.min(Math.floor(repo.watchers_count / 5), 15)
  if (jellyfishCount > 0) {
    instructions.push({ creatureType: 'jellyfish', count: jellyfishCount, scaleX: 0.8, scaleY: 0.8, scaleZ: 0.8, level: 2 })
  }

  const turtleCount = Math.min(Math.floor(repo.merged_pr_count / 2), 10)
  if (turtleCount > 0) {
    instructions.push({ creatureType: 'turtle', count: turtleCount, scaleX: 1, scaleY: 1, scaleZ: 1, level: 2 })
  }

  const barracudaCount = Math.min(repo.open_issues_count, 10)
  if (barracudaCount > 0) {
    instructions.push({ creatureType: 'barracuda', count: barracudaCount, scaleX: 0.7, scaleY: 0.7, scaleZ: 0.7, level: 1 })
  }

  const octopusCount = Math.min(repo.open_pr_count, 8)
  if (octopusCount > 0) {
    instructions.push({ creatureType: 'octopus', count: octopusCount, scaleX: 1, scaleY: 1, scaleZ: 1, level: 3 })
  }

  const rayScale = Math.min(1 + repo.stargazers_count / 100, 3)
  instructions.push({ creatureType: 'manta-ray', count: 1, scaleX: rayScale, scaleY: rayScale, scaleZ: rayScale, level: 4 })

  const seahorseCount = Math.min(repo.release_count, 15)
  if (seahorseCount > 0) {
    instructions.push({ creatureType: 'seahorse', count: seahorseCount, scaleX: 0.6, scaleY: 0.6, scaleZ: 0.6, level: 1 })
  }

  const crabCount = Math.min(Math.floor(repo.open_issues_count / 5), 8)
  if (crabCount > 0) {
    instructions.push({ creatureType: 'crab', count: crabCount, scaleX: 0.5, scaleY: 0.5, scaleZ: 0.5, level: 1 })
  }

  if (repo.vulnerability_alerts > 0) {
    instructions.push({ creatureType: 'anglerfish', count: 1, scaleX: 1.5, scaleY: 1.5, scaleZ: 1.5, level: 5 })
  }

  const starfishCount = Math.min(Math.floor((repo.vulnerability_alerts ?? 0) / 2), 5)
  if (starfishCount > 0) {
    instructions.push({ creatureType: 'starfish', count: starfishCount, scaleX: 0.5, scaleY: 0.5, scaleZ: 0.5, level: 3 })
  }

  return instructions
}

export function mapRepoToKelpTower(repo: RepoDetails): KelpTowerData {
  const totalCommits = repo.contributor_count * 10 + repo.release_count * 50
  const height = Math.min(Math.max(Math.floor(totalCommits / 10), 1), 50)
  const frondDensity = Math.min(Math.floor(repo.contributor_count / 2), 10)

  return { height, frondDensity }
}

export function mapReposToOceanState(repos: RepoDetails[]): OceanAggregate {
  const totals = repos.reduce(
    (acc, repo) => {
      acc.stars += repo.stargazers_count
      acc.forks += repo.forks_count
      acc.issues += repo.open_issues_count
      acc.prs += repo.open_pr_count
      acc.contributors += repo.contributor_count
      acc.releases += repo.release_count
      return acc
    },
    { stars: 0, forks: 0, issues: 0, prs: 0, contributors: 0, releases: 0 },
  )

  const whaleSize = Math.min(Math.floor(totals.stars / 10) + 1, 10)
  const bioluminescenceCount = Math.min(totals.releases, 100)
  const oceanDepth = Math.min(Math.floor(totals.issues / 5), 50)
  const coralCount = Math.min(Math.floor(totals.forks / 2), 30)
  const totalCreatures =
    totals.contributors +
    Math.floor(totals.stars / 5) +
    Math.floor(totals.prs / 2) +
    totals.issues

  return {
    whaleSize,
    bioluminescenceCount,
    oceanDepth,
    coralCount,
    totalCreatures: Math.min(totalCreatures, 200),
  }
}
