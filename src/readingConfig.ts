import { clampDisplayPage, DISPLAY_PAGE_COUNT } from './bookBounds'

/**
 * Default **display** page (1 = first image = PDF page 46).
 * Edit `FALLBACK_START_DISPLAY` or set `VITE_DEFAULT_PAGE` (1 through DISPLAY_PAGE_COUNT).
 */
const FALLBACK_START_DISPLAY = 1

function readDefaultStartDisplay(): number {
  const fromEnv = import.meta.env.VITE_DEFAULT_PAGE
  if (typeof fromEnv === 'string' && fromEnv.trim() !== '') {
    const n = parseInt(fromEnv.trim(), 10)
    if (Number.isFinite(n) && n >= 1 && n <= DISPLAY_PAGE_COUNT) return n
  }
  return clampDisplayPage(FALLBACK_START_DISPLAY)
}

export const DEFAULT_START_DISPLAY = readDefaultStartDisplay()
