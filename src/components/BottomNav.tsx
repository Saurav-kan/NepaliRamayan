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
      <NavLink to="/event">
        <span className="nav-icon" aria-hidden>
          ℹ️
        </span>
        कार्यक्रम
      </NavLink>
    </nav>
  )
}
