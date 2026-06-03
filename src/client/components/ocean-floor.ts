import * as THREE from 'three'

export function createOceanFloor(size: number, yPosition: number) {
  const geometry = new THREE.PlaneGeometry(size, size, 20, 20)
  geometry.rotateX(-Math.PI / 2)

  const positionAttribute = geometry.attributes['position']
  const vertexCount = positionAttribute ? positionAttribute.count : 0
  const colors = new Float32Array(vertexCount * 3)
  for (let i = 0; i < vertexCount; i++) {
    const i3 = i * 3
    colors[i3] = 0.08 + Math.random() * 0.05
    colors[i3 + 1] = 0.12 + Math.random() * 0.05
    colors[i3 + 2] = 0.15 + Math.random() * 0.05
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.9,
    metalness: 0,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = yPosition
  mesh.receiveShadow = true
  return mesh
}
