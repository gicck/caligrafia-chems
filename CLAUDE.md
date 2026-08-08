# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the built bundle
- `npm run lint` — run `oxlint` (no custom config; there is no test runner in this project)

## What this app is

Single-page React + Vite app (JavaScript, no TypeScript) that generates a printable A4 handwriting-practice worksheet from Spanish text. The user types a title and phrase, optionally decorates with emoji/image stickers, and hits "Imprimir / Descargar PDF" — the browser's own print dialog is the export mechanism (`window.print()` in `InputForm.jsx`).

## Architecture

Two-pane layout in `App.jsx`: `InputForm` (left) owns all input state, `Worksheet` (right) renders the live A4 preview. State (`title`, `text`, `includeDecorations`, `images`) lives in `App` and is passed down; there are no stores, contexts, or effects beyond `useState`/`useRef`/`useMemo`.

The worksheet always renders **two** `StyleSection`s stacked on the same page:
1. Cursive — model font `Playwrite MX`, tracing/guide font `Playwrite MX Guides`
2. Print — `Andika` for both model and tracing

Each `StyleSection` = one model line (`HandwritingLine ruled={false}`) + a filler block of ruled/faded tracing lines (`HandwritingLine ruled` + `faded`). Fonts are loaded from Google Fonts in `index.html`; adding a style means adding the font link there too.

### Auto-fit logic (StyleSection.jsx)

Row height and model font size shrink linearly from their base values to their floors as character count grows between `FIT_START_CHARS` (380) and `FIT_END_CHARS` (620). Text longer than ~620 chars will overflow the fixed `SECTION_HEIGHT` (128mm) — the sizing floors are intentional to keep letters legible rather than fitting arbitrary length.

### Preview scale is duplicated — keep in sync

`.a4-page` in `App.css` uses `transform: scale(0.62)` to fit the 210mm×297mm page into the preview pane. `HandwritingLine.jsx` hard-codes the same value as `PREVIEW_SCALE = 0.62` so that `react-draggable`'s `scale` prop and pixel↔mm math for sticker drag/resize stay accurate. **If you change one, change the other.**

### Stickers and margin rails

`HandwritingLine` with `ruled={false}` renders a three-column layout: left rail | model text | right rail. Stickers only exist in these rails — never on the ruled tracing lines. Each sticker has `{ id, type: 'emoji'|'upload', value, side: 'left'|'right', x, y, size }`. They are `react-draggable` with `bounds="parent"` (clamped to their rail) and get a bottom-right resize handle plus a `⇄` side-toggle button. `InputForm.jsx` balances new stickers between left/right rails and staggers their initial positions so they don't stack.

### Print behavior

`@media print` in `App.css` hides everything except `.print-area` (applied to the A4 root), removes the preview transform, and hides sticker controls (`.plain-text__resize-handle`, `.plain-text__side-toggle`) so the printed page shows only the artwork itself. `@page { size: A4; margin: 0 }` — page margins are handled inside `.a4-page` padding, not by the browser.

## Language

All user-facing strings are Spanish. Keep new copy in Spanish to match.
