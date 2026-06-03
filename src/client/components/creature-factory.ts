import * as THREE from 'three'

export type CreatureType =
  | 'dolphin'
  | 'jellyfish'
  | 'turtle'
  | 'barracuda'
  | 'octopus'
  | 'manta-ray'
  | 'seahorse'
  | 'crab'
  | 'anglerfish'
  | 'starfish'

export interface CreatureConfig {
  type: CreatureType
  size: number
  color: string
  count: number
  orbitRadius: number
  orbitSpeed: number
}

function tintColor(color: string, factor: number): THREE.Color {
  return new THREE.Color(color).multiplyScalar(factor)
}

function createDolphin(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.3 })
  const finMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.8),
    roughness: 0.6,
    side: THREE.DoubleSide,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.3, 10, 8), bodyMat)
  body.scale.set(1.6, 0.6, 0.6)
  g.add(body)

  const beak = new THREE.Mesh(new THREE.ConeGeometry(s * 0.08, s * 0.25, 6), bodyMat)
  beak.position.set(-s * 0.45, -s * 0.02, 0)
  beak.rotation.x = Math.PI / 2
  g.add(beak)

  const dorsalGeo = new THREE.BufferGeometry()
  const dv = new Float32Array([0, s * 0.2, 0, 0, s * 0.2, s * 0.25, 0, s * 0.35, s * 0.12])
  dorsalGeo.setAttribute('position', new THREE.BufferAttribute(dv, 3))
  dorsalGeo.computeVertexNormals()
  const dorsal = new THREE.Mesh(dorsalGeo, finMat)
  dorsal.position.set(0, s * 0.12, 0.05)
  g.add(dorsal)

  const tailGeo = new THREE.BufferGeometry()
  const tv = new Float32Array([
    0, s * 0.12, s * 0.3,
    -s * 0.25, 0, s * 0.4,
    0, 0, s * 0.3,
    0, s * 0.12, s * 0.3,
    0, 0, s * 0.3,
    s * 0.25, 0, s * 0.4,
  ])
  tailGeo.setAttribute('position', new THREE.BufferAttribute(tv, 3))
  tailGeo.computeVertexNormals()
  const tail = new THREE.Mesh(tailGeo, finMat)
  tail.position.set(0, 0, 0)
  g.add(tail)

  return g
}

function createJellyfish(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const capMat = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 0.6,
    roughness: 0.3,
    metalness: 0.1,
  })
  const tentacleMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.7),
    transparent: true,
    opacity: 0.4,
  })

  const cap = new THREE.Mesh(new THREE.SphereGeometry(s * 0.3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), capMat)
  cap.scale.set(1.2, 1, 1.2)
  cap.position.y = s * 0.15
  g.add(cap)

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const tentacle = new THREE.Mesh(
      new THREE.CylinderGeometry(s * 0.015, s * 0.01, s * 0.5, 4),
      tentacleMat,
    )
    tentacle.position.set(Math.cos(angle) * s * 0.2, -s * 0.1, Math.sin(angle) * s * 0.2)
    tentacle.userData['baseAngle'] = angle
    tentacle.userData['tentacleIndex'] = i
    g.add(tentacle)
  }

  return g
}

function createTurtle(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.1 })
  const shellMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.7),
    roughness: 0.8,
    flatShading: true,
  })
  const legMat = new THREE.MeshStandardMaterial({ color: tintColor(color, 0.6), roughness: 0.8 })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.2, 8, 6), bodyMat)
  body.scale.set(1.2, 0.5, 0.8)
  g.add(body)

  const shell = new THREE.Mesh(new THREE.SphereGeometry(s * 0.25, 10, 8), shellMat)
  shell.scale.set(1.1, 0.6, 0.9)
  shell.position.y = s * 0.08
  g.add(shell)

  const legPositions = [
    [-s * 0.2, -s * 0.05, -s * 0.15],
    [-s * 0.2, -s * 0.05, s * 0.15],
    [s * 0.2, -s * 0.05, -s * 0.15],
    [s * 0.2, -s * 0.05, s * 0.15],
  ]
  for (const pos of legPositions) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.04, s * 0.05, s * 0.08, 6), legMat)
    leg.position.set(pos[0]!, pos[1]!, pos[2]!)
    g.add(leg)
  }

  return g
}

