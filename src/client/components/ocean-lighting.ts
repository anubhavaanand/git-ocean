import { Scene, HemisphereLight, DirectionalLight } from 'three'

export function setupOceanLighting(scene: Scene) {
  const ambient = new HemisphereLight('#1a5276', '#0a1628', 0.6)
  scene.add(ambient)

  const light = new DirectionalLight('#ffffff', 0.8)
  light.position.set(0, 15, 5)
  light.castShadow = true
  light.shadow.mapSize.width = 1024
  light.shadow.mapSize.height = 1024
  scene.add(light)

  return { ambient, light }
}
