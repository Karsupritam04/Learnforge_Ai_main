import { useState } from 'react'

const EXAMPLES = ['Intro to React Hooks', 'Basics of Copyright Law', 'Python for Data Analysis']

export default function PromptForm({ onGenerate, isGenerating }) {
  const [topic, setTopic] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!topic.trim() || isGenerating) return
    onGenerate(topic.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor="topic" className="block font-serif text-2xl mb-3">
        What do you want to learn?
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Intro to React Hooks"
          disabled={isGenerating}
          className="flex-1 rounded-md border border-ink-700/20 bg-white px-4 py-3 text-ink-900 placeholder:text-ink-700/40 focus-ring"
        />
        <button
          type="submit"
          disabled={isGenerating || !topic.trim()}
          className="rounded-md bg-moss-500 hover:bg-moss-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 transition-colors focus-ring"
        >
          {isGenerating ? 'Generating…' : 'Generate course'}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <span className="text-ink-700/60">Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            type="button"
            key={ex}
            onClick={() => {
              setTopic(ex)
              if (!isGenerating) onGenerate(ex)
            }}
            disabled={isGenerating}
            className="text-moss-600 hover:underline focus-ring rounded"
          >
            {ex}
          </button>
        ))}
      </div>
    </form>
  )
}
