import { useState, useEffect } from 'react'
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

function App() {
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-color)', fontFamily: 'var(--font-sans)' }}>
      <Toast message={infoToast.message} visible={infoToast.visible} onClose={() => setInfoToast(t => ({ ...t, visible: false }))} type={infoToast.type} />
      {/* Header with logo and theme toggle */}
      <header className="header">
        <div className="header-inner">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="logo">M</span>
            <span className="header-title">Markdown Editor & Previewer</span>
          </div>
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>
      {/* Main content container */}
      <div className="app-main-container">
        {/* Mobile Tab Toggle */}
        {isMobile && (
          <div className="tab-toggle-group">
            <button
              className={`tab-toggle-btn${activeTab === 'editor' ? ' tab-toggle-btn-active' : ''}`}
              onClick={() => handleTab('editor')}
            >
              Editor
            </button>
            <button
              className={`tab-toggle-btn${activeTab === 'preview' ? ' tab-toggle-btn-active' : ''}`}
              onClick={() => handleTab('preview')}
            >
              Preview
            </button>
          </div>
        )}
        {/* Main layout: side by side on desktop, stacked on mobile */}
        <main className="main-layout">
          {(isMobile ? activeTab === 'editor' : true) && (
            <section className="editor-card">
              <h2 className="sr-only">Editor</h2>
              <Editor
                files={files}
                setFiles={setFiles}
                activeFileId={activeFileId}
                setActiveFileId={setActiveFileId}
                onShare={() => setInfoToast({ visible: true, message: 'ℹ️ Share this URL with anyone to load this document.', type: 'info' })}
              />
            </section>
          )}
          {(isMobile ? activeTab === 'preview' : true) && (
            <section className="preview-card">
              <h2 className="sr-only">Preview</h2>
              <Previewer markdown={activeFile?.content || ''} />
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
