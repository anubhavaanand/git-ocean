import { useState, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { Globe, Target, Users, Code2, X, Map as MapIcon, Waves, Languages, ZoomIn, ZoomOut } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OceanLayout } from '@/client/components/ocean-layout'
import { GlobeScene } from '@/client/components/globe-scene'
import type { ZoomLevel } from '@/client/components/globe-scene'
import { GlobeComposer } from '@/client/components/globe-composer'
import { ZOOM_LEVELS, clampToZoomLevel } from '@/client/components/globe-helpers'
import { useWorldMapData, type CountryData } from '@/client/hooks/use-world-map-data'
import { ObeliskVotePanel } from '@/client/components/obelisk-vote-panel'

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  Java: '#b07219',
  Go: '#00add8',
  Rust: '#dea584',
  'C++': '#00599c',
  'C#': '#178600',
  Ruby: '#cc342d',
  PHP: '#777bb4',
  Kotlin: '#a97bff',
}

export function WorldMapPage() {
  const { countries } = useWorldMapData()
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null)
  const [currentZoom, setCurrentZoom] = useState<ZoomLevel>('world')
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const updatablesRef = useRef<((time: number) => void)[]>([])

  const handleSceneReady = useCallback(
    (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
      sceneRef.current = scene
      cameraRef.current = camera
      rendererRef.current = renderer
    },
    [],
  )

  const handleZoomChange = useCallback((level: string) => {
    setCurrentZoom(level as ZoomLevel)
  }, [])

  const zoomIn = useCallback(() => {
    const cam = cameraRef.current
    if (!cam) return
    const current = cam.position.length()
    const targetDist = clampToZoomLevel(current)
    const idx = ZOOM_LEVELS.findIndex((z) => z.distance === targetDist)
    if (idx > 0) {
      const next = ZOOM_LEVELS[idx - 1]
      if (!next) return
      const dir = cam.position.clone().normalize()
      cam.position.copy(dir.multiplyScalar(next.distance))
      cam.updateProjectionMatrix()
    }
  }, [])

  const zoomOut = useCallback(() => {
    const cam = cameraRef.current
    if (!cam) return
    const current = cam.position.length()
    const targetDist = clampToZoomLevel(current)
    const idx = ZOOM_LEVELS.findIndex((z) => z.distance === targetDist)
    if (idx < ZOOM_LEVELS.length - 1) {
      const next = ZOOM_LEVELS[idx + 1]
      if (!next) return
      const dir = cam.position.clone().normalize()
      cam.position.copy(dir.multiplyScalar(next.distance))
      cam.updateProjectionMatrix()
    }
  }, [])

  const zoomLevelLabel = ZOOM_LEVELS.find((z) => z.level === currentZoom)?.label ?? 'World View'

  const totalRepos = countries.reduce((s, c) => s + c.repoCount, 0)
  const totalContributors = countries.reduce((s, c) => s + c.contributorCount, 0)
  const topCountries = [...countries].sort((a, b) => b.repoCount - a.repoCount).slice(0, 5)
  const topCountryCodes = new Set(topCountries.map((c) => c.code))
  const colonyCountries = countries.filter((c) => c.repoCount < 50).slice(0, 6)

  return (
    <OceanLayout>
      <div className="relative flex h-full w-full">
        {/* Globe canvas */}
        <div className="absolute inset-0">
          <GlobeScene
            className="h-full w-full"
            onSceneReady={handleSceneReady}
            updatables={updatablesRef}
            onZoomChange={handleZoomChange}
          />
          <GlobeComposer
            scene={sceneRef.current}
            camera={cameraRef.current}
            renderer={rendererRef.current}
            countries={countries}
          />
        </div>

        {/* Overlay UI */}
        <div className="pointer-events-none relative z-10 flex h-full w-full">
          {/* Left panels */}
          <div className="pointer-events-auto flex flex-col gap-3 p-4">
            <Card className="w-56 border-border/40 bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Globe className="size-4 text-primary" />
                  {zoomLevelLabel}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Code2 className="size-3" /> Repos
                  </span>
                  <span className="font-mono font-medium text-foreground">{totalRepos.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="size-3" /> Contributors
                  </span>
                  <span className="font-mono font-medium text-foreground">{totalContributors.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Target className="size-3" /> Countries
                  </span>
                  <span className="font-mono font-medium text-foreground">{countries.length}</span>
                </div>
                <div className="flex gap-1 pt-1">
                  <Button variant="outline" size="icon" className="size-7" onClick={zoomIn} title="Zoom In">
                    <ZoomIn className="size-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="size-7" onClick={zoomOut} title="Zoom Out">
                    <ZoomOut className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="w-56 border-border/40 bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-sm font-semibold">Top Regions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 pb-3">
                {topCountries.map((c, i) => (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCountry(c)}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-xs transition-colors hover:bg-primary/10 ${
                      selectedCountry?.code === c.code ? 'bg-primary/15 text-primary' : ''
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-4 text-right font-mono text-muted-foreground">{i + 1}</span>
                      <span className="font-medium">{c.code}</span>
                    </span>
                    <span className="font-mono text-muted-foreground">{c.repoCount}</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="w-56 border-border/40 bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Waves className="size-4 text-primary/60" />
                  <span className="text-primary/60">Ocean Colonies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 pb-3">
                {colonyCountries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCountry(c)}
                    className="flex w-full items-center justify-between rounded-md px-2 py-1 text-xs transition-colors hover:bg-primary/10"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Waves className="size-3 text-primary/40" />
                      <span>{c.name}</span>
                    </span>
                    <span className="font-mono text-muted-foreground">{c.repoCount}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right country detail panel */}
          {selectedCountry && (
            <div className="pointer-events-auto ml-auto flex flex-col gap-3 p-4">
              <Card className="w-72 border-primary/20 bg-background/70 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <MapIcon className="size-4 text-primary" />
                    {selectedCountry.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => setSelectedCountry(null)}
                  >
                    <X className="size-3" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Code2 className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Repositories</p>
                      <p className="font-mono text-lg font-bold text-foreground">
                        {selectedCountry.repoCount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Contributors</p>
                      <p className="font-mono text-lg font-bold text-foreground">
                        {selectedCountry.contributorCount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {selectedCountry.languageBreakdown && selectedCountry.languageBreakdown.length > 0 && (
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Languages className="size-3" /> Languages
                      </p>
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-border/30">
                        {selectedCountry.languageBreakdown.slice(0, 5).map((lang) => (
                          <div
                            key={lang.name}
                            className="h-full transition-all"
                            style={{
                              width: `${lang.percentage}%`,
                              backgroundColor: LANGUAGE_COLORS[lang.name] ?? '#06B6D4',
                            }}
                          />
                        ))}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                        {selectedCountry.languageBreakdown.slice(0, 5).map((lang) => (
                          <span key={lang.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <span
                              className="inline-block size-1.5 rounded-full"
                              style={{ backgroundColor: LANGUAGE_COLORS[lang.name] ?? '#06B6D4' }}
                            />
                            {lang.name} {lang.percentage}%
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Target className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Code</p>
                      <p className="font-mono text-sm font-medium text-foreground">{selectedCountry.code}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {topCountryCodes.has(selectedCountry.code) && (
                <ObeliskVotePanel countryCode={selectedCountry.code} />
              )}
            </div>
          )}
        </div>
      </div>
    </OceanLayout>
  )
}
