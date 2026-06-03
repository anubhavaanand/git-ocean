import * as THREE from 'three'

export interface GlobeConfig {
  radius?: number
  gridColor?: string
  oceanColor?: string
  glowColor?: string
  segments?: number
}

export function createGlobe(config: GlobeConfig = {}) {
  const {
    radius = 3,
    gridColor = '#06B6D4',
    oceanColor = '#0a1628',
    segments = 64,
  } = config

  const group = new THREE.Group()

  const geo = new THREE.SphereGeometry(radius, segments, segments)
  const mat = new THREE.MeshBasicMaterial({
    color: oceanColor,
    wireframe: false,
  })
  const sphere = new THREE.Mesh(geo, mat)
  group.add(sphere)

  const gridGeo = new THREE.SphereGeometry(radius * 1.001, segments, segments)
  const gridMat = new THREE.MeshBasicMaterial({
    color: gridColor,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  })
  const grid = new THREE.Mesh(gridGeo, gridMat)
  group.add(grid)

  const latLines = new THREE.BufferGeometry()
  const latPositions: number[] = []
  const latSteps = 12
  for (let i = 1; i < latSteps; i++) {
    const phi = (i / latSteps) * Math.PI
    const pts: THREE.Vector3[] = []
    const ringSteps = 48
    for (let j = 0; j <= ringSteps; j++) {
      const theta = (j / ringSteps) * Math.PI * 2
      const x = radius * 1.002 * Math.sin(phi) * Math.cos(theta)
      const y = radius * 1.002 * Math.cos(phi)
      const z = radius * 1.002 * Math.sin(phi) * Math.sin(theta)
      pts.push(new THREE.Vector3(x, y, z))
    }
    for (let j = 0; j < pts.length - 1; j++) {
      const p = pts[j]; const q = pts[j + 1]
      if (!p || !q) continue
      latPositions.push(p.x, p.y, p.z, q.x, q.y, q.z)
    }
  }
  latLines.setAttribute('position', new THREE.Float32BufferAttribute(latPositions, 3))
  const latLineMat = new THREE.LineBasicMaterial({
    color: gridColor,
    transparent: true,
    opacity: 0.08,
  })
  const latLine = new THREE.LineSegments(latLines, latLineMat)
  group.add(latLine)

  const lonPositions: number[] = []
  const lonSteps = 16
  for (let i = 0; i < lonSteps; i++) {
    const theta = (i / lonSteps) * Math.PI * 2
    const pts: THREE.Vector3[] = []
    const ringSteps = 32
    for (let j = 0; j <= ringSteps; j++) {
      const phi = (j / ringSteps) * Math.PI
      const x = radius * 1.002 * Math.sin(phi) * Math.cos(theta)
      const y = radius * 1.002 * Math.cos(phi)
      const z = radius * 1.002 * Math.sin(phi) * Math.sin(theta)
      pts.push(new THREE.Vector3(x, y, z))
    }
    for (let j = 0; j < pts.length - 1; j++) {
      const p = pts[j]; const q = pts[j + 1]
      if (!p || !q) continue
      lonPositions.push(p.x, p.y, p.z, q.x, q.y, q.z)
    }
  }
  const lonLines = new THREE.BufferGeometry()
  lonLines.setAttribute('position', new THREE.Float32BufferAttribute(lonPositions, 3))
  const lonLineMat = new THREE.LineBasicMaterial({
    color: gridColor,
    transparent: true,
    opacity: 0.08,
  })
  const lonLine = new THREE.LineSegments(lonLines, lonLineMat)
  group.add(lonLine)

  return group
}

