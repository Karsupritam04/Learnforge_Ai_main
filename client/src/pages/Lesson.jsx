import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import LessonRenderer from '../components/LessonRenderer'
import LessonPDFExporter from '../components/LessonPDFExporter'
import HinglishAudioPlayer from '../components/HinglishAudioPlayer'
import { lessonApi } from '../utils/api'

export default function Lesson() {
  const { lessonId } = useParams()
  const [lesson, setLesson] = useState(null)
  const [loadState, setLoadState] = useState('loading') // loading | ready | error

  function load() {
    setLoadState('loading')
    lessonApi
      .get(lessonId)
      .then((data) => {
        setLesson(data)
        setLoadState('ready')
      })
      .catch(() => setLoadState('error'))
  }

  useEffect(load, [lessonId])

  if (loadState === 'loading') return <LoadingSpinner label="Generating lesson…" />
  if (loadState === 'error') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <ErrorMessage message="Couldn't load this lesson." onRetry={load} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to=".." relative="path" className="text-sm text-moss-600 hover:underline">
        &larr; Back to course
      </Link>

      <div className="flex items-start justify-between gap-4 mt-4 mb-2">
        <h1 className="font-serif text-3xl text-ink-950">{lesson.title}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <LessonPDFExporter lesson={lesson} />
      </div>

      <div className="mb-8">
        <HinglishAudioPlayer lesson={lesson} />
      </div>

      {lesson.objectives?.length > 0 && (
        <div className="mb-8 rounded-lg bg-moss-500/5 border border-moss-500/20 px-5 py-4">
          <p className="font-medium text-moss-600 mb-2 text-sm uppercase tracking-wide">Objectives</p>
          <ul className="list-disc pl-5 text-sm text-ink-800 space-y-1">
            {lesson.objectives.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>
      )}

      <LessonRenderer content={lesson.content} />
    </div>
  )
}
