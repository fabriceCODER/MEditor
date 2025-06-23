import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const features = [
  { icon: '⚡', label: 'Live preview' },
  { icon: '🌗', label: 'Dark/light themes' },
  { icon: '⬇️', label: 'Export to PDF/Markdown/HTML' },
  { icon: '🕑', label: 'Version history' },
  { icon: '📄', label: 'Custom templates' },
]

const LandingPage = ({ onToggleTheme, theme }) => {
  const navigate = useNavigate()
  return (
    <div className="landing-root">
      <Navbar onToggleTheme={onToggleTheme} theme={theme} />
      <main className="landing-main">
        <section className="landing-hero">
          <h1 className="landing-title">Markdown Editor & Previewer</h1>
          <p className="landing-desc">A fast, modern, offline-ready Markdown editing tool for writers, developers, and teams.</p>
          <button className="landing-cta" onClick={() => navigate('/dashboard')}>Start Editing</button>
        </section>
        <section className="landing-features">
          <h2 className="landing-features-title">Core Features</h2>
          <ul className="landing-features-list">
            {features.map(f => (
              <li key={f.label} className="landing-feature-item">
                <span className="landing-feature-icon" aria-hidden>{f.icon}</span>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
          {/* Optionally add a screenshot or GIF here */}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage 