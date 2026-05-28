import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import "@fontsource-variable/geist"
import "@fontsource-variable/geist-mono"
import "./index.css"
import App from "./app.tsx"
import Admin from "./admin.tsx"
import { ErrorBoundary } from "./error-boundary.tsx"

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

const isAdmin = window.location.pathname.startsWith("/admin")

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ErrorBoundary>{isAdmin ? <Admin /> : <App />}</ErrorBoundary>
    </ConvexProvider>
  </StrictMode>,
)
