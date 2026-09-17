import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import MyCourses from './pages/MyCourses'
import Course from './pages/Course'
import Lesson from './pages/Lesson'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useAuth } from './hooks/useAuth'
import { setAuthTokenGetter } from './utils/api'

export default function App() {
  const { getAccessTokenSilently, configured } = useAuth()

  // Milestone 4: once Auth0 is configured, every outgoing API request carries a fresh
  // access token automatically. Until then, requests just go out unauthenticated and
  // the backend's dev-mode security config accepts them.
  useEffect(() => {
    if (configured && getAccessTokenSilently) {
      setAuthTokenGetter(getAccessTokenSilently)
    }
  }, [configured, getAccessTokenSilently])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/course/:courseId" element={<Course />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-serif text-2xl mb-2">Page not found</h1>
      <p className="text-ink-700/70 text-sm">The page you're looking for doesn't exist.</p>
    </div>
  )
}
