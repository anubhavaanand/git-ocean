import { useState } from 'react'
import { Fish, Palette, Music, Waves, GitBranch, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConnectGitHub } from '@/client/components/connect-github'
import { appConfig } from '@/shared/config/app'

const WHALE_COLORS = [
  { label: 'Cyan', value: '#06B6D4' },
  { label: 'Sky', value: '#0EA5E9' },
  { label: 'Teal', value: '#14B8A6' },
  { label: 'Purple', value: '#8B5CF6' },
  { label: 'Pink', value: '#EC4899' },
]

export function GitSettingsPage() {
  const [whaleColor, setWhaleColor] = useState('#06B6D4')
  const [oceanDepth] = useState(3)
  const [musicEnabled, setMusicEnabled] = useState(false)

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
        <Card>
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
              <label className="text-sm font-medium">Whale Color</label>
              <div className="mt-2 flex gap-2">
                {WHALE_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setWhaleColor(c.value)}
                    className={`size-8 rounded-full border-2 transition-all ${
                      whaleColor === c.value
                        ? 'border-foreground scale-110'
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
              <label className="text-sm font-medium">Ocean Depth</label>
              <p className="mt-1 text-xs text-muted-foreground">
                Current depth: {oceanDepth} leagues
              </p>
            </div>

            {/* Music Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Ambient Ocean Music</span>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GitBranch className="size-4 text-primary" />
              GitHub Connection
            </CardTitle>
            <CardDescription>
              Manage your GitHub integration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectGitHub />
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
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
              Signed in as <span className="text-foreground">--</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
