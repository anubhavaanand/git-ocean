import {
  PlaneGeometry,
  BufferAttribute,
  MeshStandardMaterial,
  Mesh,
  Vector3,
} from 'three'

export type ColonyTerrainType =
  | 'trench'
  | 'current'
  | 'ridge'
  | 'shelf'
  | 'abyss'
  | 'plateau'
  | 'cove'
  | 'expanse'

export interface ColonyPosition {
  type: ColonyTerrainType
  position: Vector3
  scale: number
}

const TERRAIN_COLORS: Record<ColonyTerrainType, [number, number, number]> = {
  trench: [0x0a / 255, 0x16 / 255, 0x28 / 255],
  current: [0x0d / 255, 0x28 / 255, 0x30 / 255],
  ridge: [0x1a / 255, 0x1a / 255, 0x2e / 255],
  shelf: [0x1a / 255, 0x28 / 255, 0x18 / 255],
  abyss: [0x05 / 255, 0x0b / 255, 0x18 / 255],
  plateau: [0x0f / 255, 0x1f / 255, 0x3a / 255],
  cove: [0x1a / 255, 0x28 / 255, 0x18 / 255],
  expanse: [0x0f / 255, 0x1f / 255, 0x2e / 255],
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

function blendColor(
  colors: Float32Array,
  i3: number,
  target: [number, number, number],
  strength: number,
): void {
  colors[i3] = lerp(colors[i3]!, target[0], strength)
  colors[i3 + 1] = lerp(colors[i3 + 1]!, target[1], strength)
  colors[i3 + 2] = lerp(colors[i3 + 2]!, target[2], strength)
}

function createTrenchTerrain(
  positions: Float32Array,
  colors: Float32Array,
  vertexCount: number,
  colony: ColonyPosition,
): void {
  const { position: pos, scale } = colony
  const halfW = scale * 0.75
  const halfL = scale * 1.5
  const depth = scale * 1.2

  for (let i = 0; i < vertexCount; i++) {
    const i3 = i * 3
    const dx = positions[i3]! - pos.x
    const dz = positions[i3 + 2]! - pos.z
    const ax = Math.abs(dx)
    const az = Math.abs(dz)

    if (ax < halfW && az < halfL) {
      const t = Math.max(ax / halfW, az / halfL)
      const falloff = 1 - smoothstep(0.6, 1, t)
      positions[i3 + 1]! -= falloff * falloff * depth
      blendColor(colors, i3, TERRAIN_COLORS.trench, falloff * 0.7)
    }
  }
}

function createCurrentZoneTerrain(
  positions: Float32Array,
  colors: Float32Array,
  vertexCount: number,
  colony: ColonyPosition,
): void {
  const { position: pos, scale } = colony
  const radius = scale * 2
  const amplitude = scale * 0.3
  const frequency = scale * 2.5

  for (let i = 0; i < vertexCount; i++) {
    const i3 = i * 3
    const dx = positions[i3]! - pos.x
    const dz = positions[i3 + 2]! - pos.z
    const dist = Math.sqrt(dx * dx + dz * dz)

    if (dist < radius) {
      const falloff = 1 - smoothstep(0, 1, dist / radius)
      const ripple = Math.sin(dx * frequency) * 0.5 + 0.5
      positions[i3 + 1]! += ripple * amplitude * falloff
      blendColor(colors, i3, TERRAIN_COLORS.current, falloff * 0.5)
    }
  }
}

function createRidgeTerrain(
  positions: Float32Array,
  colors: Float32Array,
  vertexCount: number,
  colony: ColonyPosition,
): void {
  const { position: pos, scale } = colony
  const halfL = scale * 2
  const halfW = scale * 0.3
  const height = scale * 1.5

  for (let i = 0; i < vertexCount; i++) {
    const i3 = i * 3
    const dx = positions[i3]! - pos.x
    const dz = positions[i3 + 2]! - pos.z
    const ax = Math.abs(dx)
    const az = Math.abs(dz)

    if (ax < halfW && az < halfL) {
      const along = 1 - az / halfL
      const across = 1 - ax / halfW
      const jagged = Math.sin(dz * 3 + dx * 2) * 0.3 + 0.7
      const spine = smoothstep(0, 1, across) * smoothstep(0, 1, along)
      positions[i3 + 1]! += spine * height * jagged
      blendColor(colors, i3, TERRAIN_COLORS.ridge, spine * 0.6)
    }
  }
}

function createShelfTerrain(
  positions: Float32Array,
  colors: Float32Array,
  vertexCount: number,
  colony: ColonyPosition,
): void {
  const { position: pos, scale } = colony
  const halfW = scale * 1.5
  const height = scale * 0.8
  const edgeWidth = scale * 0.15

  for (let i = 0; i < vertexCount; i++) {
    const i3 = i * 3
    const dx = positions[i3]! - pos.x
    const dz = positions[i3 + 2]! - pos.z
    const ax = Math.abs(dx)
    const az = Math.abs(dz)

    if (ax < halfW && az < halfW) {
      const t = Math.max(ax / halfW, az / halfW)
      const raise = 1 - smoothstep(1 - edgeWidth / halfW, 1, t)
      positions[i3 + 1]! += raise * height
      blendColor(colors, i3, TERRAIN_COLORS.shelf, raise * 0.6)
    }
  }
}

function createAbyssTerrain(
  positions: Float32Array,
  colors: Float32Array,
  vertexCount: number,
  colony: ColonyPosition,
): void {
  const { position: pos, scale } = colony
  const outerRadius = scale * 2
  const innerRadius = scale * 0.8
  const depth = scale * 1.5

  for (let i = 0; i < vertexCount; i++) {
    const i3 = i * 3
    const dx = positions[i3]! - pos.x
    const dz = positions[i3 + 2]! - pos.z
    const dist = Math.sqrt(dx * dx + dz * dz)

    if (dist < outerRadius) {
      if (dist < innerRadius) {
        const t = dist / innerRadius
        const sink = 1 - smoothstep(0, 1, t)
        positions[i3 + 1]! -= sink * depth
      } else {
        const t = (dist - innerRadius) / (outerRadius - innerRadius)
        const rim = 1 - smoothstep(0, 1, t)
        const rock = Math.sin(dx * 2.5) * Math.cos(dz * 2.5) * 0.3 + 0.7
        positions[i3 + 1]! += rim * depth * 0.4 * rock
      }
      const strength = 1 - dist / outerRadius
      blendColor(colors, i3, TERRAIN_COLORS.abyss, strength * 0.7)
    }
  }
}

function createPlateauTerrain(
  positions: Float32Array,
  colors: Float32Array,
  vertexCount: number,
  colony: ColonyPosition,
): void {
  const { position: pos, scale } = colony
  const halfW = scale * 1.5
  const height = scale * 1.2
  const edgeWidth = scale * 0.2

  for (let i = 0; i < vertexCount; i++) {
    const i3 = i * 3
    const dx = positions[i3]! - pos.x
    const dz = positions[i3 + 2]! - pos.z
    const ax = Math.abs(dx)
    const az = Math.abs(dz)
    const t = Math.max(ax, az)

    if (t < halfW) {
      const raise = 1 - smoothstep(halfW - edgeWidth, halfW, t)
      positions[i3 + 1]! += raise * height
      blendColor(colors, i3, TERRAIN_COLORS.plateau, raise * 0.5)
    }
  }
}

function createCoveTerrain(
  positions: Float32Array,
  colors: Float32Array,
  vertexCount: number,
  colony: ColonyPosition,
): void {
  const { position: pos, scale } = colony
  const radius = scale * 1.5
  const depth = scale * 0.3

  for (let i = 0; i < vertexCount; i++) {
    const i3 = i * 3
    const dx = positions[i3]! - pos.x
    const dz = positions[i3 + 2]! - pos.z
    const dist = Math.sqrt(dx * dx + dz * dz)

    if (dist < radius) {
      const t = dist / radius
      const sink = smoothstep(0, 1, t)
      positions[i3 + 1]! -= sink * depth
      blendColor(colors, i3, TERRAIN_COLORS.cove, sink * 0.5)
      colors[i3]! = lerp(colors[i3]!, 0.15, sink * 0.3)
    }
  }
}

function createExpanseTerrain(
  positions: Float32Array,
  colors: Float32Array,
  vertexCount: number,
  colony: ColonyPosition,
): void {
  const { position: pos, scale } = colony
  const radius = scale * 2
  const amplitude = scale * 0.3

  function hash(x: number, z: number): number {
    const h = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453
    return h - Math.floor(h)
  }

  for (let i = 0; i < vertexCount; i++) {
    const i3 = i * 3
    const vx = positions[i3]!
    const vz = positions[i3 + 2]!
    const dx = vx - pos.x
    const dz = vz - pos.z
    const dist = Math.sqrt(dx * dx + dz * dz)

    if (dist < radius) {
      const falloff = 1 - smoothstep(0, 1, dist / radius)
      positions[i3 + 1]! += hash(vx, vz) * amplitude * falloff
      blendColor(colors, i3, TERRAIN_COLORS.expanse, falloff * 0.4)
    }
  }
}

export function createOceanFloor(
  size: number,
  yPosition: number,
  colonies?: ColonyPosition[],
): Mesh {
  const geometry = new PlaneGeometry(size, size, 20, 20)
  geometry.rotateX(-Math.PI / 2)

  const positionAttribute = geometry.attributes['position'] as BufferAttribute
  const positions = positionAttribute.array as Float32Array
  const vertexCount = positionAttribute.count

  const colors = new Float32Array(vertexCount * 3)
  for (let i = 0; i < vertexCount; i++) {
    const i3 = i * 3
    colors[i3]! = 0.08 + Math.random() * 0.05
    colors[i3 + 1]! = 0.12 + Math.random() * 0.05
    colors[i3 + 2]! = 0.15 + Math.random() * 0.05
  }

  if (colonies) {
    for (const colony of colonies) {
      switch (colony.type) {
        case 'trench':
          createTrenchTerrain(positions, colors, vertexCount, colony)
          break
        case 'current':
          createCurrentZoneTerrain(positions, colors, vertexCount, colony)
          break
        case 'ridge':
          createRidgeTerrain(positions, colors, vertexCount, colony)
          break
        case 'shelf':
          createShelfTerrain(positions, colors, vertexCount, colony)
          break
        case 'abyss':
          createAbyssTerrain(positions, colors, vertexCount, colony)
          break
        case 'plateau':
          createPlateauTerrain(positions, colors, vertexCount, colony)
          break
        case 'cove':
          createCoveTerrain(positions, colors, vertexCount, colony)
          break
        case 'expanse':
          createExpanseTerrain(positions, colors, vertexCount, colony)
          break
      }
    }
    positionAttribute.needsUpdate = true
  }

  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  const material = new MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.9,
    metalness: 0,
  })

  const mesh = new Mesh(geometry, material)
  mesh.position.y = yPosition
  mesh.receiveShadow = true
  return mesh
}
