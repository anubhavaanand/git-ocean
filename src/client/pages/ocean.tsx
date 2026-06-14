import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { GitBranch, RefreshCw } from 'lucide-react'
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/client/lib/api-client'

export function OceanPage() {
  const queryClient = useQueryClient()
  const [canvasEl, setCanvasEl] = useState<HTMLElement | null>(null)
  const [legendOpen, setLegendOpen] = useState(false)
  const [selectedCreature, setSelectedCreature] = useState<{
    type: string
    name: string
    dataPoint: string
    value: number
    description: string
  } | null>(null)

  // 1. Get GitHub Profile
  const { data: githubProfile, isLoading: profileLoading } = useQuery<any>({
    queryKey: ['github-profile'],
    queryFn: () => apiClient.get<any>('/api/github/profile').catch(() => null),
  })

  // 2. Get Auth URL config
  const { data: authConfig } = useQuery<any>({
    queryKey: ['github-auth-url'],
    queryFn: () => apiClient.get<any>('/api/github/auth-url').catch(() => ({ configured: false })),
  })

  // 3. Get Ocean State
  const { data: oceanState } = useQuery<any>({
    queryKey: ['ocean-state'],
    queryFn: () => apiClient.get<any>('/api/ocean/state'),
  })

  // 4. Get Ocean Repos
  const { repos, loading: reposLoading } = useOceanData()

  useEffect(() => {
    const el = document.getElementById('ocean-canvas')
    setCanvasEl(el)
  }, [])

  // 5. Connect / sync mutations
  const mockConnectMutation = useMutation({
    mutationFn: () => apiClient.post('/api/github/connect-mock', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-profile'] })
      syncMutation.mutate()
    },
  })

  const syncMutation = useMutation({
    mutationFn: () => apiClient.post('/api/ocean/sync', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ocean-repos'] })
      queryClient.invalidateQueries({ queryKey: ['ocean-state'] })
      queryClient.invalidateQueries({ queryKey: ['geography-countries'] })
    },
  })

  const handleConnect = () => {
    if (authConfig?.configured && authConfig.url) {
      window.location.href = authConfig.url
    } else {
      mockConnectMutation.mutate()
    }
  }

  const isConnected = !!githubProfile?.profile
  const isSyncing = syncMutation.isPending || mockConnectMutation.isPending
  const isPageLoading = profileLoading || reposLoading

  // Calculate live stats
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0)
  const liveStats = {
    reposConnected: repos.length,
    creaturesSpawned: oceanState?.totalCreatures ?? 0,
    whaleLevel: oceanState?.whaleSize ?? 1,
    totalStars,
    oceanDepth: oceanState?.oceanDepth ?? 0,
  }

  return (
    <OceanLayout>
      <PageTransition>
        {isConnected && canvasEl && repos.length > 0 && createPortal(
          <OceanComposer repoData={repos} className="h-full w-full" />,
          canvasEl,
        )}

        {isConnected && repos.length > 0 && createPortal(
          <StatsPanel stats={liveStats} />,
          document.body,
        )}

        {isConnected && repos.length > 0 && createPortal(
          <CreatureInfoPanel
            creature={selectedCreature}
            onClose={() => setSelectedCreature(null)}
          />,
          document.body,
        )}

        {isPageLoading || isSyncing ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <RefreshCw className="size-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-mono">
              {isSyncing ? 'Syncing your ocean world...' : 'Diving into the ocean...'}
            </p>
          </div>
        ) : !isConnected ? (
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
                onClick={handleConnect}
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
        ) : isConnected && repos.length === 0 ? (
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="max-w-md space-y-3">
              <h2 className="text-xl font-semibold text-foreground">Your Ocean is Empty</h2>
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t find any repositories in your database. Let&apos;s sync them now!
              </p>
            </div>
            <Button
              onClick={() => syncMutation.mutate()}
              className="gap-2"
              disabled={syncMutation.isPending}
            >
              <RefreshCw className={`size-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
              Sync Ocean Data
            </Button>
          </div>
        ) : (
          <div className="pointer-events-none flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {repos.length} repositories swimming
            </p>
          </div>
        )}
      </PageTransition>

      {/* Creature legend toggle — rendered inside OceanLayout */}
      {isConnected && repos.length > 0 && (
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
