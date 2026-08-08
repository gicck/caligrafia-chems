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
        />
      </div>
      <div className="app__preview">
        <div className="app__preview-scale">
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
          />
        </div>
      </div>
    </div>
  )
}

export default App
