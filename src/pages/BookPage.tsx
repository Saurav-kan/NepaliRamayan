import { BookReader } from '../components/BookReader'

export function BookPage() {
  return (
    <>
      <h1 className="sr-only">
        नेपाली रामचरितमानस — Nepali Ram Charitmanas (Ramayan) by Tulasi Ram Kandel
      </h1>
      <section className="book-intro" aria-labelledby="book-intro-heading">
        <h2 id="book-intro-heading" className="book-intro-title">
          नेपाली रामचरितमानस · Nepali Ram Charitmanas
        </h2>
        <p className="book-intro-text">
          यो साइटमा तुलसी राम कन्डेलको नेपाली रामचरितमानस (Nepali Ramayan / Ram
          Charitmanas) का छानिएका पृष्ठहरू पढ्न सकिन्छ।{' '}
          <span lang="en">
            Read selections from the Nepali Ramayan (Ram Charitmanas) by Tulasi Ram
            Kandel — online reader with chapters.
          </span>
        </p>
      </section>
      <h2 className="page-title">पुस्तक</h2>
      <BookReader />
    </>
  )
}
