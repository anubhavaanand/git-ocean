export interface WhaleOrbitConfig {
  id: number
  orbitRadius: number
  speed: number
  scale: number
}

export interface CreatureOrbitConfig {
  id: number
  parentId: number
  orbitRadius: number
  orbitSpeed: number
  eccentricity: number
  inclination: number
  offset: number
}

export interface WhaleOrbitResult {
  id: number
  x: number
  y: number
  z: number
  rotationY: number
}

export interface CreatureOrbitResult {
  id: number
  x: number
  y: number
  z: number
  rotationY: number
}

interface InitMessage {
  type: 'init'
  whales: WhaleOrbitConfig[]
  creatures: CreatureOrbitConfig[]
}

interface FrameMessage {
  type: 'frame'
  time: number
}

interface StopMessage {
  type: 'stop'
}

type WorkerMessage = InitMessage | FrameMessage | StopMessage

let whaleConfigs: WhaleOrbitConfig[] = []
let creatureConfigs: CreatureOrbitConfig[] = []

function computeWhalePositions(time: number): WhaleOrbitResult[] {
  return whaleConfigs.map((c) => {
    const angle = time * c.speed
    return {
      id: c.id,
      x: Math.cos(angle) * c.orbitRadius,
      y: Math.sin(time * 1.5) * c.scale * 0.1,
      z: Math.sin(angle) * c.orbitRadius,
      rotationY: -angle + Math.PI / 2,
    }
  })
}

function computeCreaturePositions(time: number): CreatureOrbitResult[] {
  return creatureConfigs.map((c) => {
    const angle = time * c.orbitSpeed + c.offset
    const r = c.orbitRadius * (1 + c.eccentricity * Math.cos(angle))
    return {
      id: c.id,
      x: Math.cos(angle) * r,
      y: Math.sin(time * 2 + c.offset) * 0.3 + Math.sin(angle) * r * Math.sin(c.inclination),
      z: Math.sin(angle) * r * (1 - Math.abs(c.eccentricity) * 0.3),
      rotationY: -angle + Math.PI / 2,
    }
  })
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data

  switch (msg.type) {
    case 'init':
      whaleConfigs = msg.whales
      creatureConfigs = msg.creatures
      break

    case 'frame':
      self.postMessage({
        type: 'positions',
        whales: computeWhalePositions(msg.time),
        creatures: computeCreaturePositions(msg.time),
      })
      break

    case 'stop':
      whaleConfigs = []
      creatureConfigs = []
      break
  }
}
