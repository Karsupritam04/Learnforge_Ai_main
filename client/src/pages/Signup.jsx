import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'

// Auth0's Universal Login screen includes a "Sign up" tab, so this route
// redirects there with screen_hint=signup pre-selected.
export default function Signup() {
  const { isAuthenticated, isLoading, loginWithRedirect, configured } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!configured) {
      navigate('/')
      return
    }
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })
    }
    if (!isLoading && isAuthenticated) {
      navigate('/')
    }
  }, [isLoading, isAuthenticated, configured])

  return <LoadingSpinner label="Redirecting to sign up…" />
}
