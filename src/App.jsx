import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import DocumentationPage from './pages/DocumentationPage'
import TemplatesPage from './pages/TemplatesPage'
import SettingsPage from './pages/SettingsPage'
import FeedbackPage from './pages/FeedbackPage'
import AboutPage from './pages/AboutPage'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './Toast'
import './App.css'

// Placeholder page components
function Documentation() {
  return (
    <div className="page-content">
      <h1>Documentation</h1>
      <h2>Markdown Syntax Cheat Sheet</h2>
      <pre style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
{`# Heading 1
## Heading 2
**Bold**  *Italic*  ~~Strikethrough~~
[Link](https://example.com)
- List item
1. Numbered item
> Blockquote


'three backticks for code blocks
`}
      </pre>
      <h2>FAQ</h2>
      <ul>
        <li><b>How do I export?</b> Use the export buttons in the editor.</li>
        <li><b>How do I share?</b> Use the Share button to copy a public URL.</li>
      </ul>
    </div>
  )
}
function Settings() {
  return (
    <div className="page-content">
      <h1>Settings</h1>
      <p>Customize themes, fonts, keyboard shortcuts, and auto-save options here (coming soon).</p>
    </div>
  )
}
function Templates() {
  return (
    <div className="page-content">
      <h1>Templates Library</h1>
      <p>Browse, preview, and import/export Markdown templates (coming soon).</p>
    </div>
  )
}
function About() {
  return (
    <div className="page-content">
      <h1>About / Contact</h1>
      <p>This app was built for Markdown editing and previewing. Find the repo and contact info below.</p>
      <ul>
        <li><a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">GitHub Repo</a></li>
        <li>Email: <a href="mailto:fabricecoder009@gmail.com">fabricecoder009@gmail.com</a></li>
      </ul>
    </div>
  )
}
function Feedback() {
  return (
    <div className="page-content">
      <h1>Feedback / Feature Request</h1>
      <form style={{ maxWidth: 400 }}>
        <label htmlFor="feedback">Your feedback or feature request:</label>
        <textarea id="feedback" rows={4} style={{ width: '100%', margin: '8px 0', borderRadius: 6, border: '1px solid var(--border-color)', padding: 8 }} />
        <button className="editor-btn export-md-btn" type="submit">Submit</button>
      </form>
    </div>
  )
}

const DEFAULT_FILE = () => ({
  id: Date.now().toString(),
  name: 'untitled.md',
  content: ''
})

function decodeFromUrl(str) {
  try {
    str = str.replace(/-/g, '+').replace(/_/g, '/')
    while (str.length % 4) str += '='
    return decodeURIComponent(escape(atob(str)))
  } catch {
    return ''
  }
}

function Layout({ children, onToggleTheme, theme }) {
  return (
    <>
      <Navbar onToggleTheme={onToggleTheme} theme={theme} />
      <div className="app-main-container">{children}</div>
      <Footer />
    </>
  )
}

function App(props) {
  // Toast for info/warning
  const [infoToast, setInfoToast] = useState({ visible: false, message: '', type: 'info' })
  // Multi-file state
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('markdown-files')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch {}
    }
    return [DEFAULT_FILE()]
  })
  const [activeFileId, setActiveFileId] = useState(() => {
    const saved = localStorage.getItem('markdown-files')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].id
      } catch {}
    }
    return null
  })
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  // On mount, check for ?md= in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const md = params.get('md')
    if (md) {
      const decoded = decodeFromUrl(md)
      if (decoded) {
        setFiles([{ id: Date.now().toString(), name: 'shared.md', content: decoded }])
        setActiveFileId(f => f || Date.now().toString())
        setInfoToast({ visible: true, message: 'ℹ️ Loaded Markdown from URL. Local files were replaced.', type: 'info' })
      }
    }
    // eslint-disable-next-line
  }, [])

  // Theme persistence and vanilla CSS dark mode
  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark-mode')
      root.classList.remove('light-theme', 'dark')
    } else {
      root.classList.remove('dark-mode')
      root.classList.add('light-theme')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  // Ensure activeFileId is always valid
  useEffect(() => {
    if (!files.find(f => f.id === activeFileId)) {
      setActiveFileId(files[0]?.id)
    }
  }, [files, activeFileId])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <Router>
      <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-color)', fontFamily: 'var(--font-sans)' }}>
        <Toast message={infoToast.message} visible={infoToast.visible} onClose={() => setInfoToast(t => ({ ...t, visible: false }))} type={infoToast.type} />
        <Routes>
          <Route path="/" element={<Layout onToggleTheme={toggleTheme} theme={theme}><LandingPage onToggleTheme={toggleTheme} theme={theme} /></Layout>} />
          <Route path="/dashboard" element={<Layout onToggleTheme={toggleTheme} theme={theme}><Dashboard files={files} setFiles={setFiles} activeFileId={activeFileId} setActiveFileId={setActiveFileId} theme={theme} onToggleTheme={toggleTheme} /></Layout>} />
          <Route path="/docs" element={<Layout onToggleTheme={toggleTheme} theme={theme}><DocumentationPage /></Layout>} />
          <Route path="/templates" element={<Layout onToggleTheme={toggleTheme} theme={theme}><TemplatesPage /></Layout>} />
          <Route path="/settings" element={<Layout onToggleTheme={toggleTheme} theme={theme}><SettingsPage /></Layout>} />
          <Route path="/feedback" element={<Layout onToggleTheme={toggleTheme} theme={theme}><FeedbackPage /></Layout>} />
          <Route path="/about" element={<Layout onToggleTheme={toggleTheme} theme={theme}><AboutPage /></Layout>} />
          <Route path="*" element={<Layout onToggleTheme={toggleTheme} theme={theme}><NotFound /></Layout>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
