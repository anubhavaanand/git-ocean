import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { GitBranch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { OceanLayout } from '@/client/components/ocean-layout'
import { OceanComposer } from '@/client/components/ocean-composer'
import { useOceanData } from '@/client/hooks/use-ocean-data'
import { PageTransition } from '@/client/components/animations/page-transitions'
import { FloatAnimation } from '@/client/components/animations/float-animation'
import { StatsPanel } from '@/client/components/stats-panel'
import { CreatureLegend } from '@/client/components/creature-legend'
import { CreatureInfoPanel } from '@/client/components/creature-info-panel'

const MOCK_STATS = {
  reposConnected: 3,
  creaturesSpawned: 12,
  whaleLevel: 1,
  totalStars: 255,
  oceanDepth: 15,
}

export function OceanPage() {
  const [connected, setConnected] = useState(false)
  const [canvasEl, setCanvasEl] = useState<HTMLElement | null>(null)
  const [legendOpen, setLegendOpen] = useState(false)
  const [selectedCreature, setSelectedCreature] = useState<{
    type: string
    name: string
    dataPoint: string
    value: number
    description: string
  } | null>(null)

  const { repos, loading } = useOceanData()

  useEffect(() => {
    const el = document.getElementById('ocean-canvas')
    setCanvasEl(el)
  }, [])

  return (
    <OceanLayout>
      <PageTransition>
        {connected && canvasEl && createPortal(
          <OceanComposer repoData={repos} className="h-full w-full" />,
          canvasEl,
        )}

        {connected && createPortal(
          <StatsPanel stats={MOCK_STATS} />,
          document.body,
        )}

        {connected && createPortal(
          <CreatureInfoPanel
            creature={selectedCreature}
            onClose={() => setSelectedCreature(null)}
          />,
          document.body,
        )}

        {!connected ? (
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="max-w-lg space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Your repositories, <span className="text-primary">reimagined</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Connect your GitHub to watch your repos swim through an immersive 3D ocean.
              </p>
            </div>

            <FloatAnimation>
              <Button
                size="lg"
                onClick={() => setConnected(true)}
                className="gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                <GitBranch className="size-5" />
                Connect GitHub & dive in
              </Button>
            </FloatAnimation>

            <div className="grid grid-cols-3 gap-4">
              {(['Repos Connected', 'Creatures Spawned', 'Whale Level'] as const).map((label) => (
                <Card key={label} className="w-36 border-border/40 bg-background/40 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center gap-2 p-4">
                    <span className="text-lg font-bold tabular-nums text-primary">--</span>
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="pointer-events-none flex flex-col items-center gap-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">Diving into the ocean...</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {repos.length} repositories swimming
              </p>
            )}
          </div>
        )}
      </PageTransition>

      {/* Creature legend toggle — rendered inside OceanLayout */}
      {connected && (
        <div className="absolute bottom-4 right-4 z-20 rounded-xl border border-border/40 bg-background/60 px-3 py-2 backdrop-blur-xl">
          <CreatureLegend
            visible={legendOpen}
            onToggle={() => setLegendOpen((v) => !v)}
          />
        </div>
      )}
    </OceanLayout>
  )
}
