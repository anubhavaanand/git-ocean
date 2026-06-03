import { motion, AnimatePresence } from 'motion/react'
import { X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CreatureData {
  type: string
  name: string
  dataPoint: string
  value: number
  description: string
}

interface CreatureInfoPanelProps {
  creature: CreatureData | null
  onClose: () => void
}

const CREATURE_ICONS: Record<string, string> = {
  dolphin: '🐬',
  jellyfish: '🪼',
  turtle: '🐢',
  barracuda: '🐟',
  octopus: '🐙',
  'manta-ray': '🦈',
  seahorse: '🐠',
  crab: '🦀',
  anglerfish: '🐡',
  starfish: '⭐',
  whale: '🐋',
}

export function CreatureInfoPanel({ creature, onClose }: CreatureInfoPanelProps) {
  return (
    <AnimatePresence>
      {creature && (
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute bottom-20 right-4 z-30 w-72 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-white/50 hover:text-white/90 transition-colors"
          >
            <X className="size-4" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">
              {CREATURE_ICONS[creature.type] ?? '🐋'}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {creature.name}
              </h3>
              <span className="text-xs text-cyan-400 capitalize">
                {creature.type}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
              <span className="text-white/60">{creature.dataPoint}</span>
              <span className="font-mono font-bold text-cyan-400">
                {creature.value.toLocaleString()}
              </span>
            </div>

            <p className="text-xs text-white/50 leading-relaxed">
              {creature.description}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full gap-2 text-xs text-cyan-400 hover:text-cyan-300"
          >
            <ExternalLink className="size-3" />
            Learn more
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
