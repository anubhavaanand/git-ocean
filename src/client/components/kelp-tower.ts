import * as THREE from 'three'
import { LOD_DISTANCES } from './lod-system'

function buildKelpTower(
  height: number,
  color: THREE.Color,
  stepSize: number,
  leafStep: number,
): THREE.Group {
  const group = new THREE.Group()
  const c = color

  const stalkMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0d9488'),
    roughness: 0.7,
    metalness: 0.1,
  })

  const segments = Math.max(2, Math.floor(height / stepSize))
  for (let i = 0; i < segments; i++) {
    const t = i / segments
    const segHeight = height / segments
    const segGeo = new THREE.CylinderGeometry(
      0.04 * (1 - t * 0.3),
      0.06 * (1 - t * 0.2),
      segHeight * 0.9,
      segments <= 3 ? 4 : 6,
    )
    const seg = new THREE.Mesh(segGeo, stalkMat)
    seg.position.y = segHeight * i + segHeight * 0.45
    seg.rotation.z = (Math.random() - 0.5) * 0.1
    seg.rotation.x = (Math.random() - 0.5) * 0.1
    group.add(seg)
  }

  const leafMat = new THREE.MeshStandardMaterial({
    color: c,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
    roughness: 0.8,
  })
  const leafCount = Math.max(1, Math.floor(height / leafStep))
  for (let i = 0; i < leafCount; i++) {
    const y = 0.3 + (i / leafCount) * height
    const leaf = new THREE.Mesh(
      new THREE.PlaneGeometry(0.2, 0.4),
      leafMat.clone(),
    )
    leaf.material.opacity = 0.5 + Math.random() * 0.4
    leaf.position.set(
      (Math.random() - 0.5) * 0.2,
      y,
      (Math.random() - 0.5) * 0.2,
    )
    leaf.rotation.z = (Math.random() - 0.5) * 0.8
    leaf.rotation.x = Math.random() * Math.PI
    group.add(leaf)
  }

  return group
}

export function createKelpTower(
  height: number,
  color: THREE.Color | string,
  position: THREE.Vector3,
) {
  const c = color instanceof THREE.Color ? color : new THREE.Color(color)

  const lod = new THREE.LOD()

  const highTower = buildKelpTower(height, c, 0.6, 0.7)
  lod.addLevel(highTower, 0)

  const mediumTower = buildKelpTower(height, c, 1.0, 1.2)
  lod.addLevel(mediumTower, LOD_DISTANCES.high)

  const lowTower = buildKelpTower(height, c, 1.5, 2.0)
  lod.addLevel(lowTower, LOD_DISTANCES.medium)

  lod.position.copy(position)
  return lod
}
