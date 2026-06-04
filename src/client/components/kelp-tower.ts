import * as THREE from 'three'
import { LOD_DISTANCES } from './lod-system'
import type { WorkflowStatus } from '@/client/hooks/use-ocean-data'

export interface KelpTowerConfig {
  height: number
  frondDensity: number
  color: string
  position: THREE.Vector3
  commitHistoryLength?: number
  lifetimeContributorCount?: number
  readmeQuality?: number
  ciCdPipelinesActive?: number
  openDiscussionsCount?: number
  releaseCount?: number
  downloadCount?: number
  lastReleaseRecency?: number
  repoAge?: number
  hasWiki?: boolean
  hasHomepage?: boolean
  hasChangelog?: boolean
  isPreRelease?: boolean
  readmeLength?: number
  closedDiscussionsCount?: number
  totalBranches?: number
  protectedBranches?: number
  hasPages?: boolean
  hasContributingGuide?: boolean
  hasCodeOfConduct?: boolean
  hasIssueTemplate?: boolean
  hasPRTemplate?: boolean
  hasProjects?: boolean
  hasDownloads?: boolean
  securityScanningActive?: boolean
  referringSites?: number
  workflowStatus?: WorkflowStatus
}

function buildBaseTower(
  height: number,
  color: THREE.Color,
  stepSize: number,
  leafStep: number,
  frondDensity: number,
  materials?: THREE.MeshStandardMaterial[],
  workflowStatus?: WorkflowStatus,
): THREE.Group {
  const group = new THREE.Group()

  const stalkMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0d9488'),
    roughness: 0.7,
    metalness: 0.1,
  })

  if (workflowStatus === 'success') {
    stalkMat.emissive = new THREE.Color('#10b981')
    stalkMat.emissiveIntensity = 0.4
  } else if (workflowStatus === 'failure') {
    stalkMat.color = new THREE.Color('#7f1d1d')
    stalkMat.emissive = new THREE.Color('#ef4444')
    stalkMat.emissiveIntensity = 0.6
  } else if (workflowStatus === 'cancelled') {
    stalkMat.color = new THREE.Color('#4b5563')
    stalkMat.emissive = new THREE.Color('#9ca3af')
    stalkMat.emissiveIntensity = 0.2
  }

  if (materials) {
    materials.push(stalkMat)
  }

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
    color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
    roughness: 0.8,
  })
  const baseLeafCount = Math.max(1, Math.floor(height / leafStep))
  const leafCount = Math.max(1, Math.round(baseLeafCount * frondDensity))
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

