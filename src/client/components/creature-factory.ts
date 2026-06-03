import * as THREE from 'three'

export type CreatureType =
  // LEGACY — keep original names for backward compatibility
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
  // GROUP 1 — BUILDERS
  | 'bottlenose-dolphin'
  | 'spinner-dolphin'
  | 'sailfish'
  | 'bluefin-tuna'
  | 'cuttlefish'
  | 'krill-swarm'
  | 'swordfish'
  | 'herring-school'
  // GROUP 2 — ADMIRERS
  | 'moon-jellyfish'
  | 'lions-mane-jellyfish'
  | 'dinoflagellates'
  | 'sea-sparkle'
  | 'salps'
  | 'copepods'
  // GROUP 3 — OFFSPRING
  | 'whale-calf'
  | 'hammerhead-school'
  | 'flying-fish'
  | 'amphipod-surge'
  // GROUP 4 — PROBLEMS
  | 'giant-pacific-octopus'
  | 'lionfish'
  | 'moray-eel'
  | 'mantis-shrimp'
  | 'arrow-worms'
  | 'decorator-crab'
  | 'giant-squid'
  // GROUP 5 — RESOLUTIONS
  | 'leatherback-turtle'
  | 'green-sea-turtle'
  | 'nautilus'
  | 'cleaner-wrasse'
  | 'basking-shark'
  // AMBIENT WORLD LIFE (Group 0)
  | 'pilot-fish'
  | 'comb-jellyfish'
  | 'viperfish'
  | 'telescope-octopus'
  | 'giant-isopod'
  | 'whale-fall-ecosystem'
  | 'firefly-squid'

export interface CreatureConfig {
  type: CreatureType
  size: number
  color: string
  count: number
  orbitRadius: number
  orbitSpeed: number
  trophicLevel: number
  inclination: number
  eccentricity: number
  orbitalGroup: number
}

function tintColor(color: string, factor: number): THREE.Color {
  return new THREE.Color(color).multiplyScalar(factor)
}

// ── EXISTING CREATURE FUNCTIONS (kept for backward compatibility) ──

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

  const legPositions: [number, number, number][] = [
    [-s * 0.2, -s * 0.05, -s * 0.15],
    [-s * 0.2, -s * 0.05, s * 0.15],
    [s * 0.2, -s * 0.05, -s * 0.15],
    [s * 0.2, -s * 0.05, s * 0.15],
  ]
  for (const [x, y, z] of legPositions) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.04, s * 0.05, s * 0.08, 6), legMat)
    leg.position.set(x, y, z)
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

// ══════════════════════════════════════════════════════════════════════
//  NEW CREATURE FUNCTIONS
// ══════════════════════════════════════════════════════════════════════

// ── GROUP 1 — BUILDERS ──

function createSpinnerDolphin(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.4 })
  const finMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.8),
    roughness: 0.5,
    side: THREE.DoubleSide,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.28, 10, 8), bodyMat)
  body.scale.set(1.8, 0.5, 0.5)
  body.rotation.z = 0.15
  g.add(body)

  const beak = new THREE.Mesh(new THREE.ConeGeometry(s * 0.06, s * 0.3, 6), bodyMat)
  beak.position.set(-s * 0.5, -s * 0.03, 0)
  beak.rotation.x = Math.PI / 2
  g.add(beak)

  const dorsalGeo = new THREE.BufferGeometry()
  const dv = new Float32Array([0, s * 0.25, 0, 0, s * 0.25, s * 0.3, 0, s * 0.4, s * 0.15])
  dorsalGeo.setAttribute('position', new THREE.BufferAttribute(dv, 3))
  dorsalGeo.computeVertexNormals()
  const dorsal = new THREE.Mesh(dorsalGeo, finMat)
  dorsal.position.set(0, s * 0.1, 0.05)
  g.add(dorsal)

  const tailGeo = new THREE.BufferGeometry()
  const tv = new Float32Array([
    0, s * 0.1, s * 0.35,
    -s * 0.3, 0, s * 0.45,
    0, 0, s * 0.35,
    0, s * 0.1, s * 0.35,
    0, 0, s * 0.35,
    s * 0.3, 0, s * 0.45,
  ])
  tailGeo.setAttribute('position', new THREE.BufferAttribute(tv, 3))
  tailGeo.computeVertexNormals()
  const tail = new THREE.Mesh(tailGeo, finMat)
  tail.position.set(0, 0, 0)
  g.add(tail)

  return g
}

function createSailfish(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.5 })
  const finMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    roughness: 0.4,
    side: THREE.DoubleSide,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.18, 10, 8), bodyMat)
  body.scale.set(2.5, 0.5, 0.5)
  g.add(body)

  const bill = new THREE.Mesh(new THREE.ConeGeometry(s * 0.025, s * 0.5, 6), bodyMat)
  bill.position.set(-s * 0.6, 0, 0)
  bill.rotation.x = Math.PI / 2
  g.add(bill)

  const dorsalGeo = new THREE.BufferGeometry()
  const dv = new Float32Array([
    0, s * 0.5, 0,
    0, s * 0.3, s * 0.3,
    0, s * 0.05, s * 0.2,
    0, s * 0.5, 0,
    0, s * 0.05, s * 0.2,
    0, s * 0.1, -s * 0.25,
  ])
  dorsalGeo.setAttribute('position', new THREE.BufferAttribute(dv, 3))
  dorsalGeo.computeVertexNormals()
  const dorsal = new THREE.Mesh(dorsalGeo, finMat)
  dorsal.position.set(0, s * 0.05, 0.05)
  g.add(dorsal)

  const tailGeo = new THREE.BufferGeometry()
  const tv = new Float32Array([
    0, s * 0.08, s * 0.3,
    -s * 0.15, 0, s * 0.4,
    0, 0, s * 0.3,
    0, s * 0.08, s * 0.3,
    0, 0, s * 0.3,
    s * 0.15, 0, s * 0.4,
  ])
  tailGeo.setAttribute('position', new THREE.BufferAttribute(tv, 3))
  tailGeo.computeVertexNormals()
  const tail = new THREE.Mesh(tailGeo, finMat)
  tail.position.set(0, 0, 0)
  g.add(tail)

  return g
}

