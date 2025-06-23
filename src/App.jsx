import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Editor from './Editor'
import Previewer from './Previewer'
import Toast from './Toast'
import './App.css'

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

// Placeholder page components
function Home() {
  return (
    <div className="page-content">
      <h1>Welcome to the Markdown Editor & Previewer</h1>
      <p>Quick start, overview, and tutorial video coming soon.</p>
      <ul>
        <li>Use the navigation bar to explore features.</li>
        <li>Start editing Markdown in the Editor tab.</li>
      </ul>
    </div>
  )
}
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
        <li>Email: <a href="mailto:developer@example.com">developer@example.com</a></li>
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

function AppRoutes(props) {
  // Pass all props to Editor page
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/editor" element={
        <div className="main-layout">
          <section className="editor-card">
            <h2 className="sr-only">Editor</h2>
            <Editor {...props} />
          </section>
          <section className="preview-card">
            <h2 className="sr-only">Preview</h2>
            <Previewer markdown={props.files.find(f => f.id === props.activeFileId)?.content || ''} />
          </section>
        </div>
      } />
      <Route path="/docs" element={<Documentation />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/about" element={<About />} />
      <Route path="/feedback" element={<Feedback />} />
    </Routes>
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
  const [activeTab, setActiveTab] = useState('editor') // 'editor' or 'preview'
  const [isMobile, setIsMobile] = useState(false)

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

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
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
  const handleTab = (tab) => setActiveTab(tab)

  const activeFile = files.find(f => f.id === activeFileId) || files[0]

  return (
    <Router>
      <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-color)', fontFamily: 'var(--font-sans)' }}>
        {/* Navigation Bar */}
        <nav className="nav-bar" style={{ background: 'var(--header-bg)', borderBottom: '1px solid var(--border-color)', padding: '0.5rem 0' }}>
          <div className="header-inner">
            <span className="logo">M</span>
            <span className="header-title">Markdown Editor & Previewer</span>
            <div style={{ display: 'flex', gap: 16, marginLeft: 'auto' }}>
              <Link to="/">Home</Link>
              <Link to="/editor">Editor</Link>
              <Link to="/docs">Docs</Link>
              <Link to="/settings">Settings</Link>
              <Link to="/templates">Templates</Link>
              <Link to="/about">About</Link>
              <Link to="/feedback">Feedback</Link>
            </div>
          </div>
        </nav>
        {/* Main content container */}
        <div className="app-main-container">
          <AppRoutes {...props} />
        </div>
      </div>
    </Router>
  )
}

export default App
