import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'

// Milestone 4: Auth0 handles the actual login UI via a hosted redirect page,
// so this route just kicks off loginWithRedirect() and shows a spinner meanwhile.
export default function Login() {
  const { isAuthenticated, isLoading, loginWithRedirect, configured } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!configured) {
      navigate('/')
      return
    }
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect()
    }
    if (!isLoading && isAuthenticated) {
      navigate('/')
    }
  }, [isLoading, isAuthenticated, configured])

  return <LoadingSpinner label="Redirecting to login…" />
}