function createBluefinTuna(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.7 })
  const finMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    roughness: 0.4,
    side: THREE.DoubleSide,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.22, 12, 8), bodyMat)
  body.scale.set(2, 0.7, 0.6)
  g.add(body)

  const head = new THREE.Mesh(new THREE.ConeGeometry(s * 0.12, s * 0.25, 8), bodyMat)
  head.position.set(-s * 0.5, 0, 0)
  head.rotation.x = Math.PI / 2
  g.add(head)

  const tailGeo = new THREE.BufferGeometry()
  const tv = new Float32Array([
    0, s * 0.15, s * 0.25,
    -s * 0.3, 0, s * 0.35,
    0, 0, s * 0.25,
    0, s * 0.15, s * 0.25,
    0, 0, s * 0.25,
    s * 0.3, 0, s * 0.35,
  ])
  tailGeo.setAttribute('position', new THREE.BufferAttribute(tv, 3))
  tailGeo.computeVertexNormals()
  const tail = new THREE.Mesh(tailGeo, finMat)
  tail.position.set(0, 0, 0)
  g.add(tail)

  const keel = new THREE.Mesh(
    new THREE.CylinderGeometry(s * 0.01, s * 0.02, s * 0.08, 4),
    finMat,
  )
  keel.position.set(0, 0, s * 0.3)
  keel.rotation.x = Math.PI / 2
  g.add(keel)

  for (let i = 0; i < 5; i++) {
    const yOff = s * 0.05 + i * s * 0.04
    const finlet = new THREE.Mesh(new THREE.ConeGeometry(s * 0.015, s * 0.04, 4), finMat)
    finlet.position.set(0, yOff, s * 0.1 - i * s * 0.05)
    g.add(finlet)
  }

  return g
}

function createCuttlefish(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1 })
  const frillMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    roughness: 0.7,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.2, 10, 8), bodyMat)
  body.scale.set(1, 0.7, 0.7)
  g.add(body)

  const frill = new THREE.Mesh(new THREE.RingGeometry(s * 0.15, s * 0.25, 16), frillMat)
  frill.rotation.x = Math.PI / 2
  frill.position.y = -s * 0.05
  frill.scale.set(1, 1, 0.3)
  g.add(frill)

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(s * 0.01, s * 0.015, s * 0.2, 4),
      bodyMat,
    )
    arm.position.set(Math.cos(angle) * s * 0.15, -s * 0.12, Math.sin(angle) * s * 0.15)
    g.add(arm)
  }

  const dotMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.5),
    emissive: tintColor(color, 0.3),
    emissiveIntensity: 0.2,
  })
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    const dot = new THREE.Mesh(new THREE.SphereGeometry(s * 0.02, 4, 4), dotMat)
    dot.position.set(Math.cos(a) * s * 0.12, 0, Math.sin(a) * s * 0.12)
    g.add(dot)
  }

  return g
}

function createKrillSwarm(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0.2,
    transparent: true,
    opacity: 0.8,
  })

  const body = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.015, s * 0.025, s * 0.08, 4), bodyMat)
  body.rotation.x = Math.PI / 3
  g.add(body)

  const tail = new THREE.Mesh(new THREE.ConeGeometry(s * 0.01, s * 0.04, 4), bodyMat)
  tail.position.set(0, -s * 0.06, 0)
  tail.rotation.x = Math.PI / 4
  g.add(tail)

  return g
}

function createSwordfish(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.5 })
  const finMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.8),
    roughness: 0.4,
    side: THREE.DoubleSide,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.18, 10, 8), bodyMat)
  body.scale.set(2.8, 0.5, 0.5)
  g.add(body)

  const bill = new THREE.Mesh(new THREE.BoxGeometry(s * 0.02, s * 0.005, s * 0.5), bodyMat)
  bill.position.set(-s * 0.7, 0, 0)
  g.add(bill)

  const dorsalGeo = new THREE.BufferGeometry()
  const dv = new Float32Array([0, s * 0.3, 0, 0, s * 0.2, s * 0.2, 0, s * 0.05, -s * 0.15])
  dorsalGeo.setAttribute('position', new THREE.BufferAttribute(dv, 3))
  dorsalGeo.computeVertexNormals()
  const dorsal = new THREE.Mesh(dorsalGeo, finMat)
  dorsal.position.set(0, s * 0.05, 0.05)
  g.add(dorsal)

  const tailGeo = new THREE.BufferGeometry()
  const tv = new Float32Array([
    0, s * 0.08, s * 0.3,
    -s * 0.2, 0, s * 0.4,
    0, 0, s * 0.3,
    0, s * 0.08, s * 0.3,
    0, 0, s * 0.3,
    s * 0.2, 0, s * 0.4,
  ])
  tailGeo.setAttribute('position', new THREE.BufferAttribute(tv, 3))
  tailGeo.computeVertexNormals()
  const tail = new THREE.Mesh(tailGeo, finMat)
  tail.position.set(0, 0, 0)
  g.add(tail)

  return g
}

function createHerringSchool(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.3,
    metalness: 0.5,
  })

  const body = new THREE.Mesh(new THREE.ConeGeometry(s * 0.03, s * 0.12, 4), bodyMat)
  body.rotation.x = Math.PI / 2
  g.add(body)

  const tail = new THREE.Mesh(new THREE.ConeGeometry(s * 0.02, s * 0.04, 4), bodyMat)
  tail.position.set(0, 0, s * 0.08)
  tail.rotation.x = Math.PI / 2
  g.add(tail)

  return g
}

// ── GROUP 2 — ADMIRERS ──

function createMoonJellyfish(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const capMat = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 0.35,
    roughness: 0.2,
    metalness: 0.05,
    side: THREE.DoubleSide,
  })
  const tentacleMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.6),
    transparent: true,
    opacity: 0.25,
  })

  const cap = new THREE.Mesh(new THREE.SphereGeometry(s * 0.35, 12, 8, 0, Math.PI * 2, 0, Math.PI / 3), capMat)
  cap.scale.set(1.3, 0.4, 1.3)
  cap.position.y = s * 0.1
  g.add(cap)

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2
    const tentacle = new THREE.Mesh(
      new THREE.CylinderGeometry(s * 0.008, s * 0.004, s * 0.3, 4),
      tentacleMat,
    )
    tentacle.position.set(Math.cos(angle) * s * 0.25, -s * 0.05, Math.sin(angle) * s * 0.25)
    tentacle.userData['baseAngle'] = angle
    g.add(tentacle)
  }

  return g
}

function createLionsManeJellyfish(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const capMat = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    roughness: 0.4,
    emissive: tintColor(color, 0.3),
    emissiveIntensity: 0.1,
  })
  const tentacleMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.7),
    transparent: true,
    opacity: 0.3,
  })

  const cap = new THREE.Mesh(new THREE.SphereGeometry(s * 0.4, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2.5), capMat)
  cap.scale.set(1.2, 1, 1.2)
  cap.position.y = s * 0.2
  g.add(cap)

  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2
    const len = s * (0.4 + Math.random() * 0.6)
    const tentacle = new THREE.Mesh(
      new THREE.CylinderGeometry(s * 0.012, s * 0.003, len, 4),
      tentacleMat,
    )
    tentacle.position.set(Math.cos(angle) * s * 0.3, -s * 0.1, Math.sin(angle) * s * 0.3)
    tentacle.userData['baseAngle'] = angle
    g.add(tentacle)
  }

  return g
}

