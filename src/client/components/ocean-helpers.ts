import * as THREE from 'three'

export function createUnderwaterFog(
  scene: THREE.Scene,
  color: THREE.Color,
  density: number,
): void {
  scene.fog = new THREE.FogExp2(color, density)
}

export function createWaterSurface(radius: number, segments: number) {
  const geometry = new THREE.CircleGeometry(radius, segments)
  geometry.rotateX(-Math.PI / 2)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#06B6D4') },
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float wave1 = sin(pos.x * 0.5 + uTime * 0.8) * 0.15;
        float wave2 = cos(pos.z * 0.3 + uTime * 0.6) * 0.1;
        float wave3 = sin((pos.x + pos.z) * 0.4 + uTime * 1.2) * 0.08;
        pos.y += wave1 + wave2 + wave3;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float dist = length(vUv - 0.5);
        float alpha = smoothstep(0.5, 0.25, dist) * 0.5;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  return new THREE.Mesh(geometry, material)
}

export function createAmbientParticles(scene: THREE.Scene, count: number) {
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 40
    positions[i3 + 1] = Math.random() * -30 - 5
    positions[i3 + 2] = (Math.random() - 0.5) * 40
    sizes[i] = Math.random() * 0.15 + 0.05
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#88ddff') },
    },
    vertexShader: `
      uniform float uTime;
      attribute float size;
      varying float vAlpha;
      void main() {
        vec3 pos = position;
        pos.y += sin(uTime * 0.3 + position.x * 2.0) * 0.5;
        pos.x += sin(uTime * 0.2 + position.z * 1.5) * 0.3;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (200.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vAlpha = 0.3 + sin(uTime * 0.5 + position.x * 3.0 + position.z * 2.0) * 0.15;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)
  return points
}

export function createCoralCluster(
  position: THREE.Vector3,
  color: THREE.Color,
  size: number,
) {
  const group = new THREE.Group()
  const branchCount = 3 + Math.floor(Math.random() * 4)

  for (let i = 0; i < branchCount; i++) {
    const height = size * (0.5 + Math.random() * 0.8)
    const branchRadius = size * (0.1 + Math.random() * 0.15)
    const geometry = new THREE.ConeGeometry(branchRadius, height, 6)
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true,
    })
    const branch = new THREE.Mesh(geometry, material)

    const angle = (i / branchCount) * Math.PI * 2 + Math.random() * 0.3
    const tilt = 0.3 + Math.random() * 0.4
    branch.position.set(
      Math.cos(angle) * size * 0.2,
      height / 2,
      Math.sin(angle) * size * 0.2,
    )
    branch.rotation.z = Math.cos(angle) * tilt
    branch.rotation.x = Math.sin(angle) * tilt
    group.add(branch)
  }

  group.position.copy(position)
  return group
}
