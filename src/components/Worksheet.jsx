import StyleSection from './StyleSection'
import Decorations from './Decorations'

const PLACEHOLDER = 'Escribe aquí tu frase para practicar'
const SECTION_HEIGHT_TWO = '128mm' // when both styles share the page
const SECTION_HEIGHT_ONE = '260mm' // when only one style fills the page (title + padding + gap ≈ 37mm of the 297mm)
const DEFAULT_TITLE = 'Hoja de práctica de caligrafía'

const CURSIVE_PROPS = {
  modelFont: "'Playwrite MX', cursive",
  traceFont: "'Playwrite MX', cursive",
}
const PRINT_PROPS = {
  modelFont: "'Andika', sans-serif",
  traceFont: "'Andika', sans-serif",
}

function Worksheet({
  title,
  text,
  includeDecorations,
  images,
  onImagesChange,
  rails,
  railWidth,
  cursiveNudge,
  printNudge,
  bindingSide,
  bindingMm,
  sectionCount,
  singleStyle,
}) {
  // Extra padding + decoration inset on the binding side(s) reserves a clear strip for hole-punches / paste area.
  const left = bindingSide === 'left' || bindingSide === 'both' ? `${bindingMm}mm` : '0mm'
  const right = bindingSide === 'right' || bindingSide === 'both' ? `${bindingMm}mm` : '0mm'
  const bindingStyle = { '--binding-left': left, '--binding-right': right }
  const sectionHeight = sectionCount === 1 ? SECTION_HEIGHT_ONE : SECTION_HEIGHT_TWO
  const showCursive = sectionCount === 2 || singleStyle === 'cursive'
  const showPrint = sectionCount === 2 || singleStyle === 'print'
  return (
    <div className="a4-page print-area" style={bindingStyle}>
      {includeDecorations && <Decorations />}
      <h1 className="a4-page__title">{title.trim() ? title : DEFAULT_TITLE}</h1>
      {showCursive && (
        <StyleSection
          text={text}
          {...CURSIVE_PROPS}
          placeholder={PLACEHOLDER}
          sectionHeight={sectionHeight}
          images={images}
          onImagesChange={onImagesChange}
          baselineNudge={cursiveNudge}
          rails={rails}
          railWidth={railWidth}
        />
      )}
      {showPrint && (
        <StyleSection
          text={text}
          {...PRINT_PROPS}
          placeholder={PLACEHOLDER}
          sectionHeight={sectionHeight}
          images={images}
          onImagesChange={onImagesChange}
          baselineNudge={printNudge}
          rails={rails}
          railWidth={railWidth}
        />
      )}
    </div>
  )
}

export default Worksheet
