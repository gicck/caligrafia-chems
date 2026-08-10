import { useEffect, useState } from 'react'
import InputForm from './components/InputForm'
import Worksheet from './components/Worksheet'
import './App.css'

function App() {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [includeDecorations, setIncludeDecorations] = useState(true)
  const [images, setImages] = useState([])
  const [rails, setRails] = useState('both') // 'both' | 'left' | 'right'
  const [railWidth, setRailWidth] = useState(30) // mm — width of each visible sticker rail
  const [cursiveNudge, setCursiveNudge] = useState(0.05) // baseline shift (fraction of row-h) for the cursive tracing
  const [printNudge, setPrintNudge] = useState(0.15) // baseline shift for the print tracing
  const [bindingSide, setBindingSide] = useState('none') // 'none' | 'left' | 'right' | 'both'
  const [bindingMm, setBindingMm] = useState(15) // mm — width of the binding / hole-punch margin
  const [sectionCount, setSectionCount] = useState(2) // 1 | 2 — how many calligraphy blocks on the page
  const [singleStyle, setSingleStyle] = useState('cursive') // 'cursive' | 'print' — which style, when sectionCount is 1
  const [cursiveScale, setCursiveScale] = useState(0.85) // tracing font size for cursive, as a fraction of row-h
  const [printScale, setPrintScale] = useState(0.85) // tracing font size for print, as a fraction of row-h
  const [cursiveRowScale, setCursiveRowScale] = useState(1.0) // multiplier on the auto-calculated cursive row-h
  const [printRowScale, setPrintRowScale] = useState(1.0) // multiplier on the auto-calculated print row-h
  const [previewZoom, setPreviewZoom] = useState(1.0) // user-controlled preview zoom on top of the fixed 0.62 base scale

  // Drives the browser tab title, which also becomes the default filename when the user "Saves as PDF".
  useEffect(() => {
    const trimmed = title.trim()
    document.title = trimmed ? `Caligrafía - ${trimmed}` : 'Caligrafía - Hojas de práctica'
  }, [title])

  return (
    <div className="app">
      <div className="app__panel">
        <InputForm
          title={title}
          onTitleChange={setTitle}
          text={text}
          onTextChange={setText}
          includeDecorations={includeDecorations}
          onDecorationsChange={setIncludeDecorations}
          images={images}
          onImagesChange={setImages}
          rails={rails}
          onRailsChange={setRails}
          railWidth={railWidth}
          onRailWidthChange={setRailWidth}
          cursiveNudge={cursiveNudge}
          onCursiveNudgeChange={setCursiveNudge}
          printNudge={printNudge}
          onPrintNudgeChange={setPrintNudge}
          bindingSide={bindingSide}
          onBindingSideChange={setBindingSide}
          bindingMm={bindingMm}
          onBindingMmChange={setBindingMm}
          sectionCount={sectionCount}
          onSectionCountChange={setSectionCount}
          singleStyle={singleStyle}
          onSingleStyleChange={setSingleStyle}
          cursiveScale={cursiveScale}
          onCursiveScaleChange={setCursiveScale}
          printScale={printScale}
          onPrintScaleChange={setPrintScale}
          cursiveRowScale={cursiveRowScale}
          onCursiveRowScaleChange={setCursiveRowScale}
          printRowScale={printRowScale}
          onPrintRowScaleChange={setPrintRowScale}
        />
      </div>
      <div className="app__preview">
        <div className="preview-zoom" role="group" aria-label="Zoom de la vista previa">
          <button
            type="button"
            className="preview-zoom__btn"
            onClick={() => setPreviewZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
            aria-label="Alejar"
            title="Alejar"
          >
            −
          </button>
          <button
            type="button"
            className="preview-zoom__value"
            onClick={() => setPreviewZoom(1.0)}
            aria-label="Restablecer zoom"
            title="Restablecer zoom"
          >
            {Math.round(previewZoom * 100)}%
          </button>
          <button
            type="button"
            className="preview-zoom__btn"
            onClick={() => setPreviewZoom((z) => Math.min(2.5, +(z + 0.1).toFixed(2)))}
            aria-label="Acercar"
            title="Acercar"
          >
            +
          </button>
        </div>
        <div className="app__preview-scale" style={{ zoom: previewZoom }}>
          <Worksheet
            title={title}
            text={text}
            includeDecorations={includeDecorations}
            images={images}
            onImagesChange={setImages}
            rails={rails}
            railWidth={railWidth}
            cursiveNudge={cursiveNudge}
            printNudge={printNudge}
            bindingSide={bindingSide}
            bindingMm={bindingMm}
            sectionCount={sectionCount}
            singleStyle={singleStyle}
            cursiveScale={cursiveScale}
            printScale={printScale}
            cursiveRowScale={cursiveRowScale}
            printRowScale={printRowScale}
          />
        </div>
      </div>
    </div>
  )
}

export default App
