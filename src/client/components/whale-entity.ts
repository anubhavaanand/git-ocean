import * as THREE from 'three'

export interface WhaleConfig {
  size: number
  color: string
  songDialect: string
  activityLevel: number
  health: number
}

export interface WhaleEntity extends THREE.Group {
  updatePosition(time: number, orbitRadius: number, orbitSpeed: number): void
  setActivity(level: number): void
  getBodyMesh(): THREE.Mesh
}

function createTriangle(
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  v3: THREE.Vector3,
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry()
  const verts = new Float32Array([v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, v3.x, v3.y, v3.z])
  geo.setAttribute('position', new THREE.BufferAttribute(verts, 3))
  geo.computeVertexNormals()
  return geo
}

export function createWhale(config: WhaleConfig): WhaleEntity {
  const group = new THREE.Group() as WhaleEntity
  const s = config.size * 0.3

  const bodyColor = new THREE.Color(config.color)
  const finColor = bodyColor.clone().multiplyScalar(0.8)

  const bodyMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    roughness: 0.6,
    metalness: 0.3,
  })
  const finMat = new THREE.MeshStandardMaterial({
    color: finColor,
    roughness: 0.7,
    metalness: 0.2,
    side: THREE.DoubleSide,
  })

  // Body - elongated sphere
  const bodyGeo = new THREE.SphereGeometry(s * 0.5, 16, 12)
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.scale.set(0.7, 0.8, 1.8)
  body.castShadow = true
  group.add(body)

  // Tail fin - two triangular lobes extending backward (+Z)
  const tailLeft = new THREE.Mesh(
    createTriangle(
      new THREE.Vector3(0, s * 0.25, 0),
      new THREE.Vector3(-s * 0.55, s * 0.05, s * 0.7),
      new THREE.Vector3(0, 0, 0),
    ),
    finMat,
  )
  group.add(tailLeft)

  const tailRight = tailLeft.clone()
  tailRight.geometry = createTriangle(
    new THREE.Vector3(0, -s * 0.25, 0),
    new THREE.Vector3(-s * 0.55, -s * 0.05, s * 0.7),
    new THREE.Vector3(0, 0, 0),
  )
  group.add(tailRight)

  // Dorsal fin - triangle on top
  const dorsal = new THREE.Mesh(
    createTriangle(
      new THREE.Vector3(0, s * 0.35, 0),
      new THREE.Vector3(0, s * 0.35, s * 0.3),
      new THREE.Vector3(0, s * 0.35, -s * 0.2),
    ),
    finMat,
  )
  group.add(dorsal)

  // Pectoral fins - triangles on sides
  const finLeft = new THREE.Mesh(
    createTriangle(
      new THREE.Vector3(s * 0.4, -s * 0.15, -s * 0.15),
      new THREE.Vector3(s * 0.7, s * 0.1, -s * 0.05),
      new THREE.Vector3(s * 0.4, s * 0.05, 0),
    ),
    finMat,
  )
  group.add(finLeft)

  const finRight = finLeft.clone()
  finRight.geometry = createTriangle(
    new THREE.Vector3(-s * 0.4, -s * 0.15, -s * 0.15),
    new THREE.Vector3(-s * 0.7, s * 0.1, -s * 0.05),
    new THREE.Vector3(-s * 0.4, s * 0.05, 0),
  )
  group.add(finRight)

  // Eye
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.3,
  })
  const eye = new THREE.Mesh(new THREE.SphereGeometry(s * 0.07, 8, 8), eyeMat)
  eye.position.set(s * 0.25, s * 0.15, -s * 0.75)
  group.add(eye)

  // Bioluminescent dots along body sides
  const dotMat = new THREE.MeshStandardMaterial({
    color: '#06B6D4',
    emissive: '#06B6D4',
    emissiveIntensity: 0.8,
  })
  for (let i = 0; i < 6; i++) {
    const t = (i / 5) * 1.6 - 0.8
    const dotGeo = new THREE.SphereGeometry(s * 0.04, 6, 6)
    const dot = new THREE.Mesh(dotGeo, dotMat)
    dot.position.set(t * s * 0.4, -s * 0.12, s * 0.45)
    group.add(dot)

    const dotMirror = dot.clone()
    dotMirror.position.set(t * s * 0.4, -s * 0.12, -s * 0.45)
    group.add(dotMirror)
  }

  group.userData['songDialect'] = config.songDialect
  group.userData['activityLevel'] = config.activityLevel
  group.userData['health'] = config.health

  let activity = config.activityLevel

  group.updatePosition = function (time: number, orbitRadius: number, orbitSpeed: number) {
    const angle = time * orbitSpeed
    this.position.x = Math.cos(angle) * orbitRadius
    this.position.z = Math.sin(angle) * orbitRadius
    this.rotation.y = -angle + Math.PI / 2

    const bob = Math.sin(time * 1.5) * s * 0.1
    this.position.y = bob
  }

  group.setActivity = function (level: number) {
    activity = level
    bodyMat.emissive = bodyColor.clone()
    bodyMat.emissiveIntensity = level * 0.12
    dotMat.emissiveIntensity = 0.3 + level * 0.7
  }

  group.getBodyMesh = function () {
    return body
  }

  void activity

  return group
}
