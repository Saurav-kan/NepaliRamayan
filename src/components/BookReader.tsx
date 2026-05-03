import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  clampDisplayPage,
  DISPLAY_PAGE_COUNT,
  displayPageFileName,
} from '../bookBounds'
import { PAGE_STORAGE_KEY } from '../bookUrl'
import { DEFAULT_START_DISPLAY } from '../readingConfig'

const PAGE_NUMBERS = Array.from(
  { length: DISPLAY_PAGE_COUNT },
  (_, i) => i + 1,
)

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
  const base = import.meta.env.BASE_URL
  const initialPage = readStoredDisplayPage()
  const pageRefs = useRef<Map<number, HTMLElement>>(new Map())
  const [loadErrors, setLoadErrors] = useState<Record<number, true>>({})

  // Restore scroll position once on load (session); refs ready after first paint.
  useLayoutEffect(() => {
    const el = pageRefs.current.get(initialPage)
    requestAnimationFrame(() => {
      el?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run only on mount
  }, [])

  useEffect(() => {
    const scores = new Map<number, number>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const pageNum = Number(
            (entry.target as HTMLElement).dataset.page ?? '1',
          )
          scores.set(pageNum, entry.intersectionRatio)
        }
        let bestPage = 1
        let bestScore = 0
        scores.forEach((score, p) => {
          if (score > bestScore) {
            bestScore = score
            bestPage = p
          }
        })
        if (bestScore > 0.05) {
          try {
            sessionStorage.setItem(PAGE_STORAGE_KEY, String(bestPage))
          } catch {
            /* ignore */
          }
        }
      },
      {
        root: null,
        threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1],
      },
    )

    for (const p of PAGE_NUMBERS) {
      const el = pageRefs.current.get(p)
      if (el) io.observe(el)
    }

    return () => io.disconnect()
  }, [])

  const onImgError = (pageNum: number) => {
    setLoadErrors((prev) => ({ ...prev, [pageNum]: true }))
  }

  return (
    <div className="reader-card reader-card--scroll">
      <div className="reader-scroll">
        {PAGE_NUMBERS.map((pageNum) => (
          <figure
            key={pageNum}
            className="reader-page-block"
            data-page={pageNum}
            ref={(el) => {
              if (el) pageRefs.current.set(pageNum, el)
              else pageRefs.current.delete(pageNum)
            }}
          >
            <figcaption className="reader-page-label">
              <span className="reader-page-label-num">{pageNum}</span>
              <span className="reader-page-label-sep" aria-hidden>
                /
              </span>
              <span className="reader-page-label-total">
                {DISPLAY_PAGE_COUNT}
              </span>
            </figcaption>
            {loadErrors[pageNum] ? (
              <p className="reader-page-error" role="alert">
                Page image missing. Run{' '}
                <code>bun run generate:pages</code> and deploy{' '}
                <code>public/book-pages/</code>.
              </p>
            ) : (
              <img
                src={`${base}book-pages/${displayPageFileName(pageNum)}`}
                alt={`Page ${pageNum} of ${DISPLAY_PAGE_COUNT}`}
                loading="lazy"
                decoding="async"
                className="reader-page-img"
                onError={() => onImgError(pageNum)}
              />
            )}
          </figure>
        ))}
      </div>
    </div>
  )
}
