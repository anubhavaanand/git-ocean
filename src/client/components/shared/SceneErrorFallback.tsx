import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SceneErrorBoundaryProps {
  children: ReactNode
  sceneName: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface SceneErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  constructor(props: SceneErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): Partial<SceneErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[${this.props.sceneName}] 3D scene error:`, error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-background/40 p-8">
          <div className="flex flex-col items-center gap-4 text-center max-w-sm">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-6 text-destructive" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {this.props.sceneName} encountered an error
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                The 3D scene failed to render. This may be due to WebGL/WebGPU
                compatibility or a temporary issue.
              </p>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <div className="w-full rounded-md bg-muted p-2 text-[10px] font-mono text-muted-foreground overflow-auto max-h-20">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={this.handleRetry}>
                <RotateCcw className="mr-1.5 size-3" />
                Retry
              </Button>
              <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="mr-1.5 size-3" />
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