function createDinoflagellates(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const glowMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.9,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.02, 6, 6), glowMat)
  g.add(body)

  return g
}

function createSeaSparkle(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const glowMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 1.0,
    transparent: true,
    opacity: 0.8,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.08, 8, 8), glowMat)
  g.add(body)

  return g
}

function createSalps(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const barrelMat = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    metalness: 0.1,
    side: THREE.DoubleSide,
  })

  const count = 4
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1) - 0.5
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(s * 0.06 * (1 - Math.abs(t) * 0.3), s * 0.06 * (1 - Math.abs(t) * 0.3), s * 0.08, 8, 1, true),
      barrelMat,
    )
    barrel.position.set(0, 0, t * s * 0.2)
    g.add(barrel)

    const link = new THREE.Mesh(
      new THREE.CylinderGeometry(s * 0.01, s * 0.01, s * 0.015, 4),
      barrelMat,
    )
    link.position.set(0, 0, t * s * 0.2 + s * 0.05)
    g.add(link)
  }

  return g
}

function createCopepods(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5 })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.015, 6, 6), bodyMat)
  body.scale.set(1, 0.7, 0.7)
  g.add(body)

  const antennaMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.7),
    transparent: true,
    opacity: 0.6,
  })
  for (const side of [-1, 1]) {
    const ant = new THREE.Mesh(
      new THREE.CylinderGeometry(s * 0.002, s * 0.003, s * 0.04, 4),
      antennaMat,
    )
    ant.position.set(side * s * 0.01, s * 0.015, 0)
    ant.rotation.z = side * 0.5
    g.add(ant)
  }

  return g
}

// ── GROUP 3 — OFFSPRING ──

function createWhaleCalf(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.2 })
  const finMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.8),
    roughness: 0.6,
    side: THREE.DoubleSide,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.3, 14, 10), bodyMat)
  body.scale.set(0.8, 0.8, 1.5)
  g.add(body)

  const tailGeo = new THREE.BufferGeometry()
  const tv = new Float32Array([
    0, s * 0.15, s * 0.4,
    -s * 0.3, 0, s * 0.5,
    0, 0, s * 0.4,
    0, s * 0.15, s * 0.4,
    0, 0, s * 0.4,
    s * 0.3, 0, s * 0.5,
  ])
  tailGeo.setAttribute('position', new THREE.BufferAttribute(tv, 3))
  tailGeo.computeVertexNormals()
  const tail = new THREE.Mesh(tailGeo, finMat)
  tail.position.set(0, 0, 0)
  g.add(tail)

  const dorsal = new THREE.Mesh(new THREE.ConeGeometry(s * 0.04, s * 0.08, 4), finMat)
  dorsal.position.set(0, s * 0.28, s * 0.1)
  dorsal.rotation.x = Math.PI / 2
  g.add(dorsal)

  const pectoralMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    roughness: 0.6,
    side: THREE.DoubleSide,
  })
  for (const side of [-1, 1]) {
    const fin = new THREE.Mesh(
      new THREE.ConeGeometry(s * 0.04, s * 0.12, 4),
      pectoralMat,
    )
    fin.position.set(side * s * 0.2, -s * 0.05, -s * 0.25)
    fin.rotation.z = side * 0.4
    g.add(fin)
  }

  return g
}

function createHammerheadSchool(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.4 })
  const finMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    roughness: 0.5,
    side: THREE.DoubleSide,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.15, 8, 6), bodyMat)
  body.scale.set(2, 0.5, 0.5)
  g.add(body)

  const headBar = new THREE.Mesh(new THREE.BoxGeometry(s * 0.3, s * 0.03, s * 0.06), bodyMat)
  headBar.position.set(-s * 0.45, 0, 0)
  g.add(headBar)

  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(s * 0.025, 6, 6), new THREE.MeshStandardMaterial({ color: 0xffffff }))
    eye.position.set(-s * 0.55, side * s * 0.12, 0)
    g.add(eye)
  }

  const tailGeo = new THREE.BufferGeometry()
  const tv = new Float32Array([
    0, s * 0.06, s * 0.25,
    -s * 0.15, 0, s * 0.35,
    0, 0, s * 0.25,
    0, s * 0.06, s * 0.25,
    0, 0, s * 0.25,
    s * 0.15, 0, s * 0.35,
  ])
  tailGeo.setAttribute('position', new THREE.BufferAttribute(tv, 3))
  tailGeo.computeVertexNormals()
  const tail = new THREE.Mesh(tailGeo, finMat)
  tail.position.set(0, 0, 0)
  g.add(tail)

  const dorsal = new THREE.Mesh(new THREE.ConeGeometry(s * 0.03, s * 0.08, 4), finMat)
  dorsal.position.set(0, s * 0.1, 0.05)
  dorsal.rotation.x = Math.PI / 2
  g.add(dorsal)

  return g
}

function createFlyingFish(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3 })
  const wingMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    roughness: 0.5,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.12, 8, 6), bodyMat)
  body.scale.set(2, 0.4, 0.4)
  g.add(body)

  const tail = new THREE.Mesh(new THREE.ConeGeometry(s * 0.04, s * 0.1, 4), bodyMat)
  tail.position.set(0, 0, s * 0.2)
  tail.rotation.x = Math.PI / 2
  g.add(tail)

  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(
      new THREE.ConeGeometry(s * 0.05, s * 0.3, 4),
      wingMat,
    )
    wing.position.set(side * s * 0.35, s * 0.02, 0)
    wing.rotation.z = side * 0.2
    g.add(wing)
  }

  return g
}

function createAmphipodSurge(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.6,
    transparent: true,
    opacity: 0.7,
  })

  const body = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.012, s * 0.02, s * 0.06, 4), bodyMat)
  body.rotation.x = Math.PI / 4
  g.add(body)

  const tail = new THREE.Mesh(new THREE.ConeGeometry(s * 0.008, s * 0.03, 4), bodyMat)
  tail.position.set(0, -s * 0.05, 0)
  tail.rotation.x = Math.PI / 3
  g.add(tail)

  return g
}

// ── GROUP 4 — PROBLEMS ──

