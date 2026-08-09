import StyleSection from './StyleSection'
import Decorations from './Decorations'

const PLACEHOLDER = 'Escribe aquí tu frase para practicar'
const SECTION_HEIGHT = '128mm'
const DEFAULT_TITLE = 'Hoja de práctica de caligrafía'

function Worksheet({ title, text, includeDecorations, images, onImagesChange, rails, railWidth, cursiveNudge, printNudge, bindingSide, bindingMm }) {
  // Extra padding + decoration inset on the binding side(s) reserves a clear strip for hole-punches / paste area.
  const left = bindingSide === 'left' || bindingSide === 'both' ? `${bindingMm}mm` : '0mm'
  const right = bindingSide === 'right' || bindingSide === 'both' ? `${bindingMm}mm` : '0mm'
  const bindingStyle = { '--binding-left': left, '--binding-right': right }
  return (
    <div className="a4-page print-area" style={bindingStyle}>
      {includeDecorations && <Decorations />}
      <h1 className="a4-page__title">{title.trim() ? title : DEFAULT_TITLE}</h1>
      <StyleSection
        text={text}
        modelFont="'Playwrite MX', cursive"
        traceFont="'Playwrite MX', cursive"
        placeholder={PLACEHOLDER}
        sectionHeight={SECTION_HEIGHT}
        images={images}
        onImagesChange={onImagesChange}
        baselineNudge={cursiveNudge}
        rails={rails}
        railWidth={railWidth}
      />
      <StyleSection
        text={text}
        modelFont="'Andika', sans-serif"
        traceFont="'Andika', sans-serif"
        placeholder={PLACEHOLDER}
        sectionHeight={SECTION_HEIGHT}
        images={images}
        onImagesChange={onImagesChange}
        baselineNudge={printNudge}
        rails={rails}
        railWidth={railWidth}
      />
    </div>
  )
}

export default Worksheet
