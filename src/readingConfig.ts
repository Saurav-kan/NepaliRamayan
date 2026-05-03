/**
 * First page for new visitors (no saved page in sessionStorage).
 *
 * Fastest code change: edit `FALLBACK_START_PAGE` below.
 * Or set `VITE_DEFAULT_PAGE` in `.env` / GitHub Actions (overrides the fallback).
 */
const FALLBACK_START_PAGE = 46

function readDefaultStartPage(): number {
  const fromEnv = import.meta.env.VITE_DEFAULT_PAGE
  if (typeof fromEnv === 'string' && fromEnv.trim() !== '') {
    const n = parseInt(fromEnv.trim(), 10)
    if (Number.isFinite(n) && n >= 1) return n
  }
  return FALLBACK_START_PAGE
}

export const DEFAULT_START_PAGE = readDefaultStartPage()
