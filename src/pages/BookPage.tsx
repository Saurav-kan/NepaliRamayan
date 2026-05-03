import { BookReader } from '../components/BookReader'

export function BookPage() {
  return (
    <>
      <header className="book-header">
        <p className="book-header-line book-header-line--ne">रामचरितमानस</p>
        <p className="book-header-line book-header-line--en">Ram Charitmanas</p>
      </header>
      <BookReader />
    </>
  )
}
