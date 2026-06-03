import { useEffect, useRef } from 'react'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  Vector3,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
  ShaderMaterial,
  Mesh,
  Points,
  Clock,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  createUnderwaterFog,
  createWaterSurface,
  createAmbientParticles,
  createCoralCluster,
} from './ocean-helpers'
import { setupOceanLighting } from './ocean-lighting'
import { createRenderer } from '@/client/lib/createRenderer'
import type { RendererVariant } from '@/client/lib/createRenderer'

interface OceanSceneProps {
  className?: string
  onSceneReady?: (
    scene: Scene,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer,
  ) => void
  onRendererVariant?: (variant: RendererVariant) => void
  updatables?: { current: ((time: number) => void)[] }
}

const CORAL_POSITIONS = [
  new Vector3(-5, -15, -4),
  new Vector3(4, -17, 3),
  new Vector3(-3, -18, -6),
  new Vector3(6, -16, -2),
  new Vector3(-6, -14, 5),
]

const CORAL_COLORS = [
  new Color('#ff6b6b'),
  new Color('#ffa07a'),
  new Color('#e056fd'),
  new Color('#7ed6df'),
  new Color('#ff9ff3'),
]

export function OceanScene({ className, onSceneReady, onRendererVariant, updatables }: OceanSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onSceneReadyRef = useRef(onSceneReady)
  onSceneReadyRef.current = onSceneReady
  const onRendererVariantRef = useRef(onRendererVariant)
  onRendererVariantRef.current = onRendererVariant
  const updatablesRef = useRef(updatables)
  updatablesRef.current = updatables

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    ;(async () => {
      const w = container.clientWidth
      const h = container.clientHeight

      const scene = new Scene()
      scene.background = new Color('#0a1628')

      const camera = new PerspectiveCamera(60, w / h, 0.1, 100)
      camera.position.set(0, -8, 12)

      const { renderer, variant } = await createRenderer()
      onRendererVariantRef.current?.(variant)
      renderer.setSize(w, h)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = PCFSoftShadowMap
      if ('toneMapping' in renderer) {
        ;(renderer as WebGLRenderer).toneMapping = ACESFilmicToneMapping
        ;(renderer as WebGLRenderer).toneMappingExposure = 1.0
      }
      container.appendChild(renderer.domElement)

    createUnderwaterFog(scene, new Color('#0a1628'), 0.035)
    setupOceanLighting(scene)

    const water = createWaterSurface(12, 64)
    scene.add(water)

    const particles = createAmbientParticles(scene, 800)

    for (let i = 0; i < CORAL_POSITIONS.length; i++) {
      const pos = CORAL_POSITIONS[i]
      const color = CORAL_COLORS[i % CORAL_COLORS.length]
      if (!pos || !color) continue
      const coral = createCoralCluster(pos, color, 0.5 + Math.random() * 0.6)
      scene.add(coral)
    }

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minPolarAngle = 0.1
    controls.maxPolarAngle = Math.PI / 2.1
    controls.minDistance = 3
    controls.maxDistance = 30
    controls.target.set(0, -5, 0)
    controls.update()

    if (onSceneReadyRef.current) {
      onSceneReadyRef.current(scene, camera, renderer)
    }

    const clock = new Clock()
    let animationId: number

    const animate = () => {
      const elapsed = clock.getElapsedTime()

      if (water.material instanceof ShaderMaterial) {
        const timeUniform = water.material.uniforms['uTime']
        if (timeUniform) timeUniform.value = elapsed
      }

      if (particles.material instanceof ShaderMaterial) {
        const timeUniform = particles.material.uniforms['uTime']
        if (timeUniform) timeUniform.value = elapsed
      }

      const extUpdatables = updatablesRef.current
      if (extUpdatables?.current) {
        for (const fn of extUpdatables.current) {
          fn(elapsed)
        }
      }

      controls.update()
      renderer.render(scene, camera)
    }

    const rAny = renderer as unknown as { setAnimationLoop?: (fn: ((() => void) | null)) => void }
    if (typeof rAny.setAnimationLoop === 'function') {
      rAny.setAnimationLoop(animate)
    } else {
      const loop = () => {
        animate()
        animationId = requestAnimationFrame(loop)
      }
      loop()
    }

    const handleResize = () => {
      const w2 = container.clientWidth
      const h2 = container.clientHeight
      camera.aspect = w2 / h2
      camera.updateProjectionMatrix()
      renderer.setSize(w2, h2)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      const rAnyCleanup = renderer as unknown as { setAnimationLoop?: (fn: ((() => void) | null)) => void }
      if (typeof rAnyCleanup.setAnimationLoop === 'function') {
        rAnyCleanup.setAnimationLoop(null)
      } else {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener('resize', handleResize)
      controls.dispose()
      renderer.dispose()
      scene.traverse((obj) => {
        if (obj instanceof Mesh || obj instanceof Points) {
          obj.geometry.dispose()
          const materials = Array.isArray(obj.material)
            ? obj.material
            : [obj.material]
          for (const mat of materials) {
            mat.dispose()
          }
        }
      })
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
    })()
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
    />
  )
}
