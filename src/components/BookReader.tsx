import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  clampDisplayPage,
  DISPLAY_PAGE_COUNT,
  displayPageFileName,
} from '../bookBounds'
import { BOOK_URL, PAGE_STORAGE_KEY } from '../bookUrl'
import { DEFAULT_START_DISPLAY } from '../readingConfig'

function readStoredDisplayPage(): number {
  try {
    const raw = sessionStorage.getItem(PAGE_STORAGE_KEY)
    if (!raw) return DEFAULT_START_DISPLAY
    const n = parseInt(raw, 10)
    return Number.isFinite(n) && n >= 1 ? clampDisplayPage(n) : DEFAULT_START_DISPLAY
  } catch {
    return DEFAULT_START_DISPLAY
  }
}

export function BookReader() {
  const [displayPage, setDisplayPage] = useState(readStoredDisplayPage)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [displayPage])

  useEffect(() => {
    try {
      sessionStorage.setItem(PAGE_STORAGE_KEY, String(displayPage))
    } catch {
      /* ignore */
    }
  }, [displayPage])

  const base = import.meta.env.BASE_URL
  const imageSrc = useMemo(
    () =>
      `${base}book-pages/${displayPageFileName(displayPage)}`,
    [base, displayPage],
  )

  const pdfDownloadHref = useMemo(() => {
    if (BOOK_URL.startsWith('http://') || BOOK_URL.startsWith('https://')) {
      return BOOK_URL
    }
    return new URL(BOOK_URL, window.location.origin).href
  }, [])

  const goPrev = () =>
    setDisplayPage((p) => Math.max(1, p - 1))
  const goNext = () =>
    setDisplayPage((p) => Math.min(DISPLAY_PAGE_COUNT, p + 1))

  const onPageInputChange = useCallback((value: string) => {
    const n = parseInt(value, 10)
    if (!Number.isFinite(n)) return
    setDisplayPage(clampDisplayPage(n))
  }, [])

  return (
    <div className="reader-card">
      <div className="reader-toolbar">
        <button type="button" onClick={goPrev} disabled={displayPage <= 1}>
          Previous
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={displayPage >= DISPLAY_PAGE_COUNT}
        >
          Next
        </button>
        <div className="page-field">
          <label htmlFor="page-input">Page</label>
          <input
            id="page-input"
            type="number"
            min={1}
            max={DISPLAY_PAGE_COUNT}
            value={displayPage}
            onChange={(e) => onPageInputChange(e.target.value)}
            aria-label="Page number"
          />
          <span>/ {DISPLAY_PAGE_COUNT}</span>
        </div>
      </div>

      <div className="reader-canvas reader-canvas--image">
        {imageError ? (
          <p className="reader-error" role="alert">
            Page image failed to load. Run{' '}
            <code style={{ fontSize: '0.85em' }}>bun run generate:pages</code> locally
            and deploy <code style={{ fontSize: '0.85em' }}>public/book-pages/*.webp</code>.
          </p>
        ) : (
          <img
            src={imageSrc}
            alt={`Page ${displayPage} of ${DISPLAY_PAGE_COUNT}`}
            loading="lazy"
            decoding="async"
            className="reader-page-img"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <p className="reader-download-row">
        <a href={pdfDownloadHref} download className="reader-download-link">
          Download PDF
        </a>
      </p>
    </div>
  )
}
