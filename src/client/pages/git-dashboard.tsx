import { Link } from 'react-router-dom'
import { Fish, GitBranch, Waves, Ship, Shell, Anchor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { appConfig } from '@/shared/config/app'
import { PageTransition } from '@/client/components/animations/page-transitions'
import { StaggerFade } from '@/client/components/animations/stagger-fade'
import { GlowPulse } from '@/client/components/animations/glow-pulse'

const FEATURES = [
  {
    icon: Fish,
    title: '3D Ocean Visualization',
    description: 'Your GitHub repos swim through a living underwater world. Each commit, PR, and issue becomes a unique sea creature.',
  },
  {
    icon: Anchor,
    title: 'GitHub Stats as Creatures',
    description: 'Stars become glowing jellyfish. Forks become schools of fish. Your contribution graph grows coral reefs.',
  },
  {
    icon: Ship,
    title: 'Explore the Depths',
    description: 'Dive deeper the more you contribute. Unlock rare creatures, discover hidden reefs, and level up your whale.',
  },
  {
    icon: Shell,
    title: 'Real-time Sync',
    description: 'Your ocean updates as your repos change. Watch new creatures spawn when you push code.',
  },
]

export function GitDashboardPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <PageTransition>
        {/* Nav */}
        <header className="flex items-center justify-between border-b border-border/40 px-6 py-3">
          <div className="flex items-center gap-2">
            <Fish className="size-5 text-primary" />
            <span className="text-sm font-semibold">{appConfig.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/ocean">Ocean View</Link>
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link to="/ocean">
                <GitBranch className="size-4" />
                Get Started
              </Link>
            </Button>
          </div>
        </header>

        {/* Hero */}
        <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <GlowPulse>
            <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <Waves className="size-8 text-primary" />
            </div>
          </GlowPulse>
          <h1 className="mb-4 max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Dive into Your{' '}
            <span className="text-primary">Repositories</span>
          </h1>
          <p className="mb-8 max-w-lg text-sm text-muted-foreground">
            {appConfig.name} transforms your GitHub activity into a living 3D ocean. Watch your repos swim,
            your commits evolve, and your contributions build an underwater world.
          </p>
          <Button asChild size="lg" className="gap-3 shadow-lg shadow-primary/20">
            <Link to="/ocean">
              <GitBranch className="size-5" />
              Connect GitHub & dive in
            </Link>
          </Button>
        </section>

        {/* Features */}
        <section className="border-t border-border/40 px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2">
            <StaggerFade staggerDelay={0.1}>
              {FEATURES.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="flex gap-4 rounded-xl border border-border/40 bg-card p-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </StaggerFade>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 px-6 py-4 text-center text-xs text-muted-foreground">
          {appConfig.footerText || `${appConfig.name} — Explore your code like never before.`}
        </footer>
      </PageTransition>
    </div>
  )
}