function createBarracuda(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.3,
    metalness: 0.6,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.15, 8, 6), bodyMat)
  body.scale.set(3, 0.4, 0.4)
  g.add(body)

  const head = new THREE.Mesh(new THREE.ConeGeometry(s * 0.1, s * 0.3, 6), bodyMat)
  head.position.set(-s * 0.5, 0, 0)
  head.rotation.x = -Math.PI / 2
  g.add(head)

  const tailFin = new THREE.Mesh(new THREE.ConeGeometry(s * 0.12, s * 0.2, 4), bodyMat)
  tailFin.position.set(s * 0.52, 0, 0)
  tailFin.rotation.x = Math.PI / 2
  tailFin.scale.set(1.5, 0.1, 1)
  g.add(tailFin)

  return g
}

function createOctopus(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.7,
    metalness: 0.1,
  })
  const tentacleMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    roughness: 0.8,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.25, 10, 8), bodyMat)
  g.add(body)

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(angle) * s * 0.2, -s * 0.15, Math.sin(angle) * s * 0.2),
      new THREE.Vector3(Math.cos(angle) * s * 0.35, -s * 0.35, Math.sin(angle) * s * 0.35),
      new THREE.Vector3(Math.cos(angle + 0.3) * s * 0.4, -s * 0.5, Math.sin(angle + 0.3) * s * 0.4),
    ])
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 6, s * 0.025, 4, false), tentacleMat)
    tube.userData['tentacleIndex'] = i
    tube.userData['baseAngle'] = angle
    g.add(tube)
  }

  return g
}

function createMantaRay(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.4,
    metalness: 0.3,
    side: THREE.DoubleSide,
  })

  const body = new THREE.Mesh(new THREE.CircleGeometry(s * 0.5, 8), bodyMat)
  body.scale.set(1.5, 1, 0.1)
  body.rotation.x = -Math.PI / 2
  g.add(body)

  const tail = new THREE.Mesh(
    new THREE.CylinderGeometry(s * 0.01, s * 0.005, s * 0.4, 4),
    bodyMat,
  )
  tail.position.set(0, 0, s * 0.45)
  tail.rotation.x = Math.PI / 2
  g.add(tail)

  // Wing tips
  const wingMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    side: THREE.DoubleSide,
    roughness: 0.4,
    metalness: 0.2,
  })
  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(new THREE.ConeGeometry(s * 0.08, s * 0.3, 4), wingMat)
    wing.position.set(side * s * 0.45, 0, 0)
    wing.rotation.z = side * Math.PI / 4
    g.add(wing)
  }

  return g
}

function createSeahorse(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1 })

  const segments = 5
  for (let i = 0; i < segments; i++) {
    const t = i / (segments - 1)
    const seg = new THREE.Mesh(new THREE.SphereGeometry(s * 0.06 * (1 - t * 0.4), 6, 6), bodyMat)
    seg.position.set(Math.sin(t * Math.PI * 2) * s * 0.1, s * 0.3 - t * s * 0.5, 0)
    seg.scale.set(1, 1.3 - t * 0.3, 0.8)
    g.add(seg)
  }

  const head = new THREE.Mesh(new THREE.SphereGeometry(s * 0.07, 6, 6), bodyMat)
  head.position.set(s * 0.05, s * 0.35, 0)
  g.add(head)

  const snout = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.015, s * 0.02, s * 0.08, 4), bodyMat)
  snout.position.set(s * 0.12, s * 0.35, 0)
  snout.rotation.z = Math.PI / 6
  g.add(snout)

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.01, s * 0.02, s * 0.12, 4), bodyMat)
  tail.position.set(-s * 0.05, -s * 0.1, 0)
  tail.rotation.z = 0.5
  g.add(tail)

  return g
}

