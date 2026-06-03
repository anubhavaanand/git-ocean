import * as THREE from 'three'

export function createKelpTower(
  height: number,
  color: THREE.Color | string,
  position: THREE.Vector3,
) {
  const group = new THREE.Group()
  const c = color instanceof THREE.Color ? color : new THREE.Color(color)

  const stalkMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0d9488'),
    roughness: 0.7,
    metalness: 0.1,
  })

  const segments = Math.max(3, Math.floor(height / 0.6))
  for (let i = 0; i < segments; i++) {
    const t = i / segments
    const segHeight = height / segments
    const segGeo = new THREE.CylinderGeometry(
      0.04 * (1 - t * 0.3),
      0.06 * (1 - t * 0.2),
      segHeight * 0.9,
      6,
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
  const leafCount = Math.max(2, Math.floor(height / 0.7))
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

  group.position.copy(position)
  return group
}
