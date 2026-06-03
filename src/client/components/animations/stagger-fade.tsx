import { type ReactNode, Children } from 'react'
import { motion } from 'motion/react'

interface StaggerFadeProps {
  children: ReactNode
  delay?: number
  staggerDelay?: number
}

export function StaggerFade({
  children,
  delay = 0,
  staggerDelay = 0.08,
}: StaggerFadeProps) {
  const items = Children.toArray(children)

  return (
    <>
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: delay + i * staggerDelay,
            ease: 'easeOut',
          }}
        >
          {child}
        </motion.div>
      ))}
    </>
  )
}
