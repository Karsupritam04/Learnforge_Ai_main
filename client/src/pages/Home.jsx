import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PromptForm from '../components/PromptForm'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { courseApi } from '../utils/api'

export default function Home() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loadState, setLoadState] = useState('loading') // loading | ready | error
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState(null)

  function loadCourses() {
    setLoadState('loading')
    courseApi
      .list()
      .then((data) => {
        setCourses(data)
        setLoadState('ready')
      })
      .catch(() => setLoadState('error'))
  }

  useEffect(loadCourses, [])

  async function handleGenerate(topic) {
    setIsGenerating(true)
    setGenerateError(null)
    try {
      const course = await courseApi.generate(topic)
      navigate(`/course/${course.id}`)
    } catch (e) {
      setGenerateError(e.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <PromptForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        {generateError && (
          <div className="mt-4">
            <ErrorMessage message={generateError} onRetry={() => setGenerateError(null)} />
          </div>
        )}
      </div>

      <h2 className="font-serif text-xl mb-4 text-ink-950">All courses</h2>

      {loadState === 'loading' && <LoadingSpinner label="Loading courses…" />}
      {loadState === 'error' && <ErrorMessage message="Couldn't load courses." onRetry={loadCourses} />}
      {loadState === 'ready' && courses.length === 0 && (
        <p className="text-ink-700/60 text-sm">No courses yet — generate your first one above.</p>
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
              {c.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.tags.slice(0, 4).map((t) => (
                    <span key={t} className="text-xs rounded-full bg-moss-500/10 text-moss-600 px-2 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
