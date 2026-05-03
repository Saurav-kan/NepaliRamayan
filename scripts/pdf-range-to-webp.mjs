#!/usr/bin/env bun
/**
 * Rasterizes PDF pages 46–72 to WebP files for the static reader.
 * Requires native module `canvas` (may need build tools on Windows).
 *
 * Usage: bun run generate:pages
 * Input: public/book.pdf (override with PDF_INPUT=/path/to/file.pdf)
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createCanvas } from 'canvas'
import sharp from 'sharp'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

const __root = dirname(fileURLToPath(import.meta.url))
const workerPath = join(
  __root,
  '..',
  'node_modules',
  'pdfjs-dist',
  'build',
  'pdf.worker.mjs',
)
pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href

const root = join(__root, '..')
const pdfPath = process.env.PDF_INPUT ?? join(root, 'public', 'book.pdf')
const outDir = join(root, 'public', 'book-pages')

const PDF_PAGE_FIRST = 46
const PDF_PAGE_LAST = 72
const SCALE = 2

await mkdir(outDir, { recursive: true })

const fileBuffer = await readFile(pdfPath)
const loadingTask = pdfjsLib.getDocument({
  data: new Uint8Array(fileBuffer),
  useSystemFonts: true,
})
const pdf = await loadingTask.promise

for (let pdfPage = PDF_PAGE_FIRST; pdfPage <= PDF_PAGE_LAST; pdfPage++) {
  const page = await pdf.getPage(pdfPage)
  const viewport = page.getViewport({ scale: SCALE })
  const canvas = createCanvas(viewport.width, viewport.height)
  const ctx = canvas.getContext('2d')
  const renderTask = page.render({
    canvasContext: ctx,
    viewport,
  })
  await renderTask.promise

  const pngBuffer = canvas.toBuffer('image/png')
  const display = pdfPage - PDF_PAGE_FIRST + 1
  const fileName = `${String(display).padStart(3, '0')}.webp`
  const webpBuffer = await sharp(pngBuffer).webp({ quality: 82 }).toBuffer()
  await writeFile(join(outDir, fileName), webpBuffer)
  console.log(`Wrote ${fileName} ← PDF page ${pdfPage}`)
}

const manifest = {
  displayCount: PDF_PAGE_LAST - PDF_PAGE_FIRST + 1,
  pdfFirst: PDF_PAGE_FIRST,
  pdfLast: PDF_PAGE_LAST,
  webpPattern: '{display}.webp',
  scale: SCALE,
}

await writeFile(join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log('manifest.json written. Done.')
