import { useCallback, useEffect, useMemo, useState } from 'react'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { BOOK_URL, PAGE_STORAGE_KEY } from '../bookUrl'
import { DEFAULT_START_PAGE } from '../readingConfig'

function readStoredPage(): number {
  try {
    const raw = sessionStorage.getItem(PAGE_STORAGE_KEY)
    if (!raw) return DEFAULT_START_PAGE
    const n = parseInt(raw, 10)
    return Number.isFinite(n) && n >= 1 ? n : DEFAULT_START_PAGE
  } catch {
    return DEFAULT_START_PAGE
  }
}

export function PdfReader() {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(readStoredPage)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [pageWidth, setPageWidth] = useState(() =>
    typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 720) : 320,
  )

  useEffect(() => {
    const onResize = () =>
      setPageWidth(Math.min(window.innerWidth - 32, 720))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(PAGE_STORAGE_KEY, String(pageNumber))
    } catch {
      /* ignore */
    }
  }, [pageNumber])

  const onDocumentLoadSuccess = useCallback(
    ({ numPages: total }: { numPages: number }) => {
      setNumPages(total)
      setLoadError(null)
      setPageNumber((p) => Math.min(Math.max(1, p), total))
    },
    [],
  )

  const onDocumentLoadError = useCallback((err: unknown) => {
    console.error(err)
    const detail =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : ''
    setLoadError(
      `पुस्तक लोड हुन सकेन। कृपया \`public/book.pdf\` जाँच गर्नुहोस् वा \`VITE_BOOK_URL\` सेट गर्नुहोस्।${detail ? ` (${detail})` : ''}`,
    )
  }, [])

  /** pdf.js is pickier on some mobile browsers when given a relative URL. */
  const fileSource = useMemo(() => {
    if (BOOK_URL.startsWith('http://') || BOOK_URL.startsWith('https://')) {
      return BOOK_URL
    }
    return new URL(BOOK_URL, window.location.origin).href
  }, [])

  const goPrev = () =>
    setPageNumber((p) => Math.max(1, p - 1))
  const goNext = () =>
    setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p))

  const onPageInputChange = (value: string) => {
    const n = parseInt(value, 10)
    if (!numPages || !Number.isFinite(n)) return
    setPageNumber(Math.min(Math.max(1, n), numPages))
  }

  return (
    <div className="reader-card">
      <div className="reader-toolbar">
        <button type="button" onClick={goPrev} disabled={pageNumber <= 1}>
          Previous
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!numPages || pageNumber >= numPages}
        >
          Next
        </button>
        <div className="page-field">
          <label htmlFor="page-input">Page</label>
          <input
            id="page-input"
            type="number"
            min={1}
            max={numPages ?? undefined}
            value={pageNumber}
            onChange={(e) => onPageInputChange(e.target.value)}
            aria-label="Page number"
          />
          {numPages != null ? (
            <span>/ {numPages}</span>
          ) : (
            <span>…</span>
          )}
        </div>
      </div>

      <div className="reader-canvas">
        {loadError ? (
          <p className="reader-error" role="alert">
            {loadError}
          </p>
        ) : (
          <Document
            file={fileSource}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<p className="reader-status">लोड हुँदैछ…</p>}
          >
            {numPages != null ? (
              <Page
                pageNumber={Math.min(pageNumber, numPages)}
                width={pageWidth}
                renderTextLayer
                renderAnnotationLayer
              />
            ) : null}
          </Document>
        )}
      </div>
    </div>
  )
}
