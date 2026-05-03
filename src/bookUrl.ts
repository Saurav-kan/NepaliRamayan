/** Public PDF path or full URL (override with VITE_BOOK_URL). */
const envUrl = import.meta.env.VITE_BOOK_URL

export const BOOK_URL =
  typeof envUrl === 'string' && envUrl.trim() !== ''
    ? envUrl.trim()
    : `${import.meta.env.BASE_URL}book.pdf`

export const PAGE_STORAGE_KEY = 'nepali-ramayan-page'