function createCrab(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.1 })
  const legMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    roughness: 0.8,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.12, 8, 6), bodyMat)
  body.scale.set(1.2, 0.6, 0.8)
  g.add(body)

  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 4; i++) {
      const legAngle = (i / 3) * 0.8 - 0.4
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(s * 0.015, s * 0.02, s * 0.12, 4),
        legMat,
      )
      leg.position.set(side * s * 0.15, -s * 0.04, legAngle * s * 0.15)
      leg.rotation.z = side * 0.6
      g.add(leg)
    }

    const claw = new THREE.Mesh(new THREE.ConeGeometry(s * 0.03, s * 0.1, 4), bodyMat)
    claw.position.set(side * s * 0.25, -s * 0.02, 0)
    claw.rotation.z = side * 0.3
    g.add(claw)
  }

  return g
}

function createAnglerfish(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.8,
    metalness: 0.1,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.2, 10, 8), bodyMat)
  body.scale.set(1, 0.8, 0.9)
  g.add(body)

  const mouth = new THREE.Mesh(new THREE.ConeGeometry(s * 0.12, s * 0.15, 6), bodyMat)
  mouth.position.set(0, 0, -s * 0.2)
  mouth.rotation.x = -Math.PI / 2
  g.add(mouth)

  const lureMat = new THREE.MeshStandardMaterial({
    color: '#06B6D4',
    emissive: '#06B6D4',
    emissiveIntensity: 0.8,
  })
  const lure = new THREE.Mesh(new THREE.SphereGeometry(s * 0.03, 6, 6), lureMat)
  lure.position.set(0, s * 0.2, -s * 0.15)
  g.add(lure)

  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(s * 0.005, s * 0.008, s * 0.12, 4),
    new THREE.MeshStandardMaterial({ color: tintColor(color, 0.7) }),
  )
  antenna.position.set(0, s * 0.1, -s * 0.08)
  antenna.rotation.x = -0.3
  g.add(antenna)

  const tail = new THREE.Mesh(new THREE.ConeGeometry(s * 0.05, s * 0.12, 4), bodyMat)
  tail.position.set(0, 0, s * 0.22)
  tail.rotation.x = Math.PI / 2
  g.add(tail)

  return g
}

function createStarfish(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.9,
    flatShading: true,
  })

  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
    const arm = new THREE.Mesh(new THREE.ConeGeometry(s * 0.04, s * 0.2, 4), bodyMat)
    arm.position.set(Math.cos(angle) * s * 0.12, 0, Math.sin(angle) * s * 0.12)
    arm.rotation.x = Math.PI / 2
    arm.rotation.z = -angle
    g.add(arm)
  }

  const center = new THREE.Mesh(new THREE.SphereGeometry(s * 0.04, 6, 6), bodyMat)
  center.scale.set(1, 0.3, 1)
  g.add(center)

  return g
}

export interface SwarmInstance {
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: THREE.Vector3
}

export interface InstancedSwarm {
  meshes: THREE.InstancedMesh[]
  count: number
  updateInstance(
    index: number,
    position: THREE.Vector3,
    rotation: THREE.Euler,
    scale: THREE.Vector3,
  ): void
  dispose(): void
}

interface CreaturePart {
  geometry: THREE.BufferGeometry
  material: THREE.Material | THREE.Material[]
  localMatrix: THREE.Matrix4
}

function getCreatureParts(
  creatureType: CreatureType,
  size: number,
  color: string,
): CreaturePart[] | null {
  let group: THREE.Group
  const s = size * 0.5

  switch (creatureType) {
    case 'dolphin': {
      group = createDolphin(size, color)
      break
    }
    case 'jellyfish': {
      group = createJellyfish(size, color)
      break
    }
    case 'barracuda': {
      group = createBarracuda(size, color)
      break
    }
    default:
      return null
  }
  void s

  const parts: CreaturePart[] = []
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const localMatrix = new THREE.Matrix4()
      localMatrix.compose(child.position, child.quaternion, child.scale)
      parts.push({
        geometry: child.geometry,
        material: child.material,
        localMatrix,
      })
    }
  })

  return parts
}

