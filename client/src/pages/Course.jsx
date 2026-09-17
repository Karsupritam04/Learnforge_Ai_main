import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { courseApi } from '../utils/api'

export default function Course() {
  const { courseId } = useParams()
  const [detail, setDetail] = useState(null)
  const [loadState, setLoadState] = useState('loading')

  function load() {
    setLoadState('loading')
    courseApi
      .get(courseId)
      .then((data) => {
        setDetail(data)
        setLoadState('ready')
      })
      .catch(() => setLoadState('error'))
  }

  useEffect(load, [courseId])

  if (loadState === 'loading') return <LoadingSpinner label="Loading course…" />
  if (loadState === 'error') return <div className="max-w-3xl mx-auto px-6 py-12"><ErrorMessage message="Couldn't load this course." onRetry={load} /></div>

  const { course, modules } = detail

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/" className="text-sm text-moss-600 hover:underline">&larr; All courses</Link>

      <h1 className="font-serif text-3xl mt-4 mb-2 text-ink-950">{course.title}</h1>
      <p className="text-ink-700/80 mb-8 leading-relaxed">{course.description}</p>

      <div className="flex flex-col gap-6">
        {modules.map((m, mi) => (
          <div key={m.module.id} className="rounded-lg border border-ink-700/15 bg-white overflow-hidden">
            <div className="px-5 py-3 bg-ink-950 text-paper-100">
              <span className="text-moss-400 text-sm font-mono mr-2">
                Module {mi + 1}
              </span>
              <span className="font-serif">{m.module.title}</span>
            </div>
            <ul>
              {m.lessons.map((lesson, li) => (
                <li key={lesson.id} className="border-t border-ink-700/10 first:border-t-0">
                  <Link
                    to={`/lesson/${lesson.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-ink-900/5 transition-colors focus-ring"
                  >
                    <span className="text-ink-900 text-sm">
                      <span className="text-ink-700/50 font-mono mr-2">{mi + 1}.{li + 1}</span>
                      {lesson.title}
                    </span>
                    {!lesson.enriched && (
                      <span className="text-xs text-ink-700/40">not started</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
