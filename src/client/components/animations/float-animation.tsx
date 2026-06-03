import { type ReactNode } from 'react'
import { motion } from 'motion/react'

interface FloatAnimationProps {
  children: ReactNode
  amplitude?: number
  duration?: number
}

export function FloatAnimation({
  children,
  amplitude = 5,
  duration = 3,
}: FloatAnimationProps) {
  return (
    <motion.div
      animate={{ y: [-amplitude, amplitude, -amplitude] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}
