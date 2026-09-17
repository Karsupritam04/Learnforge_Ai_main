export default function CodeBlock({ block }) {
  return (
    <div className="mb-5 rounded-md overflow-hidden border border-ink-700/15">
      <div className="bg-ink-900 text-paper-100/60 text-xs px-4 py-1.5 font-mono">
        {block.language || 'code'}
      </div>
      <pre className="bg-ink-950 text-paper-100 text-sm p-4 overflow-x-auto">
        <code className="font-mono">{block.text}</code>
      </pre>
    </div>
  )
}
