import { useEffect, useState } from 'react'
import { GitBranch, Fish, Ship, Star, Waves } from 'lucide-react'
import { motion } from 'motion/react'

interface OceanStats {
  reposConnected: number
  creaturesSpawned: number
  whaleLevel: number
  totalStars: number
  oceanDepth: number
}

interface StatsPanelProps {
  stats: OceanStats
}

const STATS_CONFIG = [
  { key: 'reposConnected', label: 'Repos', icon: GitBranch, color: 'text-cyan-400' },
  { key: 'creaturesSpawned', label: 'Creatures', icon: Fish, color: 'text-purple-400' },
  { key: 'whaleLevel', label: 'Whale Level', icon: Ship, color: 'text-emerald-400' },
  { key: 'totalStars', label: 'Stars', icon: Star, color: 'text-amber-400' },
  { key: 'oceanDepth', label: 'Depth', icon: Waves, color: 'text-blue-400', suffix: 'm' },
] as const

function AnimatedCounter({ value, duration = 1.2 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = value / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [value, duration])

  return <>{display.toLocaleString()}</>
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="absolute bottom-4 left-4 z-30 flex gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-2xl"
    >
      {STATS_CONFIG.map((stat) => {
        const Icon = stat.icon
        const value = stats[stat.key as keyof OceanStats]
        return (
          <div key={stat.key} className="flex items-center gap-2 text-sm">
            <Icon className={`size-3.5 ${stat.color}`} />
            <span className="text-white/50 text-xs">{stat.label}</span>
            <span className="font-mono text-xs font-bold text-white tabular-nums">
              <AnimatedCounter value={value} />
              {'suffix' in stat ? (stat as typeof STATS_CONFIG[number] & { suffix: string }).suffix : ''}
            </span>
          </div>
        )
      })}
    </motion.div>
  )
}
