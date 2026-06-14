import { useState, useEffect } from 'react'
import { Fish, Palette, Music, Waves, GitBranch, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConnectGitHub } from '@/client/components/connect-github'
import { appConfig } from '@/shared/config/app'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/client/lib/api-client'
import { useSession } from '@/client/lib/auth'

const WHALE_COLORS = [
  { label: 'Cyan', value: '#06B6D4' },
  { label: 'Teal', value: '#14B8A6' },
  { label: 'Sky', value: '#0EA5E9' },
  { label: 'Purple', value: '#8B5CF6' },
  { label: 'Pink', value: '#EC4899' },
]

export function GitSettingsPage() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  // 1. Get Ocean State
  const { data: oceanState } = useQuery<any>({
    queryKey: ['ocean-state'],
    queryFn: () => apiClient.get<any>('/api/ocean/state'),
  })

  // 2. Get GitHub Profile
  const { data: githubProfile } = useQuery<any>({
    queryKey: ['github-profile'],
    queryFn: () => apiClient.get<any>('/api/github/profile').catch(() => null),
  })

  // 3. Get Auth URL config
  const { data: authConfig } = useQuery<any>({
    queryKey: ['github-auth-url'],
    queryFn: () => apiClient.get<any>('/api/github/auth-url').catch(() => ({ configured: false })),
  })

  const [whaleColor, setWhaleColor] = useState('#06B6D4')
  const [musicEnabled, setMusicEnabled] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string | null>(null)

  useEffect(() => {
    if (oceanState?.whaleColor) {
      setWhaleColor(oceanState.whaleColor)
    }
  }, [oceanState])

  // 4. Update state mutation
  const updateStateMutation = useMutation({
    mutationFn: (body: any) => apiClient.put('/api/ocean/state', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ocean-state'] })
    },
  })

  // 5. Connect/disconnect mutations
  const disconnectMutation = useMutation({
    mutationFn: () => apiClient.post('/api/github/disconnect', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-profile'] })
      queryClient.invalidateQueries({ queryKey: ['ocean-repos'] })
      queryClient.invalidateQueries({ queryKey: ['geography-countries'] })
    },
  })

  const mockConnectMutation = useMutation({
    mutationFn: () => apiClient.post('/api/github/connect-mock', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-profile'] })
      syncMutation.mutate()
    },
  })

  const syncMutation = useMutation({
    mutationFn: () => apiClient.post('/api/ocean/sync', {}),
    onMutate: () => {
      setSyncStatus('Syncing ocean data...')
    },
    onSuccess: () => {
      setSyncStatus('Sync complete!')
      queryClient.invalidateQueries({ queryKey: ['ocean-repos'] })
      queryClient.invalidateQueries({ queryKey: ['geography-countries'] })
      setTimeout(() => setSyncStatus(null), 3000)
    },
    onError: (err) => {
      setSyncStatus(`Sync failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setTimeout(() => setSyncStatus(null), 5000)
    },
  })

  const handleColorChange = (color: string) => {
    setWhaleColor(color)
    updateStateMutation.mutate({ whaleColor: color })
  }

  const handleConnect = () => {
    if (authConfig?.configured && authConfig.url) {
      window.location.href = authConfig.url
    } else {
      mockConnectMutation.mutate()
    }
  }

  const isConnected = !!githubProfile?.profile
  const githubUsername = githubProfile?.profile?.login
  const githubAvatarUrl = githubProfile?.profile?.avatar_url
  const oceanDepth = oceanState?.oceanDepth ?? 0

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border/40 px-6 py-3">
        <Button asChild variant="ghost" size="icon">
          <Link to="/ocean">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <Fish className="size-5 text-primary" />
        <span className="text-sm font-semibold">{appConfig.name} Settings</span>
      </header>

      <div className="mx-auto max-w-2xl space-y-6 p-6">
        {/* Ocean Preferences */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="size-4 text-primary" />
              Ocean Preferences
            </CardTitle>
            <CardDescription>
              Customize your underwater experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Whale Color Picker */}
            <div>
              <label className="text-sm font-medium text-foreground">Whale Color</label>
              <div className="mt-2 flex gap-2">
                {WHALE_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleColorChange(c.value)}
                    className={`size-8 rounded-full border-2 transition-all ${
                      whaleColor === c.value
                        ? 'border-primary scale-110'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Ocean Depth */}
            <div>
              <label className="text-sm font-medium text-foreground">Ocean Depth</label>
              <p className="mt-1 text-xs text-muted-foreground">
                Current depth: <span className="font-mono font-medium text-foreground">{oceanDepth}</span> leagues
              </p>
            </div>

            {/* Music Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Ambient Ocean Music</span>
              </div>
              <button
                type="button"
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  musicEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
                    musicEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* GitHub Connection */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="size-4 text-primary" />
              GitHub Connection
            </CardTitle>
            <CardDescription>
              Manage your GitHub integration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <ConnectGitHub
                connected={isConnected}
                username={githubUsername}
                avatarUrl={githubAvatarUrl}
                onConnect={handleConnect}
                onDisconnect={() => disconnectMutation.mutate()}
              />
              {isConnected && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={syncMutation.isPending}
                  onClick={() => syncMutation.mutate()}
                >
                  <RefreshCw className={`size-3 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                  Sync Now
                </Button>
              )}
            </div>

            {!authConfig?.configured && !isConnected && (
              <div className="flex gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-600 dark:text-yellow-400">
                <AlertCircle className="size-4 shrink-0" />
                <div>
                  <p className="font-semibold">GitHub OAuth is not configured on the host server.</p>
                  <p className="mt-0.5">Clicking &quot;Connect GitHub&quot; will establish a simulated mock connection so you can explore all features with template repositories.</p>
                </div>
              </div>
            )}

            {syncStatus && (
              <p className="text-xs text-muted-foreground font-mono">{syncStatus}</p>
            )}
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Waves className="size-4 text-primary" />
              Account
            </CardTitle>
            <CardDescription>
              Account settings and data management.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Signed in as{' '}
              <span className="font-semibold text-foreground">
                {session?.user?.email || session?.user?.name || '--'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
