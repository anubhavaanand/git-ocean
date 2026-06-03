import { describe, it, expect } from 'vitest'
import { getDefaultSkin, getCitySkinTheme } from '@/server/services/obelisk-service'

describe('getDefaultSkin', () => {
  it('returns default id', async () => {
    const skin = await getDefaultSkin()
    expect(skin.id).toBe('default')
  })

  it('has name Silicon Wafer Tower', async () => {
    const skin = await getDefaultSkin()
    expect(skin.name).toBe('Silicon Wafer Tower')
  })

  it('description mentions silicon dioxide', async () => {
    const skin = await getDefaultSkin()
    expect(skin.description).toContain('SiO2')
    expect(skin.description?.toLowerCase()).toContain('silicon dioxide')
  })

  it('model config has all required fields', async () => {
    const skin = await getDefaultSkin()
    const mc = skin.modelConfig
    expect(mc).toHaveProperty('color')
    expect(mc).toHaveProperty('height')
    expect(mc).toHaveProperty('rings')
    expect(mc).toHaveProperty('glowColor')
    expect(mc).toHaveProperty('tipColor')
    expect(mc).toHaveProperty('pattern')
  })

  it('model config has expected values', async () => {
    const skin = await getDefaultSkin()
    expect(skin.modelConfig.color).toBe('#06B6D4')
    expect(skin.modelConfig.height).toBe(1.2)
    expect(skin.modelConfig.rings).toBe(3)
    expect(skin.modelConfig.glowColor).toBe('#06B6D4')
    expect(skin.modelConfig.tipColor).toBe('#ffffff')
    expect(skin.modelConfig.pattern).toBe('crystal-lattice')
  })

  it('has rawOreColor, refinedColor, crystallineColor', async () => {
    const skin = await getDefaultSkin()
    expect(skin.modelConfig.rawOreColor).toBe('#1a1a2e')
    expect(skin.modelConfig.refinedColor).toBe('#3a6ea5')
    expect(skin.modelConfig.crystallineColor).toBe('#6ab0e6')
  })

  it('has scientificExplanation', async () => {
    const skin = await getDefaultSkin()
    expect(skin.scientificExplanation).toBeTruthy()
    expect(skin.scientificExplanation).toContain('SiO2')
  })

  it('has system as createdBy', async () => {
    const skin = await getDefaultSkin()
    expect(skin.createdBy).toBe('system')
  })

  it('has epoch 0', async () => {
    const skin = await getDefaultSkin()
    expect(skin.epoch).toBe(0)
  })
})

describe('getCitySkinTheme', () => {
  describe('python → coral theme', () => {
    it('maps python to coral', async () => {
      const result = await getCitySkinTheme('any-city', 'python')
      expect(result.color).toBe('#ff6b6b')
    })

    it('maps python to coral with all fields', async () => {
      const result = await getCitySkinTheme('any-city', 'python')
      expect(result).toMatchObject({
        color: '#ff6b6b',
        pattern: 'reef-structure',
        tipColor: '#ffd700',
      })
    })
  })

  describe('ruby → coral theme', () => {
    it('maps ruby to coral', async () => {
      const result = await getCitySkinTheme('any-city', 'ruby')
      expect(result.color).toBe('#ff6b6b')
    })

    it('maps ruby to coral with reef pattern', async () => {
      const result = await getCitySkinTheme('any-city', 'ruby')
      expect(result.pattern).toBe('reef-structure')
    })
  })

  describe('c++ → abyssal theme', () => {
    it('maps c++ to abyssal', async () => {
      const result = await getCitySkinTheme('any-city', 'c++')
      expect(result.color).toBe('#1a1a3e')
    })

    it('maps c++ to abyssal with deep-thermal pattern', async () => {
      const result = await getCitySkinTheme('any-city', 'c++')
      expect(result.pattern).toBe('deep-thermal')
      expect(result.tipColor).toBe('#00ff88')
    })
  })

  describe('rust → abyssal theme', () => {
    it('maps rust to abyssal', async () => {
      const result = await getCitySkinTheme('any-city', 'rust')
      expect(result.color).toBe('#1a1a3e')
    })

    it('maps rust to abyssal with correct colors', async () => {
      const result = await getCitySkinTheme('any-city', 'rust')
      expect(result.rawOreColor).toBe('#0d0d1a')
      expect(result.refinedColor).toBe('#2a2a4e')
      expect(result.crystallineColor).toBe('#4a4a7e')
    })
  })

  describe('typescript → tech theme', () => {
    it('maps typescript to tech', async () => {
      const result = await getCitySkinTheme('any-city', 'typescript')
      expect(result.color).toBe('#00d4ff')
    })

    it('maps typescript to tech with circuit-board pattern', async () => {
      const result = await getCitySkinTheme('any-city', 'typescript')
      expect(result.pattern).toBe('circuit-board')
      expect(result.tipColor).toBe('#76ff03')
    })
  })

  describe('go → tech theme', () => {
    it('maps go to tech', async () => {
      const result = await getCitySkinTheme('any-city', 'go')
      expect(result.color).toBe('#00d4ff')
    })

    it('maps go to tech with correct raw ore color', async () => {
      const result = await getCitySkinTheme('any-city', 'go')
      expect(result.rawOreColor).toBe('#0a1628')
    })
  })

  describe('javascript → silicon theme', () => {
    it('maps javascript to silicon', async () => {
      const result = await getCitySkinTheme('any-city', 'javascript')
      expect(result.color).toBe('#4a90d9')
    })

    it('maps javascript to silicon with crystal-lattice pattern', async () => {
      const result = await getCitySkinTheme('any-city', 'javascript')
      expect(result.pattern).toBe('crystal-lattice')
    })
  })

  describe('unknown language → silicon theme', () => {
    it('maps unknown language to silicon', async () => {
      const result = await getCitySkinTheme('any-city', 'elixir')
      expect(result.color).toBe('#4a90d9')
    })

    it('maps empty string to silicon', async () => {
      const result = await getCitySkinTheme('any-city', '')
      expect(result.color).toBe('#4a90d9')
    })
  })

  describe('case insensitive', () => {
    it('handles uppercase PYTHON', async () => {
      const result = await getCitySkinTheme('any-city', 'PYTHON')
      expect(result.color).toBe('#ff6b6b')
    })

    it('handles mixed case TypeScript', async () => {
      const result = await getCitySkinTheme('any-city', 'TypeScript')
      expect(result.color).toBe('#00d4ff')
    })

    it('handles uppercase C++', async () => {
      const result = await getCitySkinTheme('any-city', 'C++')
      expect(result.color).toBe('#1a1a3e')
    })

    it('handles uppercase GO', async () => {
      const result = await getCitySkinTheme('any-city', 'GO')
      expect(result.color).toBe('#00d4ff')
    })

    it('handles mixed case Ruby', async () => {
      const result = await getCitySkinTheme('any-city', 'Ruby')
      expect(result.color).toBe('#ff6b6b')
    })
  })
})