export function createAtmosphere(radius: number, glowColor: string = '#06B6D4') {
  const geo = new THREE.SphereGeometry(radius * 1.08, 48, 48)

  const mat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vPosition = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float time;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
        float intensity = pow(rim, 3.0);
        float pulse = 0.85 + 0.15 * sin(time * 0.5);
        gl_FragColor = vec4(glowColor * intensity * pulse, intensity * 0.6);
      }
    `,
    uniforms: {
      glowColor: { value: new THREE.Color(glowColor) },
      time: { value: 0 },
    },
    transparent: true,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const mesh = new THREE.Mesh(geo, mat)
  return mesh
}

export function createCloudLayer(radius: number) {
  const group = new THREE.Group()
  const cloudCount = 60
  const cloudMat = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.06,
    depthWrite: false,
  })

  for (let i = 0; i < cloudCount; i++) {
    const size = 0.15 + Math.random() * 0.4
    const geo = new THREE.SphereGeometry(size, 6, 6)
    const mesh = new THREE.Mesh(geo, cloudMat)

    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * (1.04 + Math.random() * 0.03)
    mesh.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
    )
    mesh.scale.set(1, 0.4, 1)
    group.add(mesh)
  }

  return group
}

export function latLngToPosition(
  lat: number,
  lng: number,
  radius: number,
  heightOffset: number = 0.05,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const r = radius + heightOffset
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

export function createPinMarker(
  position: THREE.Vector3,
  color: string = '#06B6D4',
  size: number = 0.08,
) {
  const group = new THREE.Group()

  const spriteMap = new THREE.CanvasTexture(generatePinCanvas(color))
  const spriteMat = new THREE.SpriteMaterial({
    map: spriteMap,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  })
  const sprite = new THREE.Sprite(spriteMat)
  sprite.scale.set(size * 3, size * 3, 1)
  sprite.position.copy(position)
  group.add(sprite)

  return group
}

function generatePinCanvas(color: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const center = 32

  const gradient = ctx.createRadialGradient(center, center, 0, center, center, 32)
  gradient.addColorStop(0, color)
  gradient.addColorStop(0.3, color + 'aa')
  gradient.addColorStop(1, 'transparent')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  return canvas
}

export function createPinConnectionLine(
  from: THREE.Vector3,
  to: THREE.Vector3,
  color: string = '#06B6D4',
) {
  const points = [from.clone(), to.clone()]
  const geo = new THREE.BufferGeometry().setFromPoints(points)
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.2,
  })
  return new THREE.Line(geo, mat)
}

export function createCountryOutline(
  positions: THREE.Vector3[],
  color: string = '#06B6D4',
) {
  const geo = new THREE.BufferGeometry().setFromPoints(positions)
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.15,
  })
  return new THREE.Line(geo, mat)
}

export function createSonarObelisk(
  position: THREE.Vector3,
  height: number = 1.2,
  color: string = '#06B6D4',
) {
  const group = new THREE.Group()
  group.position.copy(position)

  const pillarGeo = new THREE.CylinderGeometry(0.04, 0.08, height, 6)
  const pillarMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.7,
  })
  const pillar = new THREE.Mesh(pillarGeo, pillarMat)
  pillar.position.y = height / 2
  group.add(pillar)

  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.TorusGeometry(0.08 + i * 0.06, 0.01, 6, 12)
    const ringMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.4 - i * 0.1,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.y = height * (0.3 + i * 0.25)
    ring.rotation.x = Math.PI / 2
    group.add(ring)
  }

  const tipGeo = new THREE.SphereGeometry(0.06, 8, 8)
  const tipMat = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.9,
  })
  const tip = new THREE.Mesh(tipGeo, tipMat)
  tip.position.y = height
  group.add(tip)

  const glowCanvas = document.createElement('canvas')
  glowCanvas.width = 64
  glowCanvas.height = 64
  const ctx = glowCanvas.getContext('2d')!
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, '#ffffff')
  grad.addColorStop(0.2, color)
  grad.addColorStop(1, 'transparent')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)

  const glowMap = new THREE.CanvasTexture(glowCanvas)
  const glowMat = new THREE.SpriteMaterial({
    map: glowMap,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  })
  const glow = new THREE.Sprite(glowMat)
  glow.scale.set(0.8, 0.8, 1)
  glow.position.y = height * 0.5
  group.add(glow)

  return group
}

export function createLanguageRing(
  center: THREE.Vector3,
  languages: { name: string; percentage: number }[],
  radius: number = 0.4,
) {
  const group = new THREE.Group()
  group.position.copy(center)

  const languageColors: Record<string, string> = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3776ab',
    Java: '#b07219',
    Go: '#00add8',
    Rust: '#dea584',
    'C++': '#00599c',
    'C#': '#178600',
    Ruby: '#cc342d',
    PHP: '#777bb4',
    Kotlin: '#a97bff',
    Scala: '#dc322f',
    Swift: '#ffac45',
    Dart: '#00b4ab',
    Lua: '#000080',
  }

  let startAngle = 0
  for (const lang of languages) {
    if (lang.percentage <= 0) continue
    const arcAngle = (lang.percentage / 100) * Math.PI * 2
    const color = languageColors[lang.name] ?? '#06B6D4'

    const segments = Math.max(8, Math.floor(arcAngle * 20))
    const positions: number[] = []
    for (let i = 0; i <= segments; i++) {
      const a = startAngle + (i / segments) * arcAngle
      const x = radius * Math.cos(a)
      const z = radius * Math.sin(a)
      positions.push(x, 0, z)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.6,
    })
    const arc = new THREE.Line(geo, mat)
    group.add(arc)

    startAngle += arcAngle
  }

  return group
}

export function createOceanColony(
  position: THREE.Vector3,
  _colonyId: number = 0,
) {
  const group = new THREE.Group()
  group.position.copy(position)

  const count = 3 + Math.floor(Math.random() * 5)
  for (let i = 0; i < count; i++) {
    const size = 0.02 + Math.random() * 0.04
    const geo = new THREE.SphereGeometry(size, 6, 6)
    const mat = new THREE.MeshBasicMaterial({
      color: '#0EA5E9',
      transparent: true,
      opacity: 0.3 + Math.random() * 0.4,
    })
    const dot = new THREE.Mesh(geo, mat)
    dot.position.set(
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.3,
    )
    group.add(dot)
  }

  const colonyCanvas = document.createElement('canvas')
  colonyCanvas.width = 32
  colonyCanvas.height = 32
  const ctx = colonyCanvas.getContext('2d')!
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  grad.addColorStop(0, '#0EA5E9')
  grad.addColorStop(0.5, '#06B6D4')
  grad.addColorStop(1, 'transparent')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 32, 32)

  const glowMap = new THREE.CanvasTexture(colonyCanvas)
  const glowMat = new THREE.SpriteMaterial({
    map: glowMap,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  })
  const glow = new THREE.Sprite(glowMat)
  glow.scale.set(0.3, 0.3, 1)
  group.add(glow)

  return group
}

export type ZoomLevel = 'world' | 'continent' | 'country' | 'city' | 'detail'

export interface ZoomConfig {
  level: ZoomLevel
  distance: number
  label: string
}

export const ZOOM_LEVELS: ZoomConfig[] = [
  { level: 'world', distance: 10, label: 'World View' },
  { level: 'continent', distance: 7, label: 'Continent View' },
  { level: 'country', distance: 4.5, label: 'Country View' },
  { level: 'city', distance: 3, label: 'City View' },
  { level: 'detail', distance: 2, label: 'Detail View' },
]

export function getZoomLevel(distance: number): ZoomLevel {
  if (distance > 8.5) return 'world'
  if (distance > 5.75) return 'continent'
  if (distance > 3.75) return 'country'
  if (distance > 2.5) return 'city'
  return 'detail'
}

export function clampToZoomLevel(distance: number): number {
  const levels = ZOOM_LEVELS.map((z) => z.distance)
  return levels.reduce((prev, curr) =>
    Math.abs(curr - distance) < Math.abs(prev - distance) ? curr : prev,
  )
}

export interface SkinPreviewConfig {
  color: string
  height: number
  rings: number
  glowColor: string
  tipColor: string
  pattern: string
}

export function createSkinPreviewObelisk(skinConfig: SkinPreviewConfig) {
  const group = new THREE.Group()

  const pillarGeo = new THREE.CylinderGeometry(0.04, 0.08, skinConfig.height, 6)
  const pillarMat = new THREE.MeshBasicMaterial({
    color: skinConfig.color,
    transparent: true,
    opacity: 0.7,
  })
  const pillar = new THREE.Mesh(pillarGeo, pillarMat)
  pillar.position.y = skinConfig.height / 2
  group.add(pillar)

  const ringCount = Math.min(skinConfig.rings, 6)
  for (let i = 0; i < ringCount; i++) {
    const ringGeo = new THREE.TorusGeometry(0.08 + i * 0.06, 0.01, 6, 12)
    const ringMat = new THREE.MeshBasicMaterial({
      color: skinConfig.color,
      transparent: true,
      opacity: 0.4 - i * 0.1,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.y = skinConfig.height * (0.3 + (i / Math.max(ringCount - 1, 1)) * 0.5)
    ring.rotation.x = Math.PI / 2
    group.add(ring)
  }

  const tipGeo = new THREE.SphereGeometry(0.06, 8, 8)
  const tipMat = new THREE.MeshBasicMaterial({
    color: skinConfig.tipColor,
    transparent: true,
    opacity: 0.9,
  })
  const tip = new THREE.Mesh(tipGeo, tipMat)
  tip.position.y = skinConfig.height
  group.add(tip)

  const glowCanvas = document.createElement('canvas')
  glowCanvas.width = 64
  glowCanvas.height = 64
  const ctx = glowCanvas.getContext('2d')!
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, skinConfig.tipColor)
  grad.addColorStop(0.2, skinConfig.glowColor)
  grad.addColorStop(1, 'transparent')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)

  const glowMap = new THREE.CanvasTexture(glowCanvas)
  const glowMat = new THREE.SpriteMaterial({
    map: glowMap,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  })
  const glow = new THREE.Sprite(glowMat)
  glow.scale.set(0.8, 0.8, 1)
  glow.position.y = skinConfig.height * 0.5
  group.add(glow)

  return group
}
