import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { CountryData } from '@/client/hooks/use-world-map-data'
import {
  latLngToPosition,
  createPinMarker,
  createPinConnectionLine,
} from './globe-helpers'

interface GlobeComposerProps {
  scene: THREE.Scene | null
  camera: THREE.PerspectiveCamera | null
  renderer: THREE.WebGLRenderer | null
  countries: CountryData[]
}

export function GlobeComposer({
  scene,
  countries,
}: GlobeComposerProps) {
  const pinsInitialized = useRef(false)

  useEffect(() => {
    if (pinsInitialized.current || !scene) return
    pinsInitialized.current = true

    const globeRadius = 3
    const globeCenter = new THREE.Vector3(0, -0.5, 0)
    const pinGroup = new THREE.Group()
    const lineGroup = new THREE.Group()

    for (const country of countries) {
      const surfacePos = latLngToPosition(country.lat, country.lng, globeRadius)
      surfacePos.add(globeCenter)

      const markerPos = latLngToPosition(country.lat, country.lng, globeRadius + 0.15)
      markerPos.add(globeCenter)

      const size = 0.06 + (country.repoCount / 400) * 0.1
      const marker = createPinMarker(markerPos, '#06B6D4', size)
      pinGroup.add(marker)

      const line = createPinConnectionLine(markerPos, surfacePos, '#06B6D4')
      lineGroup.add(line)

      const glowPos = latLngToPosition(country.lat, country.lng, globeRadius + 0.3)
      glowPos.add(globeCenter)
      const glow = createPinMarker(glowPos, '#0EA5E9', size * 1.5)
      const glowGroup = new THREE.Group()
      glowGroup.add(glow)
      pinGroup.add(glowGroup)
    }

    scene.add(pinGroup)
    scene.add(lineGroup)

    return () => {
      scene.remove(pinGroup)
      scene.remove(lineGroup)
      pinGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Sprite) {
          obj.geometry?.dispose()
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach(m => m.dispose())
            } else {
              obj.material.dispose()
            }
          }
        }
      })
    }
  }, [scene, countries])

  return null
}
