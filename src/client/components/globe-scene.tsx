import { useEffect, useRef } from 'react'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  ACESFilmicToneMapping,
  AmbientLight,
  DirectionalLight,
  Group,
  Mesh,
  Points,
  ShaderMaterial,
  Clock,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createGlobe, createAtmosphere, createCloudLayer, getZoomLevel } from './globe-helpers'

export type { ZoomLevel } from './globe-helpers'

interface GlobeSceneProps {
  className?: string
  onSceneReady?: (
    scene: Scene,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer,
  ) => void
  updatables?: { current: ((time: number) => void)[] }
  onZoomChange?: (level: string, distance: number) => void
}

export function GlobeScene({ className, onSceneReady, updatables, onZoomChange }: GlobeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onSceneReadyRef = useRef(onSceneReady)
  onSceneReadyRef.current = onSceneReady
  const updatablesRef = useRef(updatables)
  updatablesRef.current = updatables
  const globeGroupRef = useRef<Group | null>(null)
  const atmosphereRef = useRef<Mesh | null>(null)
  const cloudRef = useRef<Group | null>(null)
  const onZoomChangeRef = useRef(onZoomChange)
  onZoomChangeRef.current = onZoomChange

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const w = container.clientWidth
    const h = container.clientHeight

    const scene = new Scene()
    scene.background = new Color('#050b18')

    const camera = new PerspectiveCamera(45, w / h, 0.1, 100)
    camera.position.set(0, 1.5, 7)

    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    container.appendChild(renderer.domElement)

    const globe = createGlobe({ radius: 3 })
    globe.position.y = -0.5
    scene.add(globe)
    globeGroupRef.current = globe

    const atmosphere = createAtmosphere(3, '#06B6D4')
    atmosphere.position.y = -0.5
    scene.add(atmosphere)
    atmosphereRef.current = atmosphere

    const clouds = createCloudLayer(3)
    clouds.position.y = -0.5
    scene.add(clouds)
    cloudRef.current = clouds

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 4
    controls.maxDistance = 15
    controls.minPolarAngle = 0.1
    controls.maxPolarAngle = Math.PI / 1.8
    controls.target.set(0, -0.5, 0)
    controls.update()

    let lastZoomLevel = getZoomLevel(controls.object.position.distanceTo(controls.target))
    onZoomChangeRef.current?.(lastZoomLevel, controls.object.position.distanceTo(controls.target))

    const ambientLight = new AmbientLight(0x1a2a4a, 0.5)
    scene.add(ambientLight)

    const sunLight = new DirectionalLight(0x4a9eff, 2.0)
    sunLight.position.set(10, 10, 5)
    scene.add(sunLight)

    const rimLight = new DirectionalLight(0x06b6d4, 0.8)
    rimLight.position.set(-5, -5, -10)
    scene.add(rimLight)

    if (onSceneReadyRef.current) {
      onSceneReadyRef.current(scene, camera, renderer)
    }

    const clock = new Clock()
    let animationId: number

    const animate = () => {
      const elapsed = clock.getElapsedTime()

      globe.rotation.y = elapsed * 0.05
      clouds.rotation.y = elapsed * 0.07

      if (atmosphere.material instanceof ShaderMaterial) {
        const timeUniform = atmosphere.material.uniforms['time']
        if (timeUniform) timeUniform.value = elapsed
      }

      const angle = elapsed * 0.02
      sunLight.position.set(
        Math.cos(angle) * 15,
        Math.sin(angle * 0.3) * 5 + 5,
        Math.sin(angle) * 15,
      )

      const extUpdatables = updatablesRef.current
      if (extUpdatables?.current) {
        for (const fn of extUpdatables.current) {
          fn(elapsed)
        }
      }

      controls.update()

      const dist = controls.object.position.distanceTo(controls.target)
      const currentZoom = getZoomLevel(dist)
      if (currentZoom !== lastZoomLevel) {
        lastZoomLevel = currentZoom
        onZoomChangeRef.current?.(currentZoom, dist)
      }

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      const w2 = container.clientWidth
      const h2 = container.clientHeight
      camera.aspect = w2 / h2
      camera.updateProjectionMatrix()
      renderer.setSize(w2, h2)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
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
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
    />
  )
}
