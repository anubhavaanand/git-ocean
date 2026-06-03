import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Fish, Settings, LayoutDashboard, Waves, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { appConfig } from '@/shared/config/app'
import { ConnectGitHub } from '@/client/components/connect-github'

interface OceanLayoutProps {
  children: ReactNode
}

const NAV_ITEMS = [
  { to: '/ocean', label: 'Ocean View', icon: Waves },
  { to: '/world', label: 'World Map', icon: Globe },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function OceanLayout({ children }: OceanLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="relative h-svh w-full overflow-hidden bg-background">
      {/* 3D Canvas placeholder / background */}
      <div id="ocean-canvas" className="absolute inset-0 z-0" />

      {/* Underwater ambient gradient overlay */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-background/20 to-background/60" />

      {/* Floating Top Bar */}
      <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between rounded-xl border border-border/40 bg-background/60 px-4 py-2 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground/70 hover:text-foreground"
          >
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
          <Link to="/ocean" className="flex items-center gap-2">
            <Fish className="size-5 text-primary" />
            <span className="text-sm font-semibold tracking-tight">{appConfig.name}</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ConnectGitHub />
        </div>
      </header>

      {/* Left Sidebar (collapsible) */}
      <aside
        className={cn(
          'absolute left-4 top-20 z-20 w-64 rounded-xl border border-border/40 bg-background/60 p-4 backdrop-blur-xl transition-all duration-300',
          sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-72 opacity-0 pointer-events-none',
        )}
      >
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:bg-accent/50 hover:text-foreground',
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main content area */}
      <main className="relative z-10 flex h-full items-center justify-center">
        {children}
      </main>

      {/* Bottom-right creature legend / toggle */}
      <div className="absolute bottom-4 right-4 z-20 rounded-xl border border-border/40 bg-background/60 px-3 py-2 backdrop-blur-xl">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Fish className="size-3.5 text-primary" />
          Creature Legend
        </span>
      </div>
    </div>
  )
}
