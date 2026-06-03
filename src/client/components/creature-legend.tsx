import { motion, AnimatePresence } from 'motion/react'
import { Fish, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CreatureLegendProps {
  visible: boolean
  onToggle: () => void
}

const LEGEND_ITEMS = [
  { type: 'dolphin', icon: '🐬', name: 'Dolphin', mapsTo: 'High-star repos (>80)' },
  { type: 'jellyfish', icon: '🪼', name: 'Jellyfish', mapsTo: 'Heavily forked repos' },
  { type: 'turtle', icon: '🐢', name: 'Turtle', mapsTo: 'Moderate-star repos (>40)' },
  { type: 'barracuda', icon: '🐟', name: 'Barracuda', mapsTo: 'Active repos' },
  { type: 'anglerfish', icon: '🐡', name: 'Anglerfish', mapsTo: 'High-issue repos' },
  { type: 'octopus', icon: '🐙', name: 'Octopus', mapsTo: 'Multi-language repos' },
  { type: 'seahorse', icon: '🐠', name: 'Seahorse', mapsTo: 'Small repos' },
  { type: 'crab', icon: '🦀', name: 'Crab', mapsTo: 'Old repos' },
  { type: 'starfish', icon: '⭐', name: 'Starfish', mapsTo: 'New repos' },
  { type: 'manta-ray', icon: '🦈', name: 'Manta Ray', mapsTo: 'Large repos' },
] as const

export function CreatureLegend({ visible, onToggle }: CreatureLegendProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="flex items-center gap-2 text-xs text-white/60 hover:text-white"
      >
        <Fish className="size-3.5 text-cyan-400" />
        Creature Legend
      </Button>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-14 right-4 z-30 w-72 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-white/80">Creature Legend</h3>
              <button
                onClick={onToggle}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {LEGEND_ITEMS.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-2"
                >
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-white/80">{item.name}</p>
                    <p className="text-[10px] text-white/40 leading-tight">{item.mapsTo}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
