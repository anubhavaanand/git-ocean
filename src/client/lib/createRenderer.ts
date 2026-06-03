import * as THREE from 'three'

export type RendererVariant = 'webgpu' | 'webgl'

export interface RendererResult {
  renderer: THREE.WebGLRenderer
  variant: RendererVariant
  cleanup: () => void
}

export async function createRenderer(
  options: THREE.WebGLRendererParameters = {},
  preferredVariant?: RendererVariant,
): Promise<RendererResult> {
  const useWebGPU = preferredVariant === 'webgpu'
    || (!preferredVariant && typeof navigator !== 'undefined' && 'gpu' in navigator)

  if (useWebGPU) {
    try {
      const THREE_WGPU = await import('three/webgpu')
      const adapter = await navigator.gpu?.requestAdapter()
      if (adapter) {
        const renderer = new THREE_WGPU.WebGPURenderer({
          antialias: options.antialias ?? true,
          alpha: options.alpha,
        })
        await renderer.init()
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        return {
          renderer: renderer as unknown as THREE.WebGLRenderer,
          variant: 'webgpu',
          cleanup: () => renderer.dispose(),
        }
      }
    } catch {
      // WebGPU failed — fall through to WebGL
    }
  }

  const renderer = new THREE.WebGLRenderer({
    antialias: options.antialias ?? true,
    alpha: options.alpha,
    powerPreference: options.powerPreference ?? 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  return {
    renderer,
    variant: 'webgl',
    cleanup: () => renderer.dispose(),
  }
}
