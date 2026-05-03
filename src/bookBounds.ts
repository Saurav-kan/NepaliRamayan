/** First PDF page shown (inclusive). */
export const PDF_PAGE_FIRST = 46
/** Last PDF page shown (inclusive). */
export const PDF_PAGE_LAST = 72

/** Number of reader-facing pages (display 1 … N). */
export const DISPLAY_PAGE_COUNT = PDF_PAGE_LAST - PDF_PAGE_FIRST + 1

/** Map reader page index → PDF page number. */
export function displayToPdf(displayPage: number): number {
  return PDF_PAGE_FIRST + displayPage - 1
}

/** Map PDF page → reader index, or null if outside published range. */
export function pdfToDisplay(pdfPage: number): number | null {
  if (pdfPage < PDF_PAGE_FIRST || pdfPage > PDF_PAGE_LAST) return null
  return pdfPage - PDF_PAGE_FIRST + 1
}

export function clampDisplayPage(n: number): number {
  const x = Math.floor(Number(n))
  if (!Number.isFinite(x)) return 1
  return Math.min(DISPLAY_PAGE_COUNT, Math.max(1, x))
}

export function displayPageFileName(displayPage: number): string {
  return `${String(clampDisplayPage(displayPage)).padStart(3, '0')}.webp`
}