function addLegacyVisuals(group: THREE.Group, config: KelpTowerConfig): void {
  const { height } = config

  if (config.readmeQuality && config.readmeQuality > 0) {
    const quality = Math.min(config.readmeQuality, 1)
    const brainMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e8a87c'),
      roughness: 0.9,
      metalness: 0,
      flatShading: true,
    })
    const brain = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.08 + quality * 0.12, 2),
      brainMat,
    )
    brain.position.set(0.1, 0.02, 0.08)
    brain.scale.set(1, 0.6 + quality * 0.4, 1)
    group.add(brain)
  }

  if (config.ciCdPipelinesActive && config.ciCdPipelinesActive > 0) {
    const count = Math.min(Math.round(config.ciCdPipelinesActive), 6)
    const wormMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ff6b6b'),
      emissive: new THREE.Color('#ff6b6b'),
      emissiveIntensity: 0.5,
    })
    for (let i = 0; i < count; i++) {
      const worm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.015, 0.04 + Math.random() * 0.06, 4),
        wormMat,
      )
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3
      const radius = 0.06 + Math.random() * 0.04
      worm.position.set(Math.cos(angle) * radius, 0.02, Math.sin(angle) * radius)
      worm.rotation.z = (Math.random() - 0.5) * 0.3
      worm.rotation.x = (Math.random() - 0.5) * 0.3
      group.add(worm)
    }
  }

  if (config.openDiscussionsCount && config.openDiscussionsCount > 0) {
    const count = Math.min(Math.round(config.openDiscussionsCount), 10)
    const urchinMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2d3436'),
      roughness: 0.8,
      flatShading: true,
    })
    for (let i = 0; i < count; i++) {
      const urchin = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.02, 1),
        urchinMat,
      )
      const angle = Math.random() * Math.PI * 2
      const radius = 0.08 + Math.random() * 0.08
      urchin.position.set(
        Math.cos(angle) * radius,
        0.01 + Math.random() * 0.01,
        Math.sin(angle) * radius,
      )
      urchin.scale.set(1, 0.5 + Math.random() * 0.5, 1)
      group.add(urchin)
    }
  }

  if (config.releaseCount && config.releaseCount > 0) {
    const count = Math.min(Math.round(config.releaseCount), 8)
    const starMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#dfe6e9'),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    })
    for (let i = 0; i < count; i++) {
      const fan = new THREE.Mesh(
        new THREE.PlaneGeometry(0.04, 0.08),
        starMat.clone(),
      )
      const yPos = 0.3 + (i / count) * height * 0.7
      const angle = Math.random() * Math.PI * 2
      fan.position.set(
        Math.cos(angle) * 0.06,
        yPos,
        Math.sin(angle) * 0.06,
      )
      fan.rotation.x = Math.random() * Math.PI
      fan.rotation.z = Math.random() * Math.PI
      group.add(fan)
    }
  }

  if (config.downloadCount && config.downloadCount > 0) {
    const count = Math.min(Math.round(config.downloadCount / 100), 12)
    const ampMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#b2bec3'),
    })
    for (let i = 0; i < count; i++) {
      const amp = new THREE.Mesh(
        new THREE.SphereGeometry(0.005, 4, 4),
        ampMat,
      )
      const angle = Math.random() * Math.PI * 2
      const radius = 0.02 + Math.random() * 0.1
      amp.position.set(
        Math.cos(angle) * radius,
        0.005,
        Math.sin(angle) * radius,
      )
      group.add(amp)
    }
  }

  if (config.lastReleaseRecency !== undefined) {
    const glowIntensity = Math.max(0, 1 - Math.min(config.lastReleaseRecency, 1))
    const glowMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00cec9'),
      emissive: new THREE.Color('#00cec9'),
      emissiveIntensity: glowIntensity * 2,
      transparent: true,
      opacity: 0.3 + glowIntensity * 0.5,
    })
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      glowMat,
    )
    glow.position.y = height * 0.95
    glow.scale.set(1, 0.5, 1)
    group.add(glow)
  }

  if (config.repoAge && config.repoAge > 0) {
    const ringCount = Math.min(Math.round(config.repoAge), 10)
    const ringMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#636e72'),
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    })
    for (let i = 0; i < ringCount; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.04 + i * 0.002, 0.003, 4, 12),
        ringMat,
      )
      ring.position.y = (i / ringCount) * height
      ring.rotation.x = Math.PI / 2
      group.add(ring)
    }
  }

  if (config.hasWiki) {
    const spongeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fdcb6e'),
      roughness: 0.9,
      flatShading: true,
    })
    const sponge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.03, 0.06, 5),
      spongeMat,
    )
    sponge.position.set(0.06, height * 0.4, 0)
    sponge.scale.set(1, 0.6 + Math.random() * 0.4, 0.7 + Math.random() * 0.3)
    group.add(sponge)
  }

  if (config.hasHomepage) {
    const barnMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#dfe6e9'),
      roughness: 0.7,
    })
    const barnacle = new THREE.Mesh(
      new THREE.TorusGeometry(0.05, 0.008, 6, 12),
      barnMat,
    )
    barnacle.position.y = height * 0.2
    barnacle.rotation.x = Math.PI / 2
    group.add(barnacle)
  }

  if (config.hasChangelog) {
    const fishMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00b894'),
    })
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 6, 6),
      fishMat,
    )
    body.position.set(0.08, height * 0.15, 0)
    body.scale.set(1.5, 0.8, 0.8)
    group.add(body)
    const tail = new THREE.Mesh(
      new THREE.ConeGeometry(0.01, 0.02, 4),
      fishMat,
    )
    tail.position.set(0.1, height * 0.15, 0)
    tail.rotation.z = Math.PI / 2
    group.add(tail)
  }

  if (config.isPreRelease !== undefined) {
    const seahorseMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fdcb6e'),
    })
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 6, 6),
      seahorseMat,
    )
    head.position.set(-0.05, height * 0.5, 0.06)
    head.scale.set(0.8, 1.2, 0.8)
    group.add(head)
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.015, 0.03, 5),
      seahorseMat,
    )
    body.position.set(-0.04, height * 0.47, 0.06)
    group.add(body)
    const tail = new THREE.Mesh(
      new THREE.TorusGeometry(0.01, 0.003, 4, 8),
      seahorseMat,
    )
    tail.position.set(-0.025, height * 0.44, 0.06)
    tail.rotation.z = Math.PI / 2
    group.add(tail)
    if (!config.isPreRelease) {
      const anchorLine = new THREE.Mesh(
        new THREE.CylinderGeometry(0.002, 0.002, 0.04, 4),
        new THREE.MeshBasicMaterial({ color: 0xdfe6e9, transparent: true, opacity: 0.5 }),
      )
      anchorLine.position.set(-0.04, height * 0.42, 0.06)
      group.add(anchorLine)
    }
  }

  if (config.readmeLength && config.readmeLength > 0) {
    const shadowSize = Math.min(config.readmeLength / 1000, 1) * 0.3
    const shadowMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2d3436'),
      transparent: true,
      opacity: 0.15 * Math.min(config.readmeLength / 100, 1),
      side: THREE.DoubleSide,
    })
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.05 + shadowSize, 12),
      shadowMat,
    )
    shadow.position.y = -0.01
    shadow.rotation.x = -Math.PI / 2
    group.add(shadow)
  }

  if (config.closedDiscussionsCount && config.closedDiscussionsCount > 0) {
    const layerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#b2bec3'),
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    })
    const layer = new THREE.Mesh(
      new THREE.CircleGeometry(0.08, 8),
      layerMat,
    )
    layer.position.y = 0.03
    layer.rotation.x = -Math.PI / 2
    group.add(layer)
  }

  if (config.totalBranches && config.totalBranches > 0) {
    const count = Math.min(Math.round(config.totalBranches), 6)
    const fishMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#6c5ce7'),
    })
    for (let i = 0; i < count; i++) {
      const yPos = 0.3 + (i / count) * height * 0.6
      const angle = (i / count) * Math.PI * 2
      const fish = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 6, 6),
        fishMat,
      )
      fish.position.set(
        Math.cos(angle) * 0.1,
        yPos,
        Math.sin(angle) * 0.1,
      )
      fish.scale.set(1.5, 0.7, 0.7)
      group.add(fish)
      if (config.protectedBranches && i < Math.round(config.protectedBranches)) {
        const spine = new THREE.Mesh(
          new THREE.ConeGeometry(0.005, 0.015, 4),
          new THREE.MeshStandardMaterial({ color: new THREE.Color('#e17055') }),
        )
        spine.position.set(
          Math.cos(angle) * 0.1 + 0.02,
          yPos + 0.02,
          Math.sin(angle) * 0.1,
        )
        spine.rotation.z = Math.PI / 4
        group.add(spine)
      }
    }
  }

  if (config.hasPages) {
    const lionMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#636e72'),
    })
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 6, 6),
      lionMat,
    )
    body.position.set(0.12, height * 0.95, 0)
    body.scale.set(1.8, 0.7, 0.8)
    group.add(body)
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 6, 6),
      lionMat,
    )
    head.position.set(0.17, height * 0.96, 0)
    group.add(head)
  }

  if (config.hasContributingGuide) {
    const stationMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00b894'),
      transparent: true,
      opacity: 0.5,
    })
    const station = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.005, 0.08),
      stationMat,
    )
    station.position.set(-0.08, height * 0.6, 0.06)
    group.add(station)
    const wrasse = new THREE.Mesh(
      new THREE.ConeGeometry(0.008, 0.015, 4),
      new THREE.MeshStandardMaterial({ color: new THREE.Color('#fdcb6e') }),
    )
    wrasse.position.set(-0.06, height * 0.605, 0.06)
    wrasse.rotation.z = Math.PI / 4
    group.add(wrasse)
  }

  if (config.hasCodeOfConduct) {
    const aneMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e84393'),
    })
    for (let i = 0; i < 5; i++) {
      const tentacle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.002, 0.005, 0.04, 4),
        aneMat,
      )
      const angle = (i / 5) * Math.PI * 2
      tentacle.position.set(
        Math.cos(angle) * 0.05,
        0.02,
        Math.sin(angle) * 0.05,
      )
      tentacle.rotation.x = Math.cos(angle) * 0.3
      tentacle.rotation.z = Math.sin(angle) * 0.3
      group.add(tentacle)
    }
  }

  if (config.hasIssueTemplate) {
    const isoMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#636e72'),
      flatShading: true,
    })
    for (let i = 0; i < 4; i++) {
      const seg = new THREE.Mesh(
        new THREE.SphereGeometry(0.008, 5, 5),
        isoMat,
      )
      seg.position.set(-0.1, 0.01 + i * 0.008, -0.05)
      seg.scale.set(1.5, 0.6, 1.2)
      group.add(seg)
    }
  }

  if (config.hasPRTemplate) {
    const nudiMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#fd79a8'),
    })
    const nudi = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.015, 0.025, 5),
      nudiMat,
    )
    nudi.position.set(0.07, height * 0.35, 0.04)
    nudi.rotation.x = Math.PI / 3
    group.add(nudi)
    const cerataMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e17055'),
    })
    for (let i = 0; i < 3; i++) {
      const cer = new THREE.Mesh(
        new THREE.SphereGeometry(0.003, 4, 4),
        cerataMat,
      )
      cer.position.set(
        0.07 + (i - 1) * 0.008,
        height * 0.355 + (i - 1) * 0.005,
        0.05,
      )
      group.add(cer)
    }
  }

  if (config.hasProjects) {
    const polypMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e17055'),
    })
    for (let i = 0; i < 6; i++) {
      const polyp = new THREE.Mesh(
        new THREE.SphereGeometry(0.004, 4, 4),
        polypMat,
      )
      const angle = Math.random() * Math.PI * 2
      const radius = 0.02 + Math.random() * 0.06
      polyp.position.set(
        Math.cos(angle) * radius,
        0.04 + Math.random() * 0.02,
        Math.sin(angle) * radius,
      )
      group.add(polyp)
    }
  }

  if (config.hasDownloads) {
    const lanternMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00cec9'),
      emissive: new THREE.Color('#00cec9'),
      emissiveIntensity: 0.8,
    })
    const lantern = new THREE.Mesh(
      new THREE.SphereGeometry(0.01, 6, 6),
      lanternMat,
    )
    lantern.position.set(-0.04, height * 0.8, -0.06)
    lantern.scale.set(1.5, 0.6, 0.6)
    group.add(lantern)
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#00cec9'),
      transparent: true,
      opacity: 0.15,
    })
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 6, 6),
      glowMat,
    )
    glow.position.copy(lantern.position)
    group.add(glow)
  }

  if (config.securityScanningActive) {
    const lureMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00b894'),
      emissive: new THREE.Color('#00b894'),
      emissiveIntensity: 1.0,
    })
    const lure = new THREE.Mesh(
      new THREE.SphereGeometry(0.008, 6, 6),
      lureMat,
    )
    lure.position.set(-0.08, 0.05, 0.08)
    group.add(lure)
    const stalk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.002, 0.002, 0.04, 4),
      new THREE.MeshBasicMaterial({ color: 0x636e72 }),
    )
    stalk.position.set(-0.06, 0.03, 0.08)
    stalk.rotation.x = 0.5
    stalk.rotation.z = -0.3
    group.add(stalk)
  }

  if (config.workflowStatus && config.workflowStatus !== 'unknown') {
    const glowColors: Record<string, string> = {
      success: '#00b894',
      failure: '#ff6b6b',
      cancelled: '#fdcb6e',
    }
    const gc = glowColors[config.workflowStatus] ?? '#636e72'
    const glowRingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(gc),
      emissive: new THREE.Color(gc),
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    })
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.07, 0.008, 8, 16),
      glowRingMat,
    )
    ring.position.y = 0.01
    ring.rotation.x = Math.PI / 2
    group.add(ring)
  }

  if (config.referringSites && config.referringSites > 0) {
    const count = Math.min(Math.round(config.referringSites), 8)
    const schoolMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#74b9ff'),
    })
    const angleOffset = Math.random() * Math.PI * 2
    for (let i = 0; i < count; i++) {
      const fish = new THREE.Mesh(
        new THREE.ConeGeometry(0.006, 0.012, 4),
        schoolMat,
      )
      const t = i / count
      const spread = 0.08
      fish.position.set(
        -0.1 + Math.cos(angleOffset + t * 2) * spread,
        height * 0.7 + t * 0.1,
        0.1 + Math.sin(angleOffset + t * 2) * spread,
      )
      fish.rotation.z = -Math.PI / 2 + Math.cos(angleOffset + t * 2) * 0.3
      group.add(fish)
    }
  }
}

