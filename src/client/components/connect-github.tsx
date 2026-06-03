import { GitBranch } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConnectGitHubProps {
  connected?: boolean
  username?: string
  avatarUrl?: string
  onConnect?: () => void
  onDisconnect?: () => void
}

export function ConnectGitHub({
  connected = false,
  username,
  onConnect,
  onDisconnect,
}: ConnectGitHubProps) {
  if (connected && username) {
    return (
      <div className="flex items-center gap-2">
        <GitBranch className="size-4 text-primary" />
        <span className="text-sm text-foreground">{username}</span>
        <Button
          variant="ghost"
          size="xs"
          onClick={onDisconnect}
          className="text-muted-foreground hover:text-destructive"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onConnect}
      className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
    >
      <GitBranch className="size-4" />
      Connect GitHub
    </Button>
  )
}
