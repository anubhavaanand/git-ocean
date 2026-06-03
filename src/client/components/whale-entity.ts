import * as THREE from 'three'

export type WhaleSpecies = 'blue' | 'humpback' | 'sperm' | 'orca' | 'whale-shark'

const SPECIES_CFG: Record<WhaleSpecies, {
  scale: number
  bodyWidth: number
  bodyHeight: number
  bodyDepth: number
  dorsalHeight: number
}> = {
  blue:       { scale: 1.0, bodyWidth: 0.7, bodyHeight: 0.8, bodyDepth: 1.8, dorsalHeight: 0.35 },
  humpback:   { scale: 0.9, bodyWidth: 0.75, bodyHeight: 0.85, bodyDepth: 1.6, dorsalHeight: 0.25 },
  sperm:      { scale: 0.85, bodyWidth: 0.8, bodyHeight: 0.9, bodyDepth: 1.5, dorsalHeight: 0.15 },
  orca:       { scale: 0.7, bodyWidth: 0.65, bodyHeight: 0.7, bodyDepth: 1.7, dorsalHeight: 0.5 },
  'whale-shark': { scale: 1.3, bodyWidth: 0.85, bodyHeight: 0.7, bodyDepth: 1.6, dorsalHeight: 0.2 },
}

export interface WhaleConfig {
  size: number
  color: string
  songDialect: string
  activityLevel: number
  health: number
  species?: WhaleSpecies
  repoAge?: number
  languageBreakdown?: Array<{ name: string; percentage: number }>
  topics?: string[]
  topicsCount?: number
  licenseType?: string
  isPublic?: boolean
  isArchived?: boolean
  isFork?: boolean
  isTemplate?: boolean
  isDisabled?: boolean
  defaultBranch?: string
  communityHealth?: number
  advancedSecurity?: boolean
  fileCount?: number
  dependencyCount?: number
  forkSource?: string
}

export interface WhaleEntity extends THREE.Group {
  species: WhaleSpecies
  identityFeatures: Record<string, unknown>
  updatePosition(time: number, orbitRadius: number, speed: number): void
  setHealth(health: number): void
  setActivity(activity: number): void
  setSongDialect(dialect: string): void
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

  const species: WhaleSpecies = config.species ?? 'blue'
  const sc = SPECIES_CFG[species]
  const s = config.size * 0.3 * sc.scale

  const bodyColor = new THREE.Color(config.color)
  const finColor = bodyColor.clone().multiplyScalar(0.8)

  let roughness = 0.6
  let metalness = 0.3
  const licenseType = config.licenseType?.toLowerCase()
  if (licenseType === 'mit') { roughness = 0.3; metalness = 0.5 }
  else if (licenseType === 'gpl' || licenseType === 'gpl-2.0' || licenseType === 'gpl-3.0') { roughness = 0.9; metalness = 0.1 }
  else if (licenseType === 'apache' || licenseType === 'apache-2.0') { roughness = 0.7; metalness = 0.4 }
  else if (licenseType === undefined) { /* default */ }
  else { roughness = 0.8; metalness = 0.2 }

