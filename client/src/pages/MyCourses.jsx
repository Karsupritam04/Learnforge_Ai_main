import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { courseApi } from '../utils/api'

export default function MyCourses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loadState, setLoadState] = useState('loading')

  function load() {
    setLoadState('loading')
    courseApi
      .mine()
      .then((data) => {
        setCourses(data)
        setLoadState('ready')
      })
      .catch(() => setLoadState('error'))
  }

  useEffect(load, [])

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-serif text-2xl mb-6 text-ink-950">My courses</h1>

      {loadState === 'loading' && <LoadingSpinner label="Loading your courses…" />}
      {loadState === 'error' && <ErrorMessage message="Couldn't load your courses." onRetry={load} />}
      {loadState === 'ready' && courses.length === 0 && (
        <p className="text-ink-700/60 text-sm">You haven't generated any courses yet.</p>
      )}
      {loadState === 'ready' && courses.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/course/${c.id}`)}
              className="text-left rounded-lg border border-ink-700/15 bg-white p-5 hover:border-moss-500/50 hover:shadow-sm transition-all focus-ring"
            >
              <h3 className="font-serif text-lg mb-1 text-ink-950">{c.title}</h3>
              <p className="text-sm text-ink-700/70 line-clamp-2">{c.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
