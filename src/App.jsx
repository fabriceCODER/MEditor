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

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark-theme')
      root.classList.remove('light-theme')
    } else {
      root.classList.add('light-theme')
      root.classList.remove('dark-theme')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  // Tab toggle handler
  const handleTab = (tab) => setActiveTab(tab)

  return (
    <div className="app-container">
      <header className="header">
        <h1>Markdown Editor & Previewer</h1>
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'} Mode
        </button>
      </header>
      {/* Tab toggles for mobile only */}
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
      <main className={`main${isMobile ? ' main-mobile' : ''}`}>
        {/* Mobile: show only selected tab; Desktop: show both */}
        {isMobile ? (
          activeTab === 'editor' ? (
            <section className="editor-section">
              <h2>Editor</h2>
              <div className="editor-wrapper">
                <Editor markdown={markdown} onChange={setMarkdown} />
              </div>
            </section>
          ) : (
            <section className="preview-section">
              <h2>Preview</h2>
              <div className="preview-wrapper">
                <Previewer markdown={markdown} />
              </div>
            </section>
          )
        ) : (
          <>
            <section className="editor-section">
              <h2>Editor</h2>
              <div className="editor-wrapper">
                <Editor markdown={markdown} onChange={setMarkdown} />
              </div>
            </section>
            <section className="preview-section">
              <h2>Preview</h2>
              <div className="preview-wrapper">
                <Previewer markdown={markdown} />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default App