  const bodyMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    roughness,
    metalness,
  })
  const finMat = new THREE.MeshStandardMaterial({
    color: finColor,
    roughness: 0.7,
    metalness: 0.2,
    side: THREE.DoubleSide,
  })

  // Body - species-variant proportions
  const bodyGeo = new THREE.SphereGeometry(s * 0.5, 16, 12)
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.scale.set(sc.bodyWidth, sc.bodyHeight, sc.bodyDepth)
  body.castShadow = true
  group.add(body)

  // Tail fin - two triangular lobes
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

  // Dorsal fin - species-variant height
  const dorsal = new THREE.Mesh(
    createTriangle(
      new THREE.Vector3(0, s * sc.dorsalHeight, 0),
      new THREE.Vector3(0, s * sc.dorsalHeight * 0.9, s * 0.3),
      new THREE.Vector3(0, s * sc.dorsalHeight * 0.8, -s * 0.2),
    ),
    finMat,
  )
  group.add(dorsal)

  // Pectoral fins
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

  // Bioluminescent dots - public=glowing, private=dark matte
  const isPublic = config.isPublic ?? true
  const dotMat = new THREE.MeshStandardMaterial({
    color: isPublic ? '#06B6D4' : '#1a1a2e',
    emissive: isPublic ? '#06B6D4' : '#000000',
    emissiveIntensity: isPublic ? 0.8 : 0,
  })
  for (let i = 0; i < 6; i++) {
    const t = (i / 5) * 1.6 - 0.8
    const dot = new THREE.Mesh(new THREE.SphereGeometry(s * 0.04, 6, 6), dotMat)
    dot.position.set(t * s * 0.4, -s * 0.12, s * 0.45)
    group.add(dot)
    const dotMirror = dot.clone()
    dotMirror.position.set(t * s * 0.4, -s * 0.12, -s * 0.45)
    group.add(dotMirror)
  }

  // ── 14 Identity Features ──

  const identityFeatures: Record<string, unknown> = {}

  // 1. Zooxanthellae skin pattern — language breakdown as color mix
  if (config.languageBreakdown && config.languageBreakdown.length > 0) {
    const langColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c']
    config.languageBreakdown.forEach((lang, idx) => {
      const count = Math.max(1, Math.ceil(lang.percentage * 0.3))
      for (let j = 0; j < count; j++) {
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(s * 0.03, 4, 4),
          new THREE.MeshStandardMaterial({
            color: langColors[idx % langColors.length] ?? '#ffffff',
            emissive: langColors[idx % langColors.length] ?? '#ffffff',
            emissiveIntensity: 0.2,
          }),
        )
        const u = Math.random() * 2 - 1
        const v = Math.random() * 2 - 1
        const w = Math.random() * 2 - 1
        dot.position.set(u * s * 0.25, v * s * 0.2 + s * 0.1, w * s * 0.5)
        group.add(dot)
      }
    })
    identityFeatures['zooxanthellae'] = config.languageBreakdown.map(l => l.name)
  }

  // 2. Barnacles on skin — repo age, sphere cluster density
  if (config.repoAge !== undefined && config.repoAge > 0) {
    const density = Math.min(config.repoAge * 2, 30)
    const barnMat = new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.9 })
    for (let i = 0; i < density; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(s * 0.02 * (1 + Math.random()), 5, 5), barnMat)
      b.position.set(
        (Math.random() - 0.5) * s * 0.3,
        (Math.random() - 0.5) * s * 0.3 + s * 0.05,
        (Math.random() - 0.5) * s * 0.8,
      )
      group.add(b)
    }
    identityFeatures['barnacles'] = config.repoAge
  }

  // 3. Remora fish on belly — one per major dependency
  if (config.dependencyCount !== undefined && config.dependencyCount > 0) {
    const count = Math.min(config.dependencyCount, 8)
    const remMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.6 })
    for (let i = 0; i < count; i++) {
      const rem = new THREE.Mesh(new THREE.SphereGeometry(s * 0.04, 6, 6), remMat)
      rem.scale.set(1.5, 0.6, 0.6)
      rem.position.set(
        (Math.random() - 0.5) * s * 0.4,
        -s * 0.2 - s * 0.05,
        (Math.random() - 0.5) * s * 0.5,
      )
      group.add(rem)
    }
    identityFeatures['remoraCount'] = config.dependencyCount
  }

  // 4. Sea anemone clusters — topics as colored cylinder clusters on flanks
  if (config.topics && config.topics.length > 0) {
    const topicColors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#4caf50']
    config.topics.forEach((_topic, idx) => {
      const clusterMat = new THREE.MeshStandardMaterial({
        color: topicColors[idx % topicColors.length] ?? '#ffffff',
        emissive: topicColors[idx % topicColors.length] ?? '#ffffff',
        emissiveIntensity: 0.15,
      })
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.015, s * 0.025, s * 0.08, 5), clusterMat)
      const side = idx % 2 === 0 ? 1 : -1
      stalk.position.set(
        side * s * 0.3,
        s * 0.05 + Math.random() * s * 0.1,
        (Math.random() - 0.5) * s * 0.6,
      )
      stalk.rotation.z = side * 0.3
      group.add(stalk)
      const tip = new THREE.Mesh(
        new THREE.SphereGeometry(s * 0.02, 4, 4),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.1 }),
      )
      tip.position.copy(stalk.position)
      tip.position.y += s * 0.04
      group.add(tip)
    })
    identityFeatures['anemoneTopics'] = config.topics
  } else if (config.topicsCount !== undefined && config.topicsCount > 0) {
    const count = Math.min(config.topicsCount, 10)
    for (let i = 0; i < count; i++) {
      const stalk = new THREE.Mesh(
        new THREE.CylinderGeometry(s * 0.015, s * 0.025, s * 0.08, 5),
        new THREE.MeshStandardMaterial({ color: 0x9c27b0, emissive: 0x9c27b0, emissiveIntensity: 0.15 }),
      )
      const side = i % 2 === 0 ? 1 : -1
      stalk.position.set(side * s * 0.3, s * 0.05, (Math.random() - 0.5) * s * 0.6)
      stalk.rotation.z = side * 0.3
      group.add(stalk)
    }
    identityFeatures['anemoneCount'] = config.topicsCount
  }

  // 5. Whale skin texture — handled above via roughness/metalness from licenseType

  // 6. Bioluminescent patches — handled above via isPublic

  // 7. Feather star growth — file count as fan density
  if (config.fileCount !== undefined && config.fileCount > 0) {
    const fanCount = Math.min(Math.ceil(config.fileCount / 20), 20)
    const fanMat = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      emissive: 0xff6b6b,
      emissiveIntensity: 0.1,
      side: THREE.DoubleSide,
    })
    for (let i = 0; i < fanCount; i++) {
      const fan = new THREE.Mesh(new THREE.SphereGeometry(s * 0.025, 4, 4), fanMat)
      fan.scale.set(0.3, 0.8, 3 + Math.random() * 2)
      fan.position.set(
        (Math.random() - 0.5) * s * 0.3,
        s * 0.2 + Math.random() * s * 0.1,
        (Math.random() - 0.5) * s * 0.6,
      )
      group.add(fan)
    }
    identityFeatures['featherStars'] = config.fileCount
  }

  // 8. Sponge overgrowth — archived status
  if (config.isArchived) {
    const spongeCount = 15 + Math.floor(Math.random() * 10)
    const spongeMat = new THREE.MeshStandardMaterial({ color: 0xf4a460, roughness: 0.9, metalness: 0 })
    for (let i = 0; i < spongeCount; i++) {
      const sponge = new THREE.Mesh(new THREE.SphereGeometry(s * 0.04 * (0.5 + Math.random()), 5, 5), spongeMat)
      sponge.scale.set(1, 0.5 + Math.random() * 0.5, 1)
      sponge.position.set(
        (Math.random() - 0.5) * s * 0.5,
        s * 0.05 + Math.random() * s * 0.15,
        (Math.random() - 0.5) * s * 0.7,
      )
      group.add(sponge)
    }
    identityFeatures['spongeOvergrowth'] = true
  }

  // 9. Clownfish in anemone — forked from source
  if (config.isFork) {
    const clownMat = new THREE.MeshStandardMaterial({ color: 0xff6b35, emissive: 0xff6b35, emissiveIntensity: 0.2 })
    const clown = new THREE.Mesh(new THREE.SphereGeometry(s * 0.04, 6, 6), clownMat)
    clown.scale.set(1.2, 0.6, 0.6)
    clown.position.set(s * 0.15, s * 0.1, s * 0.3)
    group.add(clown)
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const stripe = new THREE.Mesh(new THREE.SphereGeometry(s * 0.025, 4, 4), stripeMat)
    stripe.scale.set(0.3, 0.5, 0.5)
    stripe.position.set(s * 0.15, s * 0.1, s * 0.33)
    group.add(stripe)
    identityFeatures['clownfish'] = config.forkSource ?? true
  }

  // 10. Portuguese Man O' War — is template
  if (config.isTemplate) {
    const floatMat = new THREE.MeshStandardMaterial({
      color: 0x9b59b6, emissive: 0x8e44ad, emissiveIntensity: 0.3,
      transparent: true, opacity: 0.7,
    })
    const tentacleMat = new THREE.MeshStandardMaterial({
      color: 0x7d3c98, transparent: true, opacity: 0.4,
    })
    const numBubbles = 4 + Math.floor(Math.random() * 3)
    for (let i = 0; i < numBubbles; i++) {
      const bub = new THREE.Mesh(new THREE.SphereGeometry(s * 0.03, 6, 6), floatMat)
      bub.position.set(s * 0.1 + i * s * 0.04, s * 0.2 + s * 0.02, s * 0.25)
      group.add(bub)
      const tent = new THREE.Mesh(
        new THREE.CylinderGeometry(s * 0.005, s * 0.005, s * 0.1, 3),
        tentacleMat,
      )
      tent.position.set(s * 0.1 + i * s * 0.04, s * 0.15, s * 0.25)
      group.add(tent)
    }
    identityFeatures['manOWar'] = true
  }

  // 11. Dorsal fin marking — default branch
  if (config.defaultBranch && config.defaultBranch !== 'main') {
    const isMaster = config.defaultBranch === 'master'
    const markMat = new THREE.MeshStandardMaterial({
      color: isMaster ? 0x888888 : 0xffaa00,
      emissive: isMaster ? 0x444444 : 0xff6600,
      emissiveIntensity: 0.2,
    })
    const mark = new THREE.Mesh(new THREE.SphereGeometry(s * 0.06, 6, 6), markMat)
    mark.position.set(0, s * sc.dorsalHeight * 1.1, s * 0.05)
    group.add(mark)
    identityFeatures['dorsalMark'] = config.defaultBranch
  }

  // 12. Water clarity — community health
  if (config.communityHealth !== undefined) {
    const clarityMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: Math.max(0, 1 - config.communityHealth) * 0.15,
      side: THREE.BackSide,
    })
    const clarity = new THREE.Mesh(new THREE.SphereGeometry(s * 1.5, 8, 8), clarityMat)
    group.add(clarity)
    identityFeatures['waterClarity'] = config.communityHealth
  }

  // 13. Disabled posture — whale partially buried (tilted)
  if (config.isDisabled) {
    group.rotation.x = 0.4
    group.rotation.z = 0.3
    const sandMat = new THREE.MeshStandardMaterial({
      color: 0x556b2f, roughness: 0.9, transparent: true, opacity: 0.3,
    })
    const sand = new THREE.Mesh(new THREE.SphereGeometry(s * 0.2, 6, 6), sandMat)
    sand.scale.set(2, 0.3, 1.5)
    sand.position.set(0, -s * 0.2, 0)
    group.add(sand)
    identityFeatures['disabled'] = true
  }

  // 14. Vampire Squid cloak — advanced security
  if (config.advancedSecurity) {
    const cloakMat = new THREE.MeshStandardMaterial({
      color: 0x8b0000,
      emissive: 0x8b0000,
      emissiveIntensity: 0.05,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      roughness: 0.3,
      metalness: 0.1,
    })
    const cloak = new THREE.Mesh(new THREE.SphereGeometry(s * 0.55, 12, 12), cloakMat)
    cloak.scale.set(sc.bodyWidth * 1.1, sc.bodyHeight * 1.1, sc.bodyDepth * 0.6)
    group.add(cloak)
    identityFeatures['vampireSquidCloak'] = true
  }

  // ── End Identity Features ──

  group.species = species
  group.identityFeatures = identityFeatures
  group.userData['songDialect'] = config.songDialect
  group.userData['activityLevel'] = config.activityLevel
  group.userData['health'] = config.health

  let activity = config.activityLevel
  let currentHealth = config.health

  group.updatePosition = function (time: number, orbitRadius: number, speed: number) {
    const angle = time * speed
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
    dotMat.emissiveIntensity = (isPublic ? 0.3 : 0) + level * (isPublic ? 0.7 : 0)
  }

  group.setHealth = function (health: number) {
    currentHealth = health
    group.userData['health'] = health
    const healthFactor = Math.max(0.3, health)
    bodyMat.color.copy(bodyColor).multiplyScalar(healthFactor)
  }

  group.setSongDialect = function (dialect: string) {
    group.userData['songDialect'] = dialect
  }

  void activity
  void currentHealth

  return group
}
