import { useAuth0 } from '@auth0/auth0-react'

const auth0Configured = Boolean(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID)

/**
 * Milestone 4: wraps useAuth0() so the rest of the app doesn't need to check
 * "is Auth0 even configured" everywhere. Until real Auth0 credentials are supplied
 * (see client/.env.example), this returns a signed-out, no-op shape and the backend
 * runs in its own dev-mode (open) security config, so the whole flow still works end to end.
 */
export function useAuth() {
  if (!auth0Configured) {
    return {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      loginWithRedirect: () => alert('Set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in client/.env to enable login.'),
      logout: () => {},
      getAccessTokenSilently: null,
      configured: false,
    }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const auth0 = useAuth0()
  return { ...auth0, configured: true }
}
