import { useState } from 'react'

export default function MCQBlock({ block, index }) {
  const [selected, setSelected] = useState(null)
  const isCorrect = selected === block.answer

  return (
    <div className="mb-5 rounded-md border border-ink-700/15 p-4">
      <p className="font-medium text-ink-950 mb-3">
        {index}. {block.question}
      </p>
      <div className="flex flex-col gap-2">
        {block.options.map((opt, i) => {
          const isChosen = selected === i
          const showCorrect = selected !== null && i === block.answer
          const showWrong = isChosen && !isCorrect
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              disabled={selected !== null}
              className={`text-left rounded-md border px-3 py-2 text-sm transition-colors focus-ring
                ${showCorrect ? 'border-moss-500 bg-moss-500/10' : ''}
                ${showWrong ? 'border-clay-500 bg-clay-500/10' : ''}
                ${!showCorrect && !showWrong ? 'border-ink-700/15 hover:bg-ink-900/5' : ''}
                ${selected !== null ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <p className={`mt-3 text-sm ${isCorrect ? 'text-moss-600' : 'text-clay-500'}`}>
          {isCorrect ? 'Correct. ' : 'Not quite. '}
          {block.explanation}
        </p>
      )}
    </div>
  )
}
