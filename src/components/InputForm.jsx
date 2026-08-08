import { useRef } from 'react'

// Curated emoji "stickers" avoid any copyright risk while still giving kid-friendly artwork.
const PRESET_IMAGES = [
  '✏️', '📚', '🍎', '⭐', '🌈', '🎈', '🚀', '🦋', '☀️', '🎨', '🌳', '🌸',
  '📏', '⚙️', '⚽', '🐢', '🐝', '🐬', '🦕', '🐧', '🐘', '🦁', '🐶', '🐱',
  '🍉', '🍊', '🍇', '🥕', '🌻', '🌼', '🍀', '🌙', '⛅', '❄️', '🔥', '💧',
  '🎵', '🎲', '🧩', '🪁', '🎁', '🏀', '🚗', '✈️', '⛵', '🏠', '📖', '🖌️',
]

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function ImagePicker({ images, onImagesChange }) {
  const dragIndex = useRef(null)

  // Staggers each new sticker's starting spot within its rail so freshly added ones don't stack on top of each other.
  function nextStickerPosition(count) {
    const step = count % 4
    return { x: 4, y: 4 + step * 18 }
  }

  // Balances new images between the left and right rails as they're added.
  function nextSide() {
    const leftCount = images.filter((img) => img.side !== 'right').length
    const rightCount = images.length - leftCount
    return leftCount <= rightCount ? 'left' : 'right'
  }

  function toggleEmoji(emoji) {
    const existing = images.find((img) => img.type === 'emoji' && img.value === emoji)
    if (existing) {
      onImagesChange(images.filter((img) => img.id !== existing.id))
    } else {
      const side = nextSide()
      const sideCount = images.filter((img) => (img.side !== 'right') === (side !== 'right')).length
      onImagesChange([
        ...images,
        { id: `emoji-${emoji}-${Date.now()}`, type: 'emoji', value: emoji, side, ...nextStickerPosition(sideCount) },
      ])
    }
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    let leftCount = images.filter((img) => img.side !== 'right').length
    let rightCount = images.length - leftCount
    const uploaded = await Promise.all(
      files.map(async (file) => {
        const side = leftCount <= rightCount ? 'left' : 'right'
        const sideCount = side === 'left' ? leftCount++ : rightCount++
        return {
          id: `upload-${Date.now()}-${Math.random()}`,
          type: 'upload',
          value: await readFileAsDataUrl(file),
          side,
          ...nextStickerPosition(sideCount),
        }
      })
    )
    onImagesChange([...images, ...uploaded])
    e.target.value = ''
  }

  function removeImage(id) {
    onImagesChange(images.filter((img) => img.id !== id))
  }

  // Reordering the chips changes which sticker renders on top when two overlap on the sheet.
  function handleDrop(dropIndex) {
    const from = dragIndex.current
    dragIndex.current = null
    if (from === null || from === dropIndex) return
    const next = images.slice()
    const [moved] = next.splice(from, 1)
    next.splice(dropIndex, 0, moved)
    onImagesChange(next)
  }

  return (
    <div className="image-picker">
      <p className="image-picker__hint">
        Elige íconos o sube tus propias imágenes; se ubican en los márgenes junto al texto modelo (no en las líneas
        de práctica), que queda centrado. Arrástralas dentro de su margen para acomodarlas, usa la esquina para
        cambiar su tamaño y el botón ⇄ para pasarlas al otro lado.
      </p>
      <div className="image-picker__grid">
        {PRESET_IMAGES.map((emoji) => {
          const selected = images.some((img) => img.type === 'emoji' && img.value === emoji)
          return (
            <button
              key={emoji}
              type="button"
              className={`image-picker__option${selected ? ' image-picker__option--selected' : ''}`}
              onClick={() => toggleEmoji(emoji)}
              aria-pressed={selected}
            >
              {emoji}
            </button>
          )
        })}
      </div>
      <label className="image-picker__upload">
        Subir mis imágenes
        <input type="file" accept="image/*" multiple hidden onChange={handleFiles} />
      </label>
      {images.length > 0 && (
        <div className="image-picker__selected">
          {images.map((img, index) => (
            <span
              key={img.id}
              className="image-picker__chip"
              draggable
              onDragStart={() => (dragIndex.current = index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
            >
              {img.type === 'emoji' ? img.value : <img src={img.value} alt="" />}
              <button type="button" onClick={() => removeImage(img.id)} aria-label="Quitar imagen">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const RAIL_OPTIONS = [
  { value: 'both', label: 'Ambos lados' },
  { value: 'left', label: 'Solo izquierda' },
  { value: 'right', label: 'Solo derecha' },
]

function InputForm({
  title,
  onTitleChange,
  text,
  onTextChange,
  includeDecorations,
  onDecorationsChange,
  images,
  onImagesChange,
  rails,
  onRailsChange,
  railWidth,
  onRailWidthChange,
  cursiveNudge,
  onCursiveNudgeChange,
  printNudge,
  onPrintNudgeChange,
}) {
  return (
    <div className="input-form">
      <h1>Caligrafía</h1>
      <p className="input-form__hint">
        Escribe una frase y genera una hoja A4 para practicar en cursiva e imprenta.
      </p>
      <label className="input-form__field">
        Título de la hoja
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Ej: Los deberes de un niño"
        />
      </label>
      <label className="input-form__field">
        Texto a practicar
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Ej: El veloz murciélago hindú comía feliz cardillo y kiwi"
          rows={4}
        />
      </label>
      <fieldset className="input-form__rails">
        <legend>Márgenes con imágenes</legend>
        {RAIL_OPTIONS.map((opt) => (
          <label key={opt.value} className="input-form__rails-option">
            <input
              type="radio"
              name="rails"
              value={opt.value}
              checked={rails === opt.value}
              onChange={() => onRailsChange(opt.value)}
            />
            {opt.label}
          </label>
        ))}
        <label className="input-form__rails-width">
          <span>Ancho del margen: {railWidth}mm</span>
          <input
            type="range"
            min={20}
            max={105}
            step={5}
            value={railWidth}
            onChange={(e) => onRailWidthChange(Number(e.target.value))}
          />
        </label>
      </fieldset>
      <fieldset className="input-form__rails">
        <legend>Ajuste de línea base</legend>
        <label className="input-form__rails-width">
          <span>Cursiva: {cursiveNudge.toFixed(2)}</span>
          <input
            type="range"
            min={-0.2}
            max={0.4}
            step={0.01}
            value={cursiveNudge}
            onChange={(e) => onCursiveNudgeChange(Number(e.target.value))}
          />
        </label>
        <label className="input-form__rails-width">
          <span>Imprenta: {printNudge.toFixed(2)}</span>
          <input
            type="range"
            min={-0.2}
            max={0.4}
            step={0.01}
            value={printNudge}
            onChange={(e) => onPrintNudgeChange(Number(e.target.value))}
          />
        </label>
      </fieldset>
      <ImagePicker images={images} onImagesChange={onImagesChange} />
      <label className="input-form__checkbox">
        <input
          type="checkbox"
          checked={includeDecorations}
          onChange={(e) => onDecorationsChange(e.target.checked)}
        />
        Incluir decoraciones
      </label>
      <button type="button" className="input-form__print" onClick={() => window.print()}>
        Imprimir / Descargar PDF
      </button>
    </div>
  )
}

export default InputForm
