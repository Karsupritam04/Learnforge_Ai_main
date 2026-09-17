import { useState, useRef, useEffect } from 'react'
import { narrationApi } from '../utils/api'

/**
 * Milestone 10: Multilingual Audio Narration (Hinglish)
 * Translates lesson text to conversational Hinglish and plays Gemini-synthesized speech.
 */
export default function HinglishAudioPlayer({ lesson }) {
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'ready' | 'error'
  const [audioUrl, setAudioUrl] = useState(null)
  const [hinglishText, setHinglishText] = useState('')
  const [showTranscript, setShowTranscript] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const audioRef = useRef(null)

  // Reset if lesson changes
  useEffect(() => {
    setStatus('idle')
    setAudioUrl(null)
    setHinglishText('')
    setShowTranscript(false)
    setErrorMsg('')
  }, [lesson?._id || lesson?.id || lesson?.title])

  function extractLessonText() {
    const pieces = []
    if (lesson?.title) pieces.push(lesson.title)
    if (lesson?.objectives?.length) {
      pieces.push('Lesson Objectives: ' + lesson.objectives.join('. '))
    }
    if (lesson?.content?.length) {
      lesson.content.forEach((block) => {
        if (block.type === 'heading' && block.text) pieces.push(block.text)
        if (block.type === 'paragraph' && block.text) pieces.push(block.text)
      })
    }
    return pieces.join('\n\n')
  }

  async function handleGenerateAudio() {
    const text = extractLessonText()
    if (!text) {
      setErrorMsg('No text content available to narrate.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const response = await narrationApi.narrate(text, 'Kore')

      if (response?.error) {
        setErrorMsg(response.error)
        setStatus('error')
        return
      }

      if (response?.audioBase64) {
        const mimeType = response.mimeType || 'audio/wav'
        const uri = response.audioBase64.startsWith('data:')
          ? response.audioBase64
          : `data:${mimeType};base64,${response.audioBase64}`
        setAudioUrl(uri)
        setHinglishText(response.hinglishText || '')
        setStatus('ready')
      } else if (response?.hinglishText) {
        setHinglishText(response.hinglishText)
        setStatus('ready')
      } else {
        setErrorMsg('No audio data received from narration service.')
        setStatus('error')
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to generate Hinglish narration.')
      setStatus('error')
    }
  }

  return (
    <div className="rounded-lg border border-ink-700/15 bg-ink-900/[0.02] p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-moss-500/10 text-moss-600 font-semibold">
            🎙️
          </span>
          <div>
            <p className="font-medium text-ink-950">Listen in Hinglish (Audio Narration)</p>
            <p className="text-xs text-ink-700/70">
              AI-translated conversational explanation with text-to-speech
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === 'idle' && (
            <button
              onClick={handleGenerateAudio}
              className="rounded-md bg-moss-600 hover:bg-moss-700 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors focus-ring"
            >
              Generate Narration
            </button>
          )}

          {status === 'loading' && (
            <button
              disabled
              className="flex items-center gap-2 rounded-md bg-moss-600/50 px-3.5 py-1.5 text-xs font-semibold text-white cursor-not-allowed"
            >
              <svg
                className="h-3.5 w-3.5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Translating & Synthesizing…
            </button>
          )}

          {status === 'ready' && (
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="rounded-md border border-ink-700/20 px-3 py-1.5 text-xs font-medium text-ink-800 hover:bg-ink-900/5 transition-colors"
            >
              {showTranscript ? 'Hide Transcript' : 'View Transcript'}
            </button>
          )}
        </div>
      </div>

      {status === 'ready' && audioUrl && (
        <div className="mt-3 pt-3 border-t border-ink-700/10">
          <audio
            ref={audioRef}
            controls
            src={audioUrl}
            className="w-full h-9 rounded"
          >
            Your browser does not support audio playback.
          </audio>
        </div>
      )}

      {status === 'ready' && showTranscript && hinglishText && (
        <div className="mt-3 pt-3 border-t border-ink-700/10">
          <p className="font-semibold text-xs text-ink-900 mb-1">Hinglish Transcript:</p>
          <div className="rounded bg-white/70 p-3 text-xs text-ink-800 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border border-ink-700/10">
            {hinglishText}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-3 pt-2 border-t border-clay-500/20 text-xs text-clay-600 flex items-start justify-between gap-2">
          <span>⚠️ {errorMsg}</span>
          <button
            onClick={handleGenerateAudio}
            className="underline hover:text-clay-700 font-medium whitespace-nowrap"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
