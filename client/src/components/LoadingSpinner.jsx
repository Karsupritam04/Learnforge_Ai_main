export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-700/70">
      <div className="h-8 w-8 rounded-full border-2 border-moss-500/30 border-t-moss-500 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