function createGiantPacificOctopus(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.75,
    metalness: 0.1,
    flatShading: true,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.3, 12, 10), bodyMat)
  g.add(body)

  const armColor = tintColor(color, 0.9)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const armMat = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? armColor : tintColor(color, 1.1),
      roughness: 0.8,
    })
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(angle) * s * 0.25, -s * 0.15, Math.sin(angle) * s * 0.25),
      new THREE.Vector3(Math.cos(angle) * s * 0.4, -s * 0.4, Math.sin(angle) * s * 0.4),
      new THREE.Vector3(Math.cos(angle + 0.2) * s * 0.5, -s * 0.6, Math.sin(angle + 0.2) * s * 0.5),
    ])
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 7, s * 0.03, 4, false), armMat)
    g.add(tube)
  }

  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 })
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(s * 0.04, 6, 6), eyeMat)
    eye.position.set(side * s * 0.12, s * 0.1, -s * 0.2)
    g.add(eye)
  }

  return g
}

function createLionfish(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
  const spikeMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 1.2),
    roughness: 0.4,
    emissive: tintColor(color, 0.3),
    emissiveIntensity: 0.1,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.18, 10, 8), bodyMat)
  body.scale.set(1.5, 0.8, 0.7)
  g.add(body)

  const count = 14
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    const spike = new THREE.Mesh(
      new THREE.ConeGeometry(s * 0.008, s * 0.1, 4),
      spikeMat,
    )
    spike.position.set(Math.cos(a) * s * 0.2, Math.sin(a) * s * 0.12, 0)
    spike.rotation.z = -a
    g.add(spike)
  }

  const tailMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.8),
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  })
  const tail = new THREE.Mesh(
    new THREE.ConeGeometry(s * 0.06, s * 0.15, 6),
    tailMat,
  )
  tail.position.set(0, 0, s * 0.25)
  tail.rotation.x = Math.PI / 2
  g.add(tail)

  return g
}

function createMorayEel(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.1 })
  const mouthMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.6),
    roughness: 0.8,
    side: THREE.DoubleSide,
  })

  const segments = 8
  for (let i = 0; i < segments; i++) {
    const t = i / (segments - 1)
    const r = s * 0.04 * (1 - t * 0.5)
    const seg = new THREE.Mesh(new THREE.SphereGeometry(r, 6, 6), bodyMat)
    seg.position.set(
      Math.sin(t * Math.PI * 0.5) * s * 0.15,
      s * 0.1 - t * s * 0.25,
      t * s * 0.4,
    )
    g.add(seg)
  }

  const head = new THREE.Mesh(new THREE.SphereGeometry(s * 0.05, 6, 6), bodyMat)
  head.position.set(0, s * 0.12, -s * 0.05)
  g.add(head)

  const jaw = new THREE.Mesh(new THREE.ConeGeometry(s * 0.03, s * 0.06, 4), mouthMat)
  jaw.position.set(0, s * 0.08, -s * 0.12)
  jaw.rotation.x = -Math.PI / 3
  g.add(jaw)

  const finMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.8),
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  })
  const dorsal = new THREE.Mesh(
    new THREE.ConeGeometry(s * 0.015, s * 0.25, 4),
    finMat,
  )
  dorsal.position.set(0, s * 0.15, -s * 0.02)
  dorsal.rotation.x = Math.PI / 2
  g.add(dorsal)

  return g
}

function createMantisShrimp(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.3 })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.1, 8, 6), bodyMat)
  body.scale.set(2, 0.5, 0.5)
  g.add(body)

  const segments = 4
  for (let i = 0; i < segments; i++) {
    const t = i / segments
    const seg = new THREE.Mesh(
      new THREE.SphereGeometry(s * 0.035 * (1 - t * 0.3), 6, 6),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color).offsetHSL(0.05 * i, 0, 0),
        roughness: 0.5,
        metalness: 0.2,
      }),
    )
    seg.position.set(0, 0, -s * 0.15 - t * s * 0.15)
    g.add(seg)
  }

  const clawMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 1.3),
    roughness: 0.3,
    metalness: 0.5,
  })
  for (const side of [-1, 1]) {
    const claw = new THREE.Mesh(
      new THREE.ConeGeometry(s * 0.025, s * 0.1, 4),
      clawMat,
    )
    claw.position.set(side * s * 0.15, 0, s * 0.05)
    claw.rotation.z = side * 0.4
    g.add(claw)
  }

  const tailMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    side: THREE.DoubleSide,
  })
  const tail = new THREE.Mesh(new THREE.ConeGeometry(s * 0.04, s * 0.06, 4), tailMat)
  tail.position.set(0, 0, -s * 0.3)
  tail.rotation.x = Math.PI / 2
  g.add(tail)

  return g
}

function createArrowWorms(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    roughness: 0.2,
  })

  const body = new THREE.Mesh(new THREE.ConeGeometry(s * 0.01, s * 0.15, 4), bodyMat)
  body.rotation.x = Math.PI / 2
  g.add(body)

  const bristleMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.7),
    transparent: true,
    opacity: 0.3,
  })
  for (const side of [-1, 1]) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.002, s * 0.002, s * 0.02, 4), bristleMat)
    b.position.set(side * s * 0.015, 0, 0)
    b.rotation.z = side * 0.6
    g.add(b)
  }

  return g
}

function createDecoratorCrab(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.05 })
  const legMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    roughness: 0.8,
  })
  const debrisMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.4),
    roughness: 1.0,
    flatShading: true,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.14, 8, 6), bodyMat)
  body.scale.set(1.3, 0.6, 0.9)
  g.add(body)

  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 4; i++) {
      const legAngle = (i / 3) * 0.8 - 0.4
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(s * 0.018, s * 0.025, s * 0.15, 4),
        legMat,
      )
      leg.position.set(side * s * 0.18, -s * 0.05, legAngle * s * 0.15)
      leg.rotation.z = side * 0.7
      g.add(leg)
    }

    const claw = new THREE.Mesh(new THREE.ConeGeometry(s * 0.035, s * 0.12, 4), bodyMat)
    claw.position.set(side * s * 0.3, -s * 0.03, 0)
    claw.rotation.z = side * 0.35
    g.add(claw)
  }

  for (let i = 0; i < 5; i++) {
    const debris = new THREE.Mesh(
      new THREE.SphereGeometry(s * 0.02 * (0.5 + Math.random() * 0.5), 4, 4),
      debrisMat,
    )
    debris.position.set(
      (Math.random() - 0.5) * s * 0.25,
      s * 0.05 + Math.random() * s * 0.06,
      (Math.random() - 0.5) * s * 0.15,
    )
    g.add(debris)
  }

  return g
}

