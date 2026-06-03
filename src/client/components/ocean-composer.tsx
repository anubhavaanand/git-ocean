import { useEffect, useRef, useCallback } from 'react'
import { Scene, Vector3, Euler } from 'three'
import { OceanScene } from './ocean-scene'
import { createOceanFloor } from './ocean-floor'
import { createKelpTower } from './kelp-tower'
import { createWhale, type WhaleEntity } from './whale-entity'
import {
  createCreature,
  createInstancedSwarm,
  type CreatureConfig,
  type CreatureType,
} from './creature-factory'
import type { GitHubRepoData } from '@/client/hooks/use-ocean-data'

interface OceanComposerProps {
  repoData: GitHubRepoData[]
  className?: string
}

const FLOOR_Y = -18
const FLOOR_SIZE = 30
const ARRANGE_RADIUS = 5

const WHALE_COLORS = ['#06B6D4', '#0d9488', '#0891b2', '#14b8a6', '#67e8f9']

const DIALECTS = ['northern', 'southern', 'eastern', 'western', 'deep']

const CREATURE_COLORS: Record<CreatureType, string> = {
  // LEGACY
  dolphin: '#22d3ee',
  jellyfish: '#c084fc',
  turtle: '#34d399',
  barracuda: '#f87171',
  octopus: '#fb923c',
  'manta-ray': '#818cf8',
  seahorse: '#fbbf24',
  crab: '#ef4444',
  anglerfish: '#1a1a2e',
  starfish: '#f59e0b',
  // GROUP 1 — BUILDERS
  'bottlenose-dolphin': '#22d3ee',
  'spinner-dolphin': '#06b6d4',
  sailfish: '#3b82f6',
  'bluefin-tuna': '#2563eb',
  cuttlefish: '#a78bfa',
  'krill-swarm': '#f97316',
  swordfish: '#6366f1',
  'herring-school': '#94a3b8',
  // GROUP 2 — ADMIRERS
  'moon-jellyfish': '#c084fc',
  'lions-mane-jellyfish': '#f59e0b',
  dinoflagellates: '#10b981',
  'sea-sparkle': '#06b6d4',
  salps: '#e2e8f0',
  copepods: '#84cc16',
  // GROUP 3 — OFFSPRING
  'whale-calf': '#14b8a6',
  'hammerhead-school': '#64748b',
  'flying-fish': '#a3e635',
  'amphipod-surge': '#f97316',
  // GROUP 4 — PROBLEMS
  'giant-pacific-octopus': '#fb923c',
  lionfish: '#ef4444',
  'moray-eel': '#65a30d',
  'mantis-shrimp': '#ec4899',
  'arrow-worms': '#94a3b8',
  'decorator-crab': '#ef4444',
  'giant-squid': '#dc2626',
  // GROUP 5 — RESOLUTIONS
  'leatherback-turtle': '#34d399',
  'green-sea-turtle': '#10b981',
  nautilus: '#f8fafc',
  'cleaner-wrasse': '#06b6d4',
  'basking-shark': '#475569',
  // AMBIENT WORLD LIFE
  'pilot-fish': '#64748b',
  'comb-jellyfish': '#a78bfa',
  viperfish: '#1e293b',
  'telescope-octopus': '#8b5cf6',
  'giant-isopod': '#d97706',
  'whale-fall-ecosystem': '#78716c',
  'firefly-squid': '#06b6d4',
}

function repoToCreatureType(repo: GitHubRepoData): CreatureType {
  if (repo.stars > 80) return 'dolphin'
  if (repo.forks > 30) return 'jellyfish'
  if (repo.issues > 10) return 'anglerfish'
  if (repo.stars > 40) return 'turtle'
  return 'barracuda'
}

