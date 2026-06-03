import { useState, useEffect } from 'react'
import { Vote, Palette, Clock, Plus, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface SkinModelConfig {
  color: string
  height: number
  rings: number
  glowColor: string
  tipColor: string
  pattern: string
}

interface Skin {
  id: string
  name: string
  description: string | null
  modelConfig: SkinModelConfig
  createdBy: string
  createdAt: string
  epoch: number
  voteCount: number
}

interface EpochInfo {
  epoch: number
  startDate: string
  endDate: string
  active: boolean
  remainingDays: number
}

interface ObeliskVotePanelProps {
  countryCode: string
}

export function ObeliskVotePanel({ countryCode }: ObeliskVotePanelProps) {
  const [skins, setSkins] = useState<Skin[]>([])
  const [epoch, setEpoch] = useState<EpochInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBrowser, setShowBrowser] = useState(false)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [submitName, setSubmitName] = useState('')
  const [submitDescription, setSubmitDescription] = useState('')
  const [submitColor, setSubmitColor] = useState('#06B6D4')
  const [submitHeight, setSubmitHeight] = useState(1.2)
  const [submitRings, setSubmitRings] = useState(3)
  const [selectedSkinId, setSelectedSkinId] = useState<string | null>(null)
  const [activeSkin, setActiveSkin] = useState<Skin | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [countryCode])

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const [epochRes, skinsRes, activeRes] = await Promise.all([
        fetch('/api/obelisk/epochs/current'),
        fetch('/api/obelisk/skins'),
        fetch(`/api/obelisk/${countryCode}/active-skin`),
      ])

      if (epochRes.ok) setEpoch(await epochRes.json() as EpochInfo)
      if (skinsRes.ok) setSkins(await skinsRes.json() as Skin[])
      if (activeRes.ok) setActiveSkin(await activeRes.json() as Skin)
    } catch {
      setError('Failed to load obelisk voting data')
    } finally {
      setLoading(false)
    }
  }

  async function handleVote(skinId: string) {
    setError(null)
    try {
      const res = await fetch(`/api/obelisk/skins/${skinId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryCode }),
      })

      if (res.status === 409) {
        setError('Already voted for this skin on this country')
        return
      }

      if (!res.ok) {
        setError('Failed to submit vote')
        return
      }

      setSelectedSkinId(skinId)
      loadData()
    } catch {
      setError('Failed to submit vote')
    }
  }

  async function handleSubmitSkin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch('/api/obelisk/skins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: submitName,
          description: submitDescription || undefined,
          modelConfig: {
            color: submitColor,
            height: submitHeight,
            rings: submitRings,
            glowColor: submitColor,
            tipColor: '#ffffff',
            pattern: 'standard',
          },
        }),
      })

      if (!res.ok) {
        setError('Failed to submit skin')
        return
      }

      setShowSubmitForm(false)
      setSubmitName('')
      setSubmitDescription('')
      setSubmitColor('#06B6D4')
      setSubmitHeight(1.2)
      setSubmitRings(3)
      loadData()
    } catch {
      setError('Failed to submit skin')
    }
  }

  if (loading) {
    return (
      <Card className="border-primary/20 bg-background/70 backdrop-blur-xl">
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Vote className="size-4 text-primary" />
            Obelisk Skins
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-xs text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-background/70 backdrop-blur-xl">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Vote className="size-4 text-primary" />
          Obelisk Skins
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-3">
        {epoch && (
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Clock className="size-3" />
            <span>Epoch {epoch.epoch} — {epoch.remainingDays} days remaining</span>
          </div>
        )}

        {error && (
          <p className="text-[10px] text-destructive">{error}</p>
        )}

        {activeSkin && (
          <div>
            <p className="text-[10px] text-muted-foreground">Active Skin</p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className="inline-block size-3 rounded-full border border-border/40"
                style={{ backgroundColor: activeSkin.modelConfig.color }}
              />
              <span className="text-xs font-medium">{activeSkin.name}</span>
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5 text-xs"
          onClick={() => setShowBrowser(!showBrowser)}
        >
          <Palette className="size-3" />
          {showBrowser ? 'Hide Skins' : 'Browse Skins'}
          {showBrowser ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        </Button>

        {showBrowser && (
          <div className="max-h-48 space-y-1.5 overflow-y-auto">
            {skins.length === 0 && (
              <p className="py-2 text-center text-[10px] text-muted-foreground">
                No skins available yet. Be the first to submit!
              </p>
            )}
            {skins.map((skin) => (
              <div
                key={skin.id}
                className="flex items-center justify-between rounded-md border border-border/20 px-2 py-1.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block size-3 rounded-full border border-border/40"
                    style={{ backgroundColor: skin.modelConfig.color }}
                  />
                  <div>
                    <p className="text-xs font-medium">{skin.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {skin.voteCount} vote{skin.voteCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <Button
                  variant={selectedSkinId === skin.id ? 'default' : 'outline'}
                  size="sm"
                  className="size-7"
                  onClick={() => handleVote(skin.id)}
                  disabled={selectedSkinId === skin.id}
                >
                  {selectedSkinId === skin.id ? <Check className="size-3" /> : <Vote className="size-3" />}
                </Button>
              </div>
            ))}
          </div>
        )}

        {showSubmitForm ? (
          <form onSubmit={handleSubmitSkin} className="space-y-2">
            <Input
              placeholder="Skin name"
              value={submitName}
              onChange={(e) => setSubmitName(e.target.value)}
              className="h-7 text-xs"
              required
            />
            <Textarea
              placeholder="Description (optional)"
              value={submitDescription}
              onChange={(e) => setSubmitDescription(e.target.value)}
              className="h-14 text-xs"
            />
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-muted-foreground">Color</label>
              <input
                type="color"
                value={submitColor}
                onChange={(e) => setSubmitColor(e.target.value)}
                className="size-6 cursor-pointer rounded border border-border/40"
              />
              <label className="text-[10px] text-muted-foreground">Height</label>
              <Input
                type="number"
                step="0.1"
                min="0.5"
                max="3"
                value={submitHeight}
                onChange={(e) => setSubmitHeight(Number(e.target.value))}
                className="h-7 w-16 text-xs"
              />
              <label className="text-[10px] text-muted-foreground">Rings</label>
              <Input
                type="number"
                min="1"
                max="6"
                value={submitRings}
                onChange={(e) => setSubmitRings(Number(e.target.value))}
                className="h-7 w-12 text-xs"
              />
            </div>
            <div className="flex gap-1">
              <Button type="submit" size="sm" className="flex-1 gap-1 text-xs">
                <Plus className="size-3" /> Submit
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setShowSubmitForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5 text-xs"
            onClick={() => setShowSubmitForm(true)}
          >
            <Plus className="size-3" />
            Submit New Skin
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