function createGiantSquid(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0.3,
  })
  const armMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    roughness: 0.6,
  })
  const suckerMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.6),
    roughness: 0.7,
  })

  const body = new THREE.Mesh(new THREE.ConeGeometry(s * 0.25, s * 0.5, 10), bodyMat)
  body.rotation.x = Math.PI / 2
  g.add(body)

  const head = new THREE.Mesh(new THREE.SphereGeometry(s * 0.18, 8, 8), bodyMat)
  head.position.set(0, 0, -s * 0.25)
  g.add(head)

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const armLen = s * (0.5 + (i < 2 ? 0.4 : 0))
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(angle) * s * 0.15, 0, -s * 0.28),
      new THREE.Vector3(Math.cos(angle) * s * 0.25, 0, -s * 0.28 - armLen * 0.5),
      new THREE.Vector3(Math.cos(angle + 0.1) * s * 0.15, 0, -s * 0.28 - armLen),
    ])
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 6, s * 0.025, 6, false), armMat)
    g.add(tube)

    for (let j = 0; j < 4; j++) {
      const t = (j + 1) / 5
      const pt = curve.getPoint(t)
      const sucker = new THREE.Mesh(new THREE.SphereGeometry(s * 0.012, 4, 4), suckerMat)
      sucker.position.copy(pt)
      sucker.position.add(new THREE.Vector3(Math.cos(angle) * s * 0.01, 0, 0))
      g.add(sucker)
    }
  }

  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111 })
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(s * 0.04, 6, 6), eyeMat)
    eye.position.set(side * s * 0.1, s * 0.02, -s * 0.28)
    g.add(eye)
  }

  return g
}

// ── GROUP 5 — RESOLUTIONS ──

function createLeatherbackTurtle(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.05 })
  const shellMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.7),
    roughness: 0.9,
    flatShading: true,
  })
  const legMat = new THREE.MeshStandardMaterial({ color: tintColor(color, 0.6), roughness: 0.9 })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.25, 8, 6), bodyMat)
  body.scale.set(1.4, 0.5, 1.0)
  g.add(body)

  const shell = new THREE.Mesh(new THREE.SphereGeometry(s * 0.32, 10, 8), shellMat)
  shell.scale.set(1.2, 0.5, 0.9)
  shell.position.y = s * 0.1
  g.add(shell)

  const ridgeMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.55),
    roughness: 0.9,
  })
  for (let i = 0; i < 3; i++) {
    const a = (i / 2 - 0.5) * 0.6
    const ridge = new THREE.Mesh(
      new THREE.CylinderGeometry(s * 0.015, s * 0.02, s * 0.06, 4),
      ridgeMat,
    )
    ridge.position.set(0, s * 0.18, a * s * 0.2)
    g.add(ridge)
  }

  const legPositions: [number, number, number][] = [
    [-s * 0.25, -s * 0.08, -s * 0.2],
    [-s * 0.25, -s * 0.08, s * 0.2],
    [s * 0.25, -s * 0.08, -s * 0.2],
    [s * 0.25, -s * 0.08, s * 0.2],
  ]
  for (const [x, y, z] of legPositions) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.05, s * 0.06, s * 0.1, 6), legMat)
    leg.position.set(x, y, z)
    g.add(leg)
  }

  return g
}

function createGreenSeaTurtle(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.1 })
  const shellMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.7),
    roughness: 0.8,
    flatShading: true,
  })
  const legMat = new THREE.MeshStandardMaterial({ color: tintColor(color, 0.6), roughness: 0.8 })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.22, 8, 6), bodyMat)
  body.scale.set(1.3, 0.5, 0.9)
  g.add(body)

  const shell = new THREE.Mesh(new THREE.SphereGeometry(s * 0.28, 10, 8), shellMat)
  shell.scale.set(1.15, 0.55, 0.9)
  shell.position.y = s * 0.08
  g.add(shell)

  const patternMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.5),
    roughness: 0.8,
  })
  for (let i = 0; i < 4; i++) {
    const a = (i / 4 - 0.5) * 0.5
    const patch = new THREE.Mesh(
      new THREE.SphereGeometry(s * 0.03, 4, 4),
      patternMat,
    )
    patch.position.set(0, s * 0.15, a * s * 0.2)
    patch.scale.set(0.8, 0.2, 0.8)
    g.add(patch)
  }

  const head = new THREE.Mesh(new THREE.SphereGeometry(s * 0.06, 6, 6), bodyMat)
  head.position.set(0, -s * 0.02, -s * 0.22)
  g.add(head)

  const legPositions: [number, number, number][] = [
    [-s * 0.22, -s * 0.05, -s * 0.15],
    [-s * 0.22, -s * 0.05, s * 0.15],
    [s * 0.22, -s * 0.05, -s * 0.15],
    [s * 0.22, -s * 0.05, s * 0.15],
  ]
  for (const [x, y, z] of legPositions) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.045, s * 0.055, s * 0.09, 6), legMat)
    leg.position.set(x, y, z)
    g.add(leg)
  }

  return g
}

function createNautilus(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const shellMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.3,
    metalness: 0.2,
    flatShading: true,
  })
  const tentacleMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.8),
    roughness: 0.6,
  })

  const shell = new THREE.Mesh(new THREE.TorusGeometry(s * 0.15, s * 0.06, 10, 16), shellMat)
  shell.rotation.x = Math.PI / 2
  shell.rotation.z = Math.PI / 4
  g.add(shell)

  const innerShell = new THREE.Mesh(
    new THREE.TorusGeometry(s * 0.09, s * 0.025, 8, 12),
    new THREE.MeshStandardMaterial({
      color: tintColor(color, 0.6),
      roughness: 0.4,
      metalness: 0.1,
    }),
  )
  innerShell.rotation.x = Math.PI / 2
  innerShell.rotation.z = Math.PI / 4
  g.add(innerShell)

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.06, 6, 6), tentacleMat)
  body.position.set(0, 0, -s * 0.2)
  g.add(body)

  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2
    const tentacle = new THREE.Mesh(
      new THREE.CylinderGeometry(s * 0.005, s * 0.008, s * 0.12, 4),
      tentacleMat,
    )
    tentacle.position.set(Math.cos(angle) * s * 0.06, 0, -s * 0.22)
    tentacle.rotation.z = -angle
    g.add(tentacle)
  }

  return g
}

