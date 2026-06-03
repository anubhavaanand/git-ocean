import { Globe, Building2, Languages, Radio, Waves } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OceanLayout } from '@/client/components/ocean-layout'
import { useWorldMapData } from '@/client/hooks/use-world-map-data'

const FEATURE_PREVIEWS = [
  {
    icon: Building2,
    title: 'Capital Clusters',
    description: 'Developers grouped by country — see where the code is written, city by city.',
  },
  {
    icon: Languages,
    title: 'Language Districts',
    description: 'Programming languages radiating from city centers like cultural districts.',
  },
  {
    icon: Radio,
    title: 'Sonar Obelisks',
    description: 'Community landmarks that pulse with activity from popular repositories.',
  },
]

export function WorldMapPage() {
  const { countries, loading } = useWorldMapData()

  return (
    <OceanLayout>
      <div className="flex w-full max-w-3xl flex-col items-center gap-8 px-4 py-12">
        {/* Hero */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Globe className="size-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            <span className="text-primary">World</span> Map
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Explore GitHub activity across the globe. Watch contributions surface from every corner of the world.
          </p>
        </div>

        {/* Phase 2 coming soon */}
        <Card className="w-full border-dashed border-primary/30 bg-primary/5 backdrop-blur-sm">
          <CardHeader className="pb-3 text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-base">
              <Waves className="size-4 text-primary/60" />
              <span className="text-primary/60">Coming in Phase 2</span>
              <Waves className="size-4 text-primary/60" />
            </CardTitle>
            <CardDescription>
              A full 3D globe will render here with real-time geographic GitHub data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-2">
              {countries.map((c) => (
                <span
                  key={c.code}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm"
                >
                  <span className="font-semibold text-foreground">{c.code}</span>
                  {c.name} ({c.repoCount} repos, {c.contributorCount} contributors)
                </span>
              ))}
            </div>
            {loading && (
              <p className="mt-3 text-center text-xs text-muted-foreground">Loading geographic data...</p>
            )}
          </CardContent>
        </Card>

        {/* Feature preview cards */}
        <div className="grid w-full gap-4 sm:grid-cols-3">
          {FEATURE_PREVIEWS.map((f) => {
            const Icon = f.icon
            return (
              <Card
                key={f.title}
                className="border-border/40 bg-background/40 backdrop-blur-sm transition-colors hover:border-primary/30"
              >
                <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </OceanLayout>
  )
}
