import { useRef } from 'react'
import Draggable from 'react-draggable'

// Must match the `.a4-page` CSS transform scale, so a screen-pixel drag maps to the right mm amount.
const PREVIEW_SCALE = 0.62
const PX_PER_MM = 96 / 25.4
const MIN_STICKER_SIZE = 8 // mm
const MAX_STICKER_SIZE = 40 // mm
const DEFAULT_STICKER_SIZE = 16 // mm

// Bottom-right handle: drag to grow/shrink the sticker in place, keeping it square and inside the rail bounds.
function ResizeHandle({ image, images, onImagesChange }) {
  function handlePointerDown(e) {
    e.preventDefault()
    e.stopPropagation()
    const container = e.currentTarget.closest('.model-row__rail')
    const containerRect = container.getBoundingClientRect()
    const maxWidthPx = containerRect.width / PREVIEW_SCALE
    const maxHeightPx = containerRect.height / PREVIEW_SCALE
    const x = image.x || 0
    const y = image.y || 0
    const startX = e.clientX
    const startY = e.clientY
    const startSize = image.size || DEFAULT_STICKER_SIZE

    function handleMove(moveEvent) {
      const deltaPx = (moveEvent.clientX - startX + (moveEvent.clientY - startY)) / 2
      const deltaMm = deltaPx / (PX_PER_MM * PREVIEW_SCALE)
      const roomMm = Math.min((maxWidthPx - x) / PX_PER_MM, (maxHeightPx - y) / PX_PER_MM)
      const cappedMax = Math.min(MAX_STICKER_SIZE, roomMm)
      const nextSize = Math.min(cappedMax, Math.max(MIN_STICKER_SIZE, startSize + deltaMm))
      onImagesChange(images.map((img) => (img.id === image.id ? { ...img, size: nextSize } : img)))
    }

    function handleUp() {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  return <span className="plain-text__resize-handle" onPointerDown={handlePointerDown} />
}

// Small top-left control to move a sticker to the opposite margin rail.
function SideToggle({ image, images, onImagesChange }) {
  function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    const nextSide = image.side === 'right' ? 'left' : 'right'
    onImagesChange(images.map((img) => (img.id === image.id ? { ...img, side: nextSide, x: 0, y: 0 } : img)))
  }

  return (
    <button type="button" className="plain-text__side-toggle" onPointerDown={(e) => e.stopPropagation()} onClick={handleClick} title="Mover al otro lado">
      ⇄
    </button>
  )
}

// Free-draggable sticker (clamped to its margin rail) with its own resize handle and side toggle.
function Sticker({ image, images, onImagesChange }) {
  const nodeRef = useRef(null)
  const size = image.size || DEFAULT_STICKER_SIZE

  function handleDragStop(_e, data) {
    if (!onImagesChange) return
    onImagesChange(images.map((img) => (img.id === image.id ? { ...img, x: data.x, y: data.y } : img)))
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      scale={PREVIEW_SCALE}
      cancel=".plain-text__resize-handle, .plain-text__side-toggle"
      position={{ x: image.x || 0, y: image.y || 0 }}
      onStop={handleDragStop}
    >
      <span ref={nodeRef} className="plain-text__sticker" style={{ width: `${size}mm`, height: `${size}mm` }}>
        {image.type === 'emoji' ? (
          <span className="plain-text__emoji" style={{ fontSize: `${size}mm` }}>
            {image.value}
          </span>
        ) : (
          <img src={image.value} alt="" className="plain-text__image" draggable={false} />
        )}
        {onImagesChange && (
          <>
            <SideToggle image={image} images={images} onImagesChange={onImagesChange} />
            <ResizeHandle image={image} images={images} onImagesChange={onImagesChange} />
          </>
        )}
      </span>
    </Draggable>
  )
}

// Model text (ruled=false) has no guide lines; traced text (ruled=true) sits on a single baseline per row.
// `baselineNudge` (0..1 of row-h) pushes each text line down so its glyph baseline snaps onto the ruled baseline.
// It is font-specific because different fonts place their natural baseline at different points inside the CSS line-box.
function HandwritingLine({ text, fontFamily, fontSize, images, onImagesChange, rowHeight = '14mm', faded = false, ruled = true, baselineNudge = 0.15, rails = 'both', railWidth = 30 }) {
  if (!ruled) {
    const all = images || []
    // When only one rail is shown, dump every sticker into it regardless of its stored `side`.
    const showLeft = rails !== 'right'
    const showRight = rails !== 'left'
    const leftImages = rails === 'left' ? all : rails === 'both' ? all.filter((img) => img.side !== 'right') : []
    const rightImages = rails === 'right' ? all : rails === 'both' ? all.filter((img) => img.side === 'right') : []
    const railStyle = { width: `${railWidth}mm` }
    return (
      <div className="model-row">
        {showLeft && (
          <div
            className={`model-row__rail${leftImages.length ? ' model-row__rail--has-images' : ''}`}
            style={railStyle}
          >
            {leftImages.map((img) => (
              <Sticker key={img.id} image={img} images={images} onImagesChange={onImagesChange} />
            ))}
          </div>
        )}
        <p className="plain-text" style={{ fontFamily, fontSize }}>
          {text}
        </p>
        {showRight && (
          <div
            className={`model-row__rail${rightImages.length ? ' model-row__rail--has-images' : ''}`}
            style={railStyle}
          >
            {rightImages.map((img) => (
              <Sticker key={img.id} image={img} images={images} onImagesChange={onImagesChange} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="ruled-paper" style={{ '--row-h': rowHeight, '--baseline-nudge': baselineNudge }}>
      <div
        className={`ruled-paper__text${faded ? ' ruled-paper__text--faded' : ' ruled-paper__text--model'}`}
        style={{ fontFamily }}
      >
        {text}
      </div>
    </div>
  )
}

export default HandwritingLine