function createCleanerWrasse(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.2 })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.08, 8, 6), bodyMat)
  body.scale.set(2, 0.35, 0.35)
  g.add(body)

  const head = new THREE.Mesh(new THREE.ConeGeometry(s * 0.04, s * 0.08, 4), bodyMat)
  head.position.set(-s * 0.25, 0, 0)
  head.rotation.x = Math.PI / 2
  g.add(head)

  const stripeMat = new THREE.MeshStandardMaterial({
    color: '#06B6D4',
    emissive: '#06B6D4',
    emissiveIntensity: 0.5,
  })
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(s * 0.005, s * 0.025, s * 0.3),
    stripeMat,
  )
  stripe.position.set(0, s * 0.03, 0)
  g.add(stripe)

  const tail = new THREE.Mesh(new THREE.ConeGeometry(s * 0.025, s * 0.06, 4), bodyMat)
  tail.position.set(0, 0, s * 0.18)
  tail.rotation.x = Math.PI / 2
  g.add(tail)

  const finMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  })
  for (const side of [-1, 1]) {
    const fin = new THREE.Mesh(new THREE.ConeGeometry(s * 0.02, s * 0.06, 4), finMat)
    fin.position.set(side * s * 0.12, -s * 0.01, 0)
    fin.rotation.z = side * 0.3
    g.add(fin)
  }

  return g
}

function createBaskingShark(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.2 })
  const finMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    roughness: 0.5,
    side: THREE.DoubleSide,
  })
  const mouthMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.6),
    roughness: 0.8,
    side: THREE.DoubleSide,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.35, 14, 10), bodyMat)
  body.scale.set(2, 0.8, 0.8)
  g.add(body)

  const head = new THREE.Mesh(new THREE.ConeGeometry(s * 0.2, s * 0.3, 8), bodyMat)
  head.position.set(-s * 0.6, 0, 0)
  head.rotation.x = Math.PI / 2
  g.add(head)

  const mouth = new THREE.Mesh(new THREE.ConeGeometry(s * 0.15, s * 0.12, 8), mouthMat)
  mouth.position.set(-s * 0.75, 0, 0)
  mouth.rotation.x = -Math.PI / 2
  g.add(mouth)

  const dorsalGeo = new THREE.BufferGeometry()
  const dv = new Float32Array([0, s * 0.35, 0, 0, s * 0.25, s * 0.25, 0, s * 0.05, -s * 0.2])
  dorsalGeo.setAttribute('position', new THREE.BufferAttribute(dv, 3))
  dorsalGeo.computeVertexNormals()
  const dorsal = new THREE.Mesh(dorsalGeo, finMat)
  dorsal.position.set(0, s * 0.22, 0.1)
  g.add(dorsal)

  const tailGeo = new THREE.BufferGeometry()
  const tv = new Float32Array([
    0, s * 0.2, s * 0.4,
    -s * 0.4, 0, s * 0.55,
    0, 0, s * 0.4,
    0, s * 0.2, s * 0.4,
    0, 0, s * 0.4,
    s * 0.4, 0, s * 0.55,
  ])
  tailGeo.setAttribute('position', new THREE.BufferAttribute(tv, 3))
  tailGeo.computeVertexNormals()
  const tail = new THREE.Mesh(tailGeo, finMat)
  tail.position.set(0, 0, 0)
  g.add(tail)

  for (const side of [-1, 1]) {
    const pectoral = new THREE.Mesh(
      new THREE.ConeGeometry(s * 0.06, s * 0.2, 4),
      finMat,
    )
    pectoral.position.set(side * s * 0.3, -s * 0.05, 0.15)
    pectoral.rotation.z = side * 0.3
    g.add(pectoral)
  }

  return g
}

// ── AMBIENT WORLD LIFE (Group 0) ──

function createPilotFish(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3 })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.1, 8, 6), bodyMat)
  body.scale.set(2, 0.4, 0.4)
  g.add(body)

  const head = new THREE.Mesh(new THREE.ConeGeometry(s * 0.05, s * 0.1, 4), bodyMat)
  head.position.set(-s * 0.25, 0, 0)
  head.rotation.x = Math.PI / 2
  g.add(head)

  const stripeMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.5),
    roughness: 0.4,
  })
  const stripe1 = new THREE.Mesh(
    new THREE.BoxGeometry(s * 0.005, s * 0.015, s * 0.25),
    stripeMat,
  )
  stripe1.position.set(0, s * 0.025, 0)
  g.add(stripe1)

  const stripe2 = stripe1.clone()
  stripe2.position.set(0, -s * 0.025, 0)
  g.add(stripe2)

  const tail = new THREE.Mesh(new THREE.ConeGeometry(s * 0.03, s * 0.08, 4), bodyMat)
  tail.position.set(0, 0, s * 0.2)
  tail.rotation.x = Math.PI / 2
  g.add(tail)

  const finMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    side: THREE.DoubleSide,
  })
  const dorsal = new THREE.Mesh(
    new THREE.ConeGeometry(s * 0.02, s * 0.06, 4),
    finMat,
  )
  dorsal.position.set(0, s * 0.06, 0.05)
  dorsal.rotation.x = Math.PI / 2
  g.add(dorsal)

  return g
}

function createCombJellyfish(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 0.25,
    roughness: 0.1,
    metalness: 0.1,
    side: THREE.DoubleSide,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.25, 12, 10), bodyMat)
  body.scale.set(0.8, 0.8, 1.2)
  g.add(body)

  const ciliaColors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#9b59b6']
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const ciliaMat = new THREE.MeshStandardMaterial({
      color: ciliaColors[i % ciliaColors.length] as string,
      emissive: ciliaColors[i % ciliaColors.length] as string,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.6,
    })
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(s * 0.003, s * 0.005, s * 0.3, 4),
      ciliaMat,
    )
    band.position.set(Math.cos(angle) * s * 0.22, 0, Math.sin(angle) * s * 0.22)
    g.add(band)
  }

  return g
}

function createViperfish(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0.4,
    emissive: tintColor(color, 0.2),
    emissiveIntensity: 0.1,
  })
  const toothMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.12, 8, 6), bodyMat)
  body.scale.set(2.5, 0.35, 0.35)
  g.add(body)

  const head = new THREE.Mesh(new THREE.ConeGeometry(s * 0.07, s * 0.15, 6), bodyMat)
  head.position.set(-s * 0.4, 0, 0)
  head.rotation.x = Math.PI / 2
  g.add(head)

  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const tooth = new THREE.Mesh(
        new THREE.ConeGeometry(s * 0.004, s * 0.03, 4),
        toothMat,
      )
      tooth.position.set(-s * 0.38 + i * s * 0.015, side * s * 0.01, 0)
      tooth.rotation.z = side * 0.2
      g.add(tooth)
    }
  }

  const lureMat = new THREE.MeshStandardMaterial({
    color: '#06B6D4',
    emissive: '#06B6D4',
    emissiveIntensity: 1.0,
  })
  const lure = new THREE.Mesh(new THREE.SphereGeometry(s * 0.02, 6, 6), lureMat)
  lure.position.set(-s * 0.25, s * 0.15, 0)
  g.add(lure)

  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(s * 0.003, s * 0.005, s * 0.1, 4),
    new THREE.MeshStandardMaterial({ color: tintColor(color, 0.7) }),
  )
  antenna.position.set(-s * 0.25, s * 0.06, 0)
  antenna.rotation.z = -0.3
  g.add(antenna)

  const tail = new THREE.Mesh(new THREE.ConeGeometry(s * 0.025, s * 0.1, 4), bodyMat)
  tail.position.set(0, 0, s * 0.2)
  tail.rotation.x = Math.PI / 2
  g.add(tail)

  return g
}