export function createKelpTower(config: KelpTowerConfig): THREE.LOD {
  const c = new THREE.Color(config.color)

  const lod = new THREE.LOD()
  const materials: THREE.MeshStandardMaterial[] = []

  const highTower = buildBaseTower(
    config.height,
    c,
    0.6,
    0.7,
    config.frondDensity,
    materials,
    config.workflowStatus,
  )
  addLegacyVisuals(highTower, config)
  lod.addLevel(highTower, 0)

  const mediumTower = buildBaseTower(
    config.height,
    c,
    1.0,
    1.2,
    config.frondDensity * 0.7,
    materials,
    config.workflowStatus,
  )
  lod.addLevel(mediumTower, LOD_DISTANCES.high)

  const lowTower = buildBaseTower(
    config.height,
    c,
    1.5,
    2.0,
    config.frondDensity * 0.4,
    materials,
    config.workflowStatus,
  )
  lod.addLevel(lowTower, LOD_DISTANCES.medium)

  lod.position.copy(config.position)

  if (config.workflowStatus === 'success') {
    lod.userData['update'] = (time: number) => {
      const intensity = 0.2 + 0.3 * Math.sin(time * 2.5)
      for (const mat of materials) {
        mat.emissiveIntensity = intensity
      }
    }
  } else if (config.workflowStatus === 'failure') {
    lod.userData['update'] = (time: number) => {
      const intensity = 0.3 + 0.5 * Math.sin(time * 6.0)
      for (const mat of materials) {
        mat.emissiveIntensity = intensity
      }
    }
  } else if (config.workflowStatus === 'cancelled') {
    lod.userData['update'] = (time: number) => {
      const intensity = 0.1 + 0.15 * Math.sin(time * 1.5)
      for (const mat of materials) {
        mat.emissiveIntensity = intensity
      }
    }
  }

  return lod
}
