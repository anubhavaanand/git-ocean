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
