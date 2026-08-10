import HandwritingLine from './HandwritingLine'

const BASE_ROW_HEIGHT = 10 // mm - used for shorter text
const MIN_ROW_HEIGHT = 6 // mm - floor for long text (was 7; lowered so ~550-char inputs still fit)
const BASE_MODEL_FONT = 12.5 // pt
const MIN_MODEL_FONT = 9 // pt - lowered so long model rows don't crowd out the tracing filler
const FIT_START_CHARS = 220 // start shrinking earlier now that the tracing font is bigger
const FIT_END_CHARS = 600 // row height/font hit their floor by here (targets ~550-char capacity)

// 0 at/below FIT_START_CHARS, ramps to 1 by FIT_END_CHARS.
function shrinkFactor(charCount) {
  if (charCount <= FIT_START_CHARS) return 0
  return Math.min(1, (charCount - FIT_START_CHARS) / (FIT_END_CHARS - FIT_START_CHARS))
}

function StyleSection({ text, modelFont, traceFont, placeholder, sectionHeight, images, onImagesChange, baselineNudge, letterScale, rowScale = 1, rails, railWidth }) {
  const displayText = text.trim() ? text : placeholder
  const factor = shrinkFactor(displayText.length)
  const baseRowMm = BASE_ROW_HEIGHT - factor * (BASE_ROW_HEIGHT - MIN_ROW_HEIGHT)
  // `rowScale` lets the user narrow or widen the guide rows on top of the auto-fit calculation.
  const rowHeight = `${baseRowMm * rowScale}mm`
  const modelFontSize = `${BASE_MODEL_FONT - factor * (BASE_MODEL_FONT - MIN_MODEL_FONT)}pt`

  return (
    <section className="style-section" style={{ height: sectionHeight }}>
      <HandwritingLine
        text={displayText}
        fontFamily={modelFont}
        fontSize={modelFontSize}
        images={images}
        onImagesChange={onImagesChange}
        ruled={false}
        rails={rails}
        railWidth={railWidth}
      />
      <div className="style-section__filler-wrap">
        <HandwritingLine text={displayText} fontFamily={traceFont} rowHeight={rowHeight} faded baselineNudge={baselineNudge} letterScale={letterScale} />
      </div>
    </section>
  )
}

export default StyleSection