function createTelescopeOctopus(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 0.3,
    roughness: 0.3,
    metalness: 0.05,
  })
  const armMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    transparent: true,
    opacity: 0.25,
    roughness: 0.3,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.2, 10, 8), bodyMat)
  g.add(body)

  const eyeMat = new THREE.MeshStandardMaterial({
    color: '#06B6D4',
    emissive: '#06B6D4',
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.5,
  })
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(s * 0.08, 8, 8),
      eyeMat,
    )
    eye.position.set(side * s * 0.12, s * 0.06, -s * 0.12)
    g.add(eye)
  }

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(angle) * s * 0.15, -s * 0.1, Math.sin(angle) * s * 0.15),
      new THREE.Vector3(Math.cos(angle) * s * 0.25, -s * 0.25, Math.sin(angle) * s * 0.25),
      new THREE.Vector3(Math.cos(angle + 0.2) * s * 0.3, -s * 0.4, Math.sin(angle + 0.2) * s * 0.3),
    ])
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 5, s * 0.015, 4, false), armMat)
    g.add(tube)
  }

  return g
}

function createGiantIsopod(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.1 })
  const legMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.85),
    roughness: 0.8,
  })

  const body = new THREE.Mesh(new THREE.SphereGeometry(s * 0.15, 10, 8), bodyMat)
  body.scale.set(1.4, 0.6, 0.7)
  g.add(body)

  const segments = 5
  for (let i = 0; i < segments; i++) {
    const t = i / segments
    const seg = new THREE.Mesh(
      new THREE.SphereGeometry(s * 0.06 * (1 - t * 0.4), 6, 6),
      new THREE.MeshStandardMaterial({
        color: tintColor(color, 0.7 + t * 0.3),
        roughness: 0.8,
      }),
    )
    seg.position.set(0, -s * 0.02, -s * 0.12 - t * s * 0.12)
    seg.scale.set(1.3 - t * 0.3, 0.5, 0.7)
    g.add(seg)
  }

  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 7; i++) {
      const legAngle = (i / 6 - 0.5) * 0.5
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(s * 0.012, s * 0.018, s * 0.08, 4),
        legMat,
      )
      leg.position.set(side * s * 0.12, -s * 0.07, -s * 0.05 + legAngle * s * 0.2)
      leg.rotation.z = side * 0.5
      g.add(leg)
    }
  }

  const antennaMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.7),
    roughness: 0.6,
  })
  for (const side of [-1, 1]) {
    const ant = new THREE.Mesh(
      new THREE.CylinderGeometry(s * 0.004, s * 0.006, s * 0.1, 4),
      antennaMat,
    )
    ant.position.set(side * s * 0.06, s * 0.04, s * 0.12)
    ant.rotation.z = side * 0.5
    g.add(ant)
  }

  return g
}

function createWhaleFallEcosystem(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const boneMat = new THREE.MeshStandardMaterial({
    color: '#e8e0d0',
    roughness: 0.9,
    metalness: 0.05,
  })
  const sedimentMat = new THREE.MeshStandardMaterial({
    color: tintColor(color, 0.3),
    roughness: 1.0,
  })

  const spine = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.02, s * 0.04, s * 0.8, 6), boneMat)
  spine.rotation.x = Math.PI / 2
  g.add(spine)

  const ribCount = 8
  for (let i = 0; i < ribCount; i++) {
    const t = (i / (ribCount - 1) - 0.5) * s * 0.7
    for (const side of [-1, 1]) {
      const rib = new THREE.Mesh(
        new THREE.CylinderGeometry(s * 0.008, s * 0.015, s * 0.12, 4),
        boneMat,
      )
      rib.position.set(side * s * 0.07, 0, t)
      rib.rotation.z = side * 0.6
      g.add(rib)
    }
  }

  const skull = new THREE.Mesh(new THREE.SphereGeometry(s * 0.1, 8, 6), boneMat)
  skull.scale.set(0.8, 0.6, 1)
  skull.position.set(0, 0, -s * 0.45)
  g.add(skull)

  for (let i = 0; i < 12; i++) {
    const scatter = new THREE.Mesh(
      new THREE.SphereGeometry(s * 0.01 * (0.3 + Math.random() * 0.7), 4, 4),
      sedimentMat,
    )
    scatter.position.set(
      (Math.random() - 0.5) * s * 0.5,
      -s * 0.05,
      (Math.random() - 0.5) * s * 0.6,
    )
    g.add(scatter)
  }

  const glowMat = new THREE.MeshStandardMaterial({
    color: '#06B6D4',
    emissive: '#06B6D4',
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.5,
  })
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2
    const worm = new THREE.Mesh(
      new THREE.CylinderGeometry(s * 0.005, s * 0.01, s * 0.1, 4),
      glowMat,
    )
    worm.position.set(Math.cos(a) * s * 0.15, s * 0.08, Math.sin(a) * s * 0.15 + s * 0.1)
    g.add(worm)
  }

  return g
}

