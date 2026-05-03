import { NavLink } from 'react-router-dom'

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="मुख्य नेभिगेसन">
      <NavLink to="/" end>
        <span className="nav-icon" aria-hidden>
          📖
        </span>
        पुस्तक
      </NavLink>
      <NavLink to="/chapters">
        <span className="nav-icon" aria-hidden>
          📑
        </span>
        Chapters
      </NavLink>
    </nav>
  )
}
