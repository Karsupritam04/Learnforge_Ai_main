export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="rounded-md border border-clay-500/30 bg-clay-500/5 px-5 py-4 text-sm">
      <p className="font-medium text-clay-500 mb-1">Couldn't complete that</p>
      <p className="text-ink-800">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-moss-600 hover:underline focus-ring rounded font-medium"
        >
          Try again
        </button>
      )}
    </div>
  )
}
