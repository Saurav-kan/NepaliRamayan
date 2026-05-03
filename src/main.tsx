import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

const rawBase = import.meta.env.BASE_URL
const routerBasename =
  rawBase === '/' ? undefined : rawBase.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={routerBasename}>
    <App />
  </BrowserRouter>,
)
