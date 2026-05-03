import { Navigate, Route, Routes } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { BookPage } from './pages/BookPage'
import { ChaptersPage } from './pages/ChaptersPage'

export default function App() {
  return (
    <div className="app-shell">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<BookPage />} />
          <Route path="/chapters" element={<ChaptersPage />} />
          <Route path="/event" element={<Navigate to="/chapters" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