export function OceanComposer({ repoData, className }: OceanComposerProps) {
  const updatablesRef = useRef<((time: number) => void)[]>([])
  const SWARM_TYPES: CreatureType[] = ['jellyfish', 'barracuda', 'dolphin']

  const handleSceneReady = useCallback(
    (scene: Scene) => {
      const floor = createOceanFloor(FLOOR_SIZE, FLOOR_Y)
      scene.add(floor)

      const whales: WhaleEntity[] = []

      repoData.forEach((repo, index) => {
        const color = WHALE_COLORS[index % WHALE_COLORS.length] as string
        const angle = (index / repoData.length) * Math.PI * 2 - Math.PI / 2
        const pos = new Vector3(
          Math.cos(angle) * ARRANGE_RADIUS,
          FLOOR_Y + 1,
          Math.sin(angle) * ARRANGE_RADIUS,
        )

        const height = Math.max(1.5, Math.min(repo.stars / 15, 6))
        const tower = createKelpTower({
          height,
          frondDensity: Math.min(repo.forks / 10, 1),
          color,
          position: pos,
        })
        scene.add(tower)

        const size = 0.5 + Math.min(repo.stars / 100, 0.8)
        const whale = createWhale({
          size,
          color,
          songDialect: DIALECTS[index % DIALECTS.length] as string,
          activityLevel: Math.min(repo.forks / 30, 1),
          health: Math.max(0, 1 - repo.issues / 50),
        })
        whale.position.copy(pos)
        scene.add(whale)
        whales.push(whale)

        // Attach creature swarm as child of whale so they move with it
        const creatureType = repoToCreatureType(repo)
        const creatureConfig: CreatureConfig = {
          type: creatureType,
          size: 0.3 + Math.random() * 0.2,
          color: CREATURE_COLORS[creatureType],
          count: Math.min(3 + Math.floor(repo.forks / 5), 8),
          orbitRadius: 1.2 + Math.random() * 0.5,
          orbitSpeed: 0.5 + Math.random() * 0.5,
          trophicLevel: Math.min(repo.stars / 100, 5),
          inclination: (Math.random() - 0.5) * 0.3,
          eccentricity: Math.random() * 0.2,
          orbitalGroup: Math.floor(Math.random() * 6),
        }

        if (creatureConfig.count >= 2 && SWARM_TYPES.includes(creatureType)) {
          const swarm = createInstancedSwarm(
            creatureType,
            creatureConfig.count,
            creatureConfig.size,
            creatureConfig.color,
          )
          const offsets = Array.from(
            { length: creatureConfig.count },
            (_, i) => (i / creatureConfig.count) * Math.PI * 2,
          )
          const r = creatureConfig.orbitRadius

          for (let i = 0; i < creatureConfig.count; i++) {
            const a = offsets[i]!
            swarm.updateInstance(
              i,
              new Vector3(
                Math.cos(a) * (r + (Math.random() - 0.5) * 0.5),
                Math.sin(0 + a) * 0.3,
                Math.sin(a) * (r + (Math.random() - 0.5) * 0.5),
              ),
              new Euler(0, -a + Math.PI / 2, 0),
              new Vector3(1, 1, 1),
            )
          }

          for (const mesh of swarm.meshes) {
            whale.add(mesh)
          }
        } else {
          const creatures = createCreature(creatureConfig)
          whale.add(creatures)
        }
      })

      updatablesRef.current.push((time: number) => {
        for (let i = 0; i < whales.length; i++) {
          const whale = whales[i]
          if (!whale) continue
          const repo = repoData[i]
          if (!repo) continue

          const h = Math.max(1.5, Math.min(repo.stars / 15, 6))
          const r = 1.5 + h * 0.15
          const s = 0.3 + i * 0.2
          whale.updatePosition(time, r, s)
        }
      })
    },
    [repoData],
  )

  useEffect(() => {
    return () => {
      updatablesRef.current = []
    }
  }, [])

  return (
    <OceanScene
      className={className}
      onSceneReady={handleSceneReady}
      updatables={updatablesRef}
    />
  )
}
