import { useRef, useEffect, useCallback } from 'react'
import type { WhaleOrbitConfig, CreatureOrbitConfig, WhaleOrbitResult, CreatureOrbitResult } from '@/client/workers/orbital-math.worker'

export interface OrbitalPositions {
  whales: Map<number, WhaleOrbitResult>
  creatures: Map<number, CreatureOrbitResult>
}

export function useOrbitalWorker() {
  const workerRef = useRef<Worker | null>(null)
  const positionsRef = useRef<OrbitalPositions>({
    whales: new Map(),
    creatures: new Map(),
  })

  useEffect(() => {
    const worker = new Worker(
      new URL('@/client/workers/orbital-math.worker.ts', import.meta.url),
      { type: 'module' },
    )

    worker.onmessage = (e) => {
      const msg = e.data
      if (msg.type === 'positions') {
        const whales = new Map<number, WhaleOrbitResult>(
          msg.whales.map((w: WhaleOrbitResult) => [w.id, w]),
        )
        const creatures = new Map<number, CreatureOrbitResult>(
          msg.creatures.map((c: CreatureOrbitResult) => [c.id, c]),
        )
        positionsRef.current = { whales, creatures }
      }
    }

    workerRef.current = worker

    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  const init = useCallback(
    (whales: WhaleOrbitConfig[], creatures: CreatureOrbitConfig[]) => {
      workerRef.current?.postMessage({ type: 'init', whales, creatures })
    },
    [],
  )

  const requestFrame = useCallback((time: number) => {
    workerRef.current?.postMessage({ type: 'frame', time })
  }, [])

  const stop = useCallback(() => {
    workerRef.current?.postMessage({ type: 'stop' })
  }, [])

  return { positionsRef, init, requestFrame, stop }
}
