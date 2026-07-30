import { ConvexProvider, ConvexReactClient } from "convex/react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@fontsource-variable/geist"
import "@fontsource-variable/geist-mono"
import "./index.css"
import Admin from "./admin.tsx"
import App from "./app.tsx"
import { ErrorBoundary } from "./error-boundary.tsx"
import { SiteLogo } from "./site-logo.tsx"

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

const isAdmin = window.location.pathname.startsWith("/admin")

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ErrorBoundary>
        <SiteLogo />
        {isAdmin ? <Admin /> : <App />}
      </ErrorBoundary>
    </ConvexProvider>
  </StrictMode>,
)
