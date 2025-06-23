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

  // Theme persistence and Tailwind dark mode
  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light-theme', 'dark-theme')
    } else {
      root.classList.remove('dark')
      root.classList.add('light-theme')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  const handleTab = (tab) => setActiveTab(tab)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 font-sans transition-colors duration-300">
      {/* Logo and Title Bar */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Logo (optional) */}
            <span className="inline-block w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">M</span>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Markdown Editor & Previewer</span>
          </div>
          <button
            className="ml-4 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition border border-gray-300 dark:border-gray-700 shadow"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Tab Toggle */}
        {isMobile && (
          <div className="flex justify-center gap-2 mb-4">
            <button
              className={`tab-toggle-btn${activeTab === 'editor' ? ' tab-toggle-btn-active' : ''} px-4 py-2 rounded-t-lg font-medium text-sm bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-b-2 transition ${activeTab === 'editor' ? 'border-blue-500 dark:border-blue-400' : 'border-transparent'}`}
              onClick={() => handleTab('editor')}
            >
              Editor
            </button>
            <button
              className={`tab-toggle-btn${activeTab === 'preview' ? ' tab-toggle-btn-active' : ''} px-4 py-2 rounded-t-lg font-medium text-sm bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-b-2 transition ${activeTab === 'preview' ? 'border-blue-500 dark:border-blue-400' : 'border-transparent'}`}
              onClick={() => handleTab('preview')}
            >
              Preview
            </button>
          </div>
        )}
        {/* Main Layout */}
        <main className={`flex ${isMobile ? 'flex-col gap-0' : 'md:flex-row gap-6'} w-full transition-all`}>
          {/* Editor Section */}
          {(isMobile ? activeTab === 'editor' : true) && (
            <section className="flex-1 mb-4 md:mb-0">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-0 flex flex-col h-full min-h-[400px]">
                <h2 className="sr-only">Editor</h2>
                <Editor markdown={markdown} onChange={setMarkdown} />
              </div>
            </section>
          )}
          {/* Preview Section */}
          {(isMobile ? activeTab === 'preview' : true) && (
            <section className="flex-1">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-0 flex flex-col h-full min-h-[400px]">
                <h2 className="sr-only">Preview</h2>
                <Previewer markdown={markdown} />
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
