import { Component, type ReactNode } from "react"

// Catches any render-time error so a single bad value can never blank the whole
// page. The questionnaire auto-saves answers to localStorage on every step, so a
// reload recovers the user's place — their work is never lost here.
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error("[render error]", error)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <main className="flex min-h-screen items-center justify-center px-8 py-16">
        <div className="mx-auto flex w-full max-w-md flex-col gap-6">
          <div className="font-mono text-xs tracking-widest text-muted uppercase">
            Something went wrong
          </div>
          <h1 className="text-3xl font-light tracking-tight">Your answers are saved.</h1>
          <p className="text-sm leading-relaxed font-light text-muted">
            Something on this screen failed to load, but nothing you entered was lost. Reload to
            pick up where you left off.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="self-start border border-rule px-4 py-2 font-mono text-xs tracking-widest text-fg uppercase transition-colors hover:bg-fg hover:text-bg"
          >
            Reload
          </button>
        </div>
      </main>
    )
  }
}
