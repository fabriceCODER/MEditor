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
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center shadow">M</span>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight ml-1">MEditor</span>
        </div>
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg font-medium transition-colors ${isActive || (link.to === '/' && location.pathname === '/') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`
                }
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button
          className="ml-4 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow"
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