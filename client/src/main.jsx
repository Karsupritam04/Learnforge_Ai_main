import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App.jsx'
import './index.css'

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE
const auth0Configured = Boolean(auth0Domain && auth0ClientId)

function Root() {
  const tree = (
    <HashRouter>
      <App />
    </HashRouter>
  )

  // Milestone 4: only wrap with Auth0Provider once real credentials are supplied.
  // Until then the app runs fully unauthenticated against the backend's dev-mode security config.
  if (!auth0Configured) return tree

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: auth0Audience || undefined,
      }}
    >
      {tree}
    </Auth0Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
