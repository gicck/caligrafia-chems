import { useMemo } from 'react'

// Simple emoji icons (not copies of any specific artwork) repeated around the margins.
const ICONS = [
  '✏️', '🖍️', '🌳', '🌸', '⚙️', '📏', '⭐', '🌈',
  '🎈', '📚', '🍎', '⚽', '🚀', '🦋', '☀️', '🎨',
]

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Fills a strip of the given length with shuffled icons, so each generated page differs.
function buildStrip(length) {
  const out = []
  while (out.length < length) out.push(...shuffle(ICONS))
  return out.slice(0, length)
}

function IconStrip({ className, icons }) {
  return (
    <div className={className}>
      {icons.map((icon, i) => (
        <span key={i}>{icon}</span>
      ))}
    </div>
  )
}

function Decorations() {
  // Recomputed only when decorations mount, so each page/session gets a fresh random layout.
  const topIcons = useMemo(() => buildStrip(22), [])
  const bottomIcons = useMemo(() => buildStrip(22), [])
  const leftIcons = useMemo(() => buildStrip(28), [])
  const rightIcons = useMemo(() => buildStrip(28), [])

  return (
    <div className="page-border" aria-hidden="true">
      <IconStrip className="page-border__row page-border__row--top" icons={topIcons} />
      <IconStrip className="page-border__row page-border__row--bottom" icons={bottomIcons} />
      <IconStrip className="page-border__col page-border__col--left" icons={leftIcons} />
      <IconStrip className="page-border__col page-border__col--right" icons={rightIcons} />
    </div>
  )
}

export default Decorations