export function createInstancedSwarm(
  creatureType: CreatureType,
  count: number,
  size: number,
  color: string,
): InstancedSwarm {
  const parts = getCreatureParts(creatureType, size, color)
  if (!parts || parts.length === 0) {
    throw new Error(`Cannot create instanced swarm for creature type: ${creatureType}`)
  }

  const meshes: THREE.InstancedMesh[] = parts.map((part) => {
    const material = Array.isArray(part.material)
      ? part.material.map((m) => m.clone())
      : part.material.clone()
    const im = new THREE.InstancedMesh(part.geometry, material, count)
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    im.castShadow = true
    im.receiveShadow = true
    return im
  })

  const updateInstance = (
    index: number,
    position: THREE.Vector3,
    rotation: THREE.Euler,
    scale: THREE.Vector3,
  ) => {
    const worldMatrix = new THREE.Matrix4()
    worldMatrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale)

    for (let i = 0; i < parts.length; i++) {
      const im = meshes[i]
      if (!im) continue
      const matrix = new THREE.Matrix4().multiplyMatrices(worldMatrix, parts[i]!.localMatrix)
      im.setMatrixAt(index, matrix)
      im.instanceMatrix.needsUpdate = true
    }
  }

  const dispose = () => {
    for (const im of meshes) {
      im.geometry.dispose()
      if (Array.isArray(im.material)) {
        im.material.forEach((m) => m.dispose())
      } else {
        im.material.dispose()
      }
    }
  }

  return { meshes, count, updateInstance, dispose }
}

export function createCreature(config: CreatureConfig): THREE.Group {
  const group = new THREE.Group()

  const creatureFunctions: Record<CreatureType, () => THREE.Group> = {
    dolphin: () => createDolphin(config.size, config.color),
    jellyfish: () => createJellyfish(config.size, config.color),
    turtle: () => createTurtle(config.size, config.color),
    barracuda: () => createBarracuda(config.size, config.color),
    octopus: () => createOctopus(config.size, config.color),
    'manta-ray': () => createMantaRay(config.size, config.color),
    seahorse: () => createSeahorse(config.size, config.color),
    crab: () => createCrab(config.size, config.color),
    anglerfish: () => createAnglerfish(config.size, config.color),
    starfish: () => createStarfish(config.size, config.color),
  }

  const populateSwarm = (
    count: number,
    creatureGroup: THREE.Group,
    orbitRadius: number,
    orbitSpeed: number,
  ) => {
    if (count <= 1) {
      creatureGroup.position.x = orbitRadius
      creatureGroup.userData['update'] = (time: number) => {
        const angle = time * orbitSpeed
        creatureGroup.position.x = Math.cos(angle) * orbitRadius
        creatureGroup.position.z = Math.sin(angle) * orbitRadius
        creatureGroup.rotation.y = -angle + Math.PI / 2
      }
      return creatureGroup
    }

    // For swarms, create multiple instance clones spread around orbit
    for (let i = 0; i < count; i++) {
      const instance = creatureGroup.clone()
      const offset = (i / count) * Math.PI * 2
      instance.position.x = orbitRadius
      instance.userData['orbitOffset'] = offset
      instance.userData['update'] = (time: number) => {
        const angle = time * orbitSpeed + offset
        instance.position.x = Math.cos(angle) * (orbitRadius + (Math.random() - 0.5) * 0.5)
        instance.position.z = Math.sin(angle) * (orbitRadius + (Math.random() - 0.5) * 0.5)
        instance.position.y = Math.sin(time * 2 + offset) * 0.3
        instance.rotation.y = -angle + Math.PI / 2
      }
      group.add(instance)
    }

    return creatureGroup
  }

  const creature = creatureFunctions[config.type]()
  creature.userData['creatureType'] = config.type
  creature.userData['dataPoint'] = config.type

  populateSwarm(config.count, creature, config.orbitRadius, config.orbitSpeed)

  if (config.count <= 1) {
    group.add(creature)
  }

  return group
}
