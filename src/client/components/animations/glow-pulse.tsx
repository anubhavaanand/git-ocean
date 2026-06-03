import { type ReactNode } from 'react'
import { motion } from 'motion/react'

interface GlowPulseProps {
  children: ReactNode
  color?: string
}

export function GlowPulse({ children, color = '#06B6D4' }: GlowPulseProps) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 4px ${color}40, 0 0 8px ${color}20`,
          `0 0 8px ${color}60, 0 0 16px ${color}40`,
          `0 0 4px ${color}40, 0 0 8px ${color}20`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="rounded-lg"
    >
      {children}
    </motion.div>
  )
}
