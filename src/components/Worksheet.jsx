import StyleSection from './StyleSection'
import Decorations from './Decorations'

const PLACEHOLDER = 'Escribe aquí tu frase para practicar'
const SECTION_HEIGHT = '128mm'
const DEFAULT_TITLE = 'Hoja de práctica de caligrafía'

function Worksheet({ title, text, includeDecorations, images, onImagesChange, rails, railWidth, cursiveNudge, printNudge }) {
  return (
    <div className="a4-page print-area">
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
