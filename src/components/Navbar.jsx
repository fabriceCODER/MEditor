import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/docs', label: 'Documentation' },
  { to: '/templates', label: 'Templates' },
  { to: '/feedback', label: 'Feedback' },
  { to: '/settings', label: 'Settings' },
  { to: '/about', label: 'About' },
]

const Navbar = ({ onToggleTheme, theme }) => {
  const location = useLocation()
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-inner">
        <div className="navbar-logo-group">
          <span className="logo">M</span>
          <span className="navbar-title">Markdown Editor & Previewer</span>
        </div>
        <ul className="navbar-links">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  'navbar-link' + (isActive || (link.to === '/' && location.pathname === '/') ? ' navbar-link-active' : '')
                }
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  )
}

export default Navbar 