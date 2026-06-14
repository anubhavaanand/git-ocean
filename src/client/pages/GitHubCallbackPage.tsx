import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/client/lib/api-client'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Fish } from 'lucide-react'

export function GitHubCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [status, setStatus] = useState('Connecting to GitHub...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      setError('No authorization code found in callback URL.')
      return
    }

    async function handleCallback() {
      try {
        setStatus('Exchanging OAuth code...')
        await apiClient.post('/api/github/connect', { code })

        setStatus('Syncing your repositories and creatures...')
        await apiClient.post('/api/ocean/sync', {})

        // Invalidate queries so that the fresh sync data is loaded
        queryClient.invalidateQueries({ queryKey: ['ocean-repos'] })
        queryClient.invalidateQueries({ queryKey: ['geography-countries'] })
        queryClient.invalidateQueries({ queryKey: ['github-profile'] })

        setStatus('Redirecting to your ocean...')
        setTimeout(() => {
          navigate('/ocean')
        }, 1000)
      } catch (err) {
        console.error('OAuth callback handler failed:', err)
        setError(err instanceof Error ? err.message : 'Failed to connect your GitHub account.')
      }
    }

    handleCallback()
  }, [searchParams, navigate, queryClient])

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/40 bg-card/60 backdrop-blur-xl">
        <CardHeader className="flex flex-col items-center gap-2 text-center pb-2">
          <Fish className="size-8 text-primary animate-pulse" />
          <CardTitle className="text-lg">Git Ocean Sync</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
          {error ? (
            <div className="space-y-4">
              <p className="text-sm text-destructive font-medium">{error}</p>
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Go back to settings
              </button>
            </div>
          ) : (
            <>
              <Spinner size="md" className="text-primary" />
              <p className="text-xs text-muted-foreground font-mono">{status}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
