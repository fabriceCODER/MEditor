import { useState, useEffect } from 'react'
import Editor from './Editor'
import Previewer from './Previewer'
import './App.css'

const DEFAULT_MARKDOWN = `# Welcome to the Markdown Editor!\n\nType some *Markdown* on the left, and see the **preview** on the right.\n\n\n## Features\n- Live preview\n- Syntax highlighting\n- Light/Dark mode\n\n\n\`\`\`js\n// Example code block\nfunction hello() {\n  console.log('Hello, world!');\n}\n\`\`\`
`;

function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [activeTab, setActiveTab] = useState('editor') // 'editor' or 'preview'
  const [isMobile, setIsMobile] = useState(false)

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

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  const handleTab = (tab) => setActiveTab(tab)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-color)', fontFamily: 'var(--font-sans)' }}>
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
              <Editor markdown={markdown} onChange={setMarkdown} />
            </section>
          )}
          {(isMobile ? activeTab === 'preview' : true) && (
            <section className="preview-card">
              <h2 className="sr-only">Preview</h2>
              <Previewer markdown={markdown} />
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
