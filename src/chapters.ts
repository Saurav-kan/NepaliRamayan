import { clampDisplayPage } from './bookBounds'

export type Chapter = {
  id: string
  /** Editable label (Nepali). */
  titleNepali: string
  /** Optional subtitle for editors / SEO context. */
  titleEnglish?: string
  /** Reader page 1…27 (maps to PDF 46…72). */
  startDisplayPage: number
}

/**
 * Chapter jump targets — edit this list anytime.
 * `startDisplayPage` must be within the published page range.
 */
export const chapters: Chapter[] = [
  {
    id: 'start',
    titleNepali: 'सुरु (पृष्ठ १)',
    titleEnglish: 'Start — page 1 of reader',
    startDisplayPage: 1,
  },
  {
    id: 'sample-mid',
    titleNepali: 'मध्य खण्ड (उदाहरण)',
    titleEnglish: 'Middle sample',
    startDisplayPage: 10,
  },
  {
    id: 'near-end',
    titleNepali: 'अन्तिम नजिक (उदाहरण)',
    titleEnglish: 'Near end sample',
    startDisplayPage: 24,
  },
]

export function normalizedChapter(c: Chapter): Chapter {
  return {
    ...c,
    startDisplayPage: clampDisplayPage(c.startDisplayPage),
  }
}
