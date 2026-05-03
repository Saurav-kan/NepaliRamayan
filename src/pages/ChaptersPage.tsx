import { useNavigate } from 'react-router-dom'
import { chapters, normalizedChapter } from '../chapters'
import { PAGE_STORAGE_KEY } from '../bookUrl'

export function ChaptersPage() {
  const navigate = useNavigate()

  const goToChapter = (startDisplayPage: number) => {
    try {
      sessionStorage.setItem(PAGE_STORAGE_KEY, String(startDisplayPage))
    } catch {
      /* ignore */
    }
    navigate('/')
  }

  return (
    <>
      <h1 className="page-title">अध्याय / Chapters</h1>
      <p className="book-intro-text" style={{ marginBottom: '1rem' }}>
        एउटा अध्याय छान्नुहोस् — पुस्तक त्यही पृष्ठबाट खुल्छ।
      </p>
      <ul className="chapters-list">
        {chapters.map((raw) => {
          const ch = normalizedChapter(raw)
          return (
            <li key={ch.id}>
              <button type="button" onClick={() => goToChapter(ch.startDisplayPage)}>
                {ch.titleNepali}
                {ch.titleEnglish ? (
                  <span className="muted" style={{ display: 'block', fontWeight: 500 }}>
                    {ch.titleEnglish}
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
