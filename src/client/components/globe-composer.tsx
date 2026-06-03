import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { CountryData } from '@/client/hooks/use-world-map-data'
import {
  latLngToPosition,
  createPinMarker,
  createPinConnectionLine,
  createSonarObelisk,
  createLanguageRing,
  createOceanColony,
} from './globe-helpers'

interface GlobeComposerProps {
  scene: THREE.Scene | null
  camera: THREE.PerspectiveCamera | null
  renderer: THREE.WebGLRenderer | null
  countries: CountryData[]
}

const OCEAN_COLONY_POSITIONS = [
  { lat: 0, lng: -160 },
  { lat: -40, lng: -130 },
  { lat: 30, lng: -135 },
  { lat: -50, lng: 140 },
  { lat: 15, lng: -150 },
  { lat: -30, lng: -120 },
]

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
    const obeliskGroup = new THREE.Group()
    const languageGroup = new THREE.Group()
    const colonyGroup = new THREE.Group()

    for (let i = 0; i < countries.length; i++) {
      const country = countries[i]
      if (!country) continue

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

      if (i < 5) {
        const obeliskPos = latLngToPosition(country.lat, country.lng, globeRadius + 0.4)
        obeliskPos.add(globeCenter)
        const height = 0.8 + (1 - i / 5) * 0.8
        const obelisk = createSonarObelisk(obeliskPos, height, '#06B6D4')
        obeliskGroup.add(obelisk)
      }

      if (country.languageBreakdown && country.languageBreakdown.length > 0) {
        const ringCenter = latLngToPosition(country.lat, country.lng, globeRadius + 0.25)
        ringCenter.add(globeCenter)
        const ringRadius = 0.15 + (country.repoCount / 400) * 0.2
        const ring = createLanguageRing(ringCenter, country.languageBreakdown, ringRadius)
        languageGroup.add(ring)
      }
    }

    for (let i = 0; i < OCEAN_COLONY_POSITIONS.length; i++) {
      const pos = OCEAN_COLONY_POSITIONS[i]
      if (!pos) continue
      const colonyPos = latLngToPosition(pos.lat, pos.lng, globeRadius + 0.1)
      colonyPos.add(globeCenter)
      const colony = createOceanColony(colonyPos, i)
      colonyGroup.add(colony)
    }

    scene.add(pinGroup)
    scene.add(lineGroup)
    scene.add(obeliskGroup)
    scene.add(languageGroup)
    scene.add(colonyGroup)

    return () => {
      const groups = [pinGroup, lineGroup, obeliskGroup, languageGroup, colonyGroup]
      for (const g of groups) {
        scene.remove(g)
        g.traverse((obj) => {
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
    }
  }, [scene, countries])

  return null
}
