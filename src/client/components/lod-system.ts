import * as THREE from 'three'

export const LOD_DISTANCES = {
  high: 10,
  medium: 25,
  low: 50,
}

function createReducedGeometry(
  geometry: THREE.BufferGeometry,
  segments: number,
): THREE.BufferGeometry {
  const name = geometry.type
  const params = (geometry as any).parameters

  if (!params || name === 'BufferGeometry') {
    const box = new THREE.Box3().setFromObject(new THREE.Mesh(geometry))
    const size = box.getSize(new THREE.Vector3())
    const r = Math.max(size.x, size.y, size.z) / 2
    return new THREE.SphereGeometry(r || 0.5, segments, Math.floor(segments / 2))
  }

  switch (name) {
    case 'SphereGeometry':
      return new THREE.SphereGeometry(
        params.radius ?? 1,
        segments,
        Math.floor(segments / 2),
      )
    case 'CylinderGeometry':
      return new THREE.CylinderGeometry(
        params.radiusTop ?? 1,
        params.radiusBottom ?? 1,
        params.height ?? 1,
        segments,
        Math.floor(segments / 4),
      )
    case 'ConeGeometry':
      return new THREE.ConeGeometry(params.radius ?? 1, params.height ?? 1, segments)
    case 'CircleGeometry':
      return new THREE.CircleGeometry(params.radius ?? 1, segments)
    case 'PlaneGeometry':
      return new THREE.PlaneGeometry(
        params.width ?? 1,
        params.height ?? 1,
        Math.floor(segments / 4),
        Math.floor(segments / 4),
      )
    case 'TorusGeometry':
      return new THREE.TorusGeometry(
        params.radius ?? 1,
        params.tube ?? 0.4,
        Math.floor(segments / 2),
        segments,
      )
    default:
      return geometry.clone()
  }
}

function createBillboardSprite(color: THREE.Color): THREE.Sprite {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const hex = color.getHexString()
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, `#${hex}`)
  gradient.addColorStop(0.5, `#${hex}88`)
  gradient.addColorStop(1, 'transparent')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.SpriteMaterial({
    map: texture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(1, 1, 1)
  return sprite
}

export function createLODGroup(
  baseGeometry: THREE.BufferGeometry,
  detailLevels: {
    high?: { segments?: number; material?: THREE.Material }
    medium?: { segments?: number; material?: THREE.Material }
    low?: { segments?: number; material?: THREE.Material }
  } = {},
): THREE.LOD {
  const lod = new THREE.LOD()

  const params = (baseGeometry as any).parameters ?? {}
  const baseSegs = Math.max(
    (params as any).widthSegments ?? (params as any).radialSegments ?? 64,
  )
  const highSegs = detailLevels.high?.segments ?? baseSegs
  const mediumSegs = detailLevels.medium?.segments ?? Math.max(8, Math.floor(highSegs / 2))
  const lowSegs = detailLevels.low?.segments ?? Math.max(4, Math.floor(highSegs / 4))

  const highMat =
    detailLevels.high?.material ?? new THREE.MeshStandardMaterial({ color: 0x888888 })
  const highGeo = createReducedGeometry(baseGeometry, highSegs)
  const highMesh = new THREE.Mesh(highGeo, highMat)
  lod.addLevel(highMesh, 0)

  const mediumMat =
    detailLevels.medium?.material ?? new THREE.MeshBasicMaterial({ color: 0x888888 })
  const mediumGeo = createReducedGeometry(baseGeometry, mediumSegs)
  const mediumMesh = new THREE.Mesh(mediumGeo, mediumMat)
  lod.addLevel(mediumMesh, LOD_DISTANCES.high)

  const lowMat =
    detailLevels.low?.material ?? new THREE.MeshBasicMaterial({ color: 0x666666 })
  const lowGeo = createReducedGeometry(baseGeometry, lowSegs)
  const lowMesh = new THREE.Mesh(lowGeo, lowMat)
  lod.addLevel(lowMesh, LOD_DISTANCES.medium)

  return lod
}

export function wrapMeshWithLOD(mesh: THREE.Mesh): THREE.LOD {
  const lod = new THREE.LOD()

  const parent = mesh.parent
  const position = mesh.position.clone()
  const quaternion = mesh.quaternion.clone()
  const scale = mesh.scale.clone()

  mesh.position.set(0, 0, 0)
  mesh.quaternion.identity()
  mesh.scale.set(1, 1, 1)
  lod.addLevel(mesh, 0)

  let color = new THREE.Color(0x888888)
  if (
    mesh.material instanceof THREE.MeshStandardMaterial ||
    mesh.material instanceof THREE.MeshBasicMaterial
  ) {
    color = mesh.material.color.clone()
  }

  const mediumGeo = createReducedGeometry(mesh.geometry, 32)
  const mediumMat = new THREE.MeshBasicMaterial({ color })
  const mediumMesh = new THREE.Mesh(mediumGeo, mediumMat)
  lod.addLevel(mediumMesh, LOD_DISTANCES.high)

  const lowGeo = createReducedGeometry(mesh.geometry, 16)
  const lowMat = new THREE.MeshBasicMaterial({ color })
  const lowMesh = new THREE.Mesh(lowGeo, lowMat)
  lod.addLevel(lowMesh, LOD_DISTANCES.medium)

  lod.position.copy(position)
  lod.quaternion.copy(quaternion)
  lod.scale.copy(scale)

  if (parent) {
    parent.add(lod)
  }

  return lod
}

export function wrapCreatureWithLOD(mesh: THREE.Mesh): THREE.LOD {
  const lod = new THREE.LOD()

  const parent = mesh.parent
  const position = mesh.position.clone()
  const quaternion = mesh.quaternion.clone()
  const scale = mesh.scale.clone()

  mesh.position.set(0, 0, 0)
  mesh.quaternion.identity()
  mesh.scale.set(1, 1, 1)
  lod.addLevel(mesh, 0)

  let color = new THREE.Color(0x888888)
  if (
    mesh.material instanceof THREE.MeshStandardMaterial ||
    mesh.material instanceof THREE.MeshBasicMaterial
  ) {
    color = mesh.material.color.clone()
  }

  const mediumGeo = createReducedGeometry(mesh.geometry, 32)
  const mediumMat = new THREE.MeshBasicMaterial({ color })
  const mediumMesh = new THREE.Mesh(mediumGeo, mediumMat)
  lod.addLevel(mediumMesh, LOD_DISTANCES.high)

  const sprite = createBillboardSprite(color)
  sprite.scale.set(scale.x * 2, scale.y * 2, 1)
  lod.addLevel(sprite, LOD_DISTANCES.medium)

  lod.position.copy(position)
  lod.quaternion.copy(quaternion)
  lod.scale.copy(scale)

  if (parent) {
    parent.add(lod)
  }

  return lod
}