function createFireflySquid(size: number, color: string): THREE.Group {
  const g = new THREE.Group()
  const s = size * 0.5
  const bodyMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.4,
    metalness: 0.2,
    emissive: tintColor(color, 0.2),
    emissiveIntensity: 0.2,
  })
  const glowMat = new THREE.MeshStandardMaterial({
    color: '#06B6D4',
    emissive: '#06B6D4',
    emissiveIntensity: 1.0,
  })

  const body = new THREE.Mesh(new THREE.ConeGeometry(s * 0.035, s * 0.1, 6), bodyMat)
  body.rotation.x = Math.PI / 2
  g.add(body)

  const head = new THREE.Mesh(new THREE.SphereGeometry(s * 0.02, 6, 6), bodyMat)
  head.position.set(0, 0, -s * 0.06)
  g.add(head)

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(s * 0.003, s * 0.005, s * 0.05, 4),
      bodyMat,
    )
    arm.position.set(Math.cos(angle) * s * 0.02, 0, -s * 0.07)
    arm.rotation.z = -angle * 0.3
    g.add(arm)
  }

  const glow = new THREE.Mesh(new THREE.SphereGeometry(s * 0.015, 6, 6), glowMat)
  glow.position.set(0, 0, -s * 0.1)
  g.add(glow)

  const fins = new THREE.Mesh(
    new THREE.ConeGeometry(s * 0.02, s * 0.04, 4),
    new THREE.MeshStandardMaterial({
      color: tintColor(color, 0.85),
      side: THREE.DoubleSide,
    }),
  )
  fins.position.set(0, 0, s * 0.05)
  fins.rotation.x = Math.PI / 2
  g.add(fins)

  return g
}

// ══════════════════════════════════════════════════════════════════════
//  SWARM / INSTANCING
// ══════════════════════════════════════════════════════════════════════

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
    case 'krill-swarm': {
      group = createKrillSwarm(size, color)
      break
    }
    case 'dinoflagellates': {
      group = createDinoflagellates(size, color)
      break
    }
    case 'copepods': {
      group = createCopepods(size, color)
      break
    }
    case 'herring-school': {
      group = createHerringSchool(size, color)
      break
    }
    case 'hammerhead-school': {
      group = createHammerheadSchool(size, color)
      break
    }
    case 'arrow-worms': {
      group = createArrowWorms(size, color)
      break
    }
    case 'amphipod-surge': {
      group = createAmphipodSurge(size, color)
      break
    }
    case 'firefly-squid': {
      group = createFireflySquid(size, color)
      break
    }
    default:
      return null
  }

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

// ══════════════════════════════════════════════════════════════════════
//  CREATE CREATURE — main entry point
// ══════════════════════════════════════════════════════════════════════

export function createCreature(config: CreatureConfig): THREE.Group {
  const group = new THREE.Group()

  const creatureFunctions: Record<CreatureType, (size: number, color: string) => THREE.Group> = {
    // LEGACY
    dolphin: createDolphin,
    jellyfish: createJellyfish,
    turtle: createTurtle,
    barracuda: createBarracuda,
    octopus: createOctopus,
    'manta-ray': createMantaRay,
    seahorse: createSeahorse,
    crab: createCrab,
    anglerfish: createAnglerfish,
    starfish: createStarfish,
    // GROUP 1 — BUILDERS
    'bottlenose-dolphin': createDolphin,
    'spinner-dolphin': createSpinnerDolphin,
    sailfish: createSailfish,
    'bluefin-tuna': createBluefinTuna,
    cuttlefish: createCuttlefish,
    'krill-swarm': createKrillSwarm,
    swordfish: createSwordfish,
    'herring-school': createHerringSchool,
    // GROUP 2 — ADMIRERS
    'moon-jellyfish': createMoonJellyfish,
    'lions-mane-jellyfish': createLionsManeJellyfish,
    dinoflagellates: createDinoflagellates,
    'sea-sparkle': createSeaSparkle,
    salps: createSalps,
    copepods: createCopepods,
    // GROUP 3 — OFFSPRING
    'whale-calf': createWhaleCalf,
    'hammerhead-school': createHammerheadSchool,
    'flying-fish': createFlyingFish,
    'amphipod-surge': createAmphipodSurge,
    // GROUP 4 — PROBLEMS
    'giant-pacific-octopus': createGiantPacificOctopus,
    lionfish: createLionfish,
    'moray-eel': createMorayEel,
    'mantis-shrimp': createMantisShrimp,
    'arrow-worms': createArrowWorms,
    'decorator-crab': createDecoratorCrab,
    'giant-squid': createGiantSquid,
    // GROUP 5 — RESOLUTIONS
    'leatherback-turtle': createLeatherbackTurtle,
    'green-sea-turtle': createGreenSeaTurtle,
    nautilus: createNautilus,
    'cleaner-wrasse': createCleanerWrasse,
    'basking-shark': createBaskingShark,
    // AMBIENT WORLD LIFE
    'pilot-fish': createPilotFish,
    'comb-jellyfish': createCombJellyfish,
    viperfish: createViperfish,
    'telescope-octopus': createTelescopeOctopus,
    'giant-isopod': createGiantIsopod,
    'whale-fall-ecosystem': createWhaleFallEcosystem,
    'firefly-squid': createFireflySquid,
  }

  const fn = creatureFunctions[config.type]
  if (!fn) {
    throw new Error(`Unknown creature type: ${config.type}`)
  }
  const creature = fn(config.size, config.color)
  creature.userData['creatureType'] = config.type
  creature.userData['dataPoint'] = config.type

  const populateSwarm = (
    count: number,
    creatureGroup: THREE.Group,
    orbitRadius: number,
    orbitSpeed: number,
    inclination: number,
    eccentricity: number,
  ) => {
    if (count <= 1) {
      creatureGroup.position.x = orbitRadius
      creatureGroup.userData['update'] = (time: number) => {
        const angle = time * orbitSpeed
        const r = orbitRadius * (1 + eccentricity * Math.cos(angle))
        creatureGroup.position.x = Math.cos(angle) * r
        creatureGroup.position.z = Math.sin(angle) * r
        creatureGroup.position.y = Math.sin(time * 2) * 0.3 + Math.sin(angle) * r * Math.sin(inclination)
        creatureGroup.rotation.y = -angle + Math.PI / 2
      }
      return creatureGroup
    }

    for (let i = 0; i < count; i++) {
      const instance = creatureGroup.clone()
      const offset = (i / count) * Math.PI * 2
      instance.position.x = orbitRadius
      instance.userData['orbitOffset'] = offset
      instance.userData['update'] = (time: number) => {
        const angle = time * orbitSpeed + offset
        const r = orbitRadius * (1 + eccentricity * Math.cos(angle))
        const x = Math.cos(angle) * r
        const z = Math.sin(angle) * r * (1 - Math.abs(eccentricity) * 0.3)
        instance.position.x = x
        instance.position.z = z
        instance.position.y = Math.sin(time * 2 + offset) * 0.3 + Math.sin(angle) * r * Math.sin(inclination)
        instance.rotation.y = -angle + Math.PI / 2
      }
      group.add(instance)
    }

    return creatureGroup
  }

  populateSwarm(
    config.count,
    creature,
    config.orbitRadius,
    config.orbitSpeed,
    config.inclination,
    config.eccentricity,
  )

  if (config.count <= 1) {
    group.add(creature)
  }

  return group
}
