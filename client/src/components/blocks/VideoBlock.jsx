import { useEffect, useState } from 'react'
import { youtubeApi } from '../../utils/api'

export default function VideoBlock({ block }) {
  const [video, setVideo] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | empty | error

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    youtubeApi
      .search(block.query, 1)
      .then((results) => {
        if (cancelled) return
        if (results?.length) {
          setVideo(results[0])
          setStatus('ready')
        } else {
          setStatus('empty')
        }
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => { cancelled = true }
  }, [block.query])

  return (
    <div className="mb-5">
      {status === 'loading' && (
        <div className="aspect-video rounded-md bg-ink-900/5 animate-pulse" />
      )}
      {status === 'ready' && video && (
        <div className="aspect-video rounded-md overflow-hidden border border-ink-700/15">
          <iframe
            className="w-full h-full"
            src={video.embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      {(status === 'empty' || status === 'error') && (
        <div className="aspect-video rounded-md bg-ink-900/5 flex items-center justify-center text-sm text-ink-700/60 px-4 text-center">
          Video unavailable — configure YOUTUBE_API_KEY on the backend to enable "{block.query}"
        </div>
      )}
    </div>
  )
}
