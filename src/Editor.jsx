import React, { useState, useRef, useEffect, useCallback } from 'react'
import Toast from './Toast'

// Helper to convert markdown to HTML for export
function markdownToHtml(markdown) {
  return `<!DOCTYPE html>\n<html><head><meta charset='UTF-8'><title>Markdown Preview</title></head><body>${window.marked ? window.marked.parse(markdown) : markdown.replace(/\n/g, '<br>')}</body></html>`
}

// Editor component for editing markdown text
const Editor = ({ markdown, onChange }) => {
  // Undo/Redo history
  const [history, setHistory] = useState([markdown])
  const [historyIndex, setHistoryIndex] = useState(0)
  const isUndoAvailable = historyIndex > 0
  const isRedoAvailable = historyIndex < history.length - 1

  // Toast state
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })
  // Auto-save indicator state
  const [showSaved, setShowSaved] = useState(false)
  const saveTimeout = useRef(null)
  const fadeTimeout = useRef(null)
  const prevMarkdown = useRef(markdown)
  const textareaRef = useRef(null)

  // Update history on markdown change
  useEffect(() => {
    if (markdown !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(markdown)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
    // eslint-disable-next-line
  }, [markdown])

  // Undo handler
  const handleUndo = useCallback(() => {
    if (isUndoAvailable) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      onChange(history[newIndex])
      setToast({ visible: true, message: '↩️ Undo', type: 'success' })
    }
  }, [isUndoAvailable, history, historyIndex, onChange])

  // Redo handler
  const handleRedo = useCallback(() => {
    if (isRedoAvailable) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      onChange(history[newIndex])
      setToast({ visible: true, message: '↪️ Redo', type: 'success' })
    }
  }, [isRedoAvailable, history, historyIndex, onChange])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        handleUndo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo])

  // Auto-save effect
  useEffect(() => {
    if (prevMarkdown.current !== markdown) {
      setShowSaved(false)
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
      saveTimeout.current = setTimeout(() => {
        setShowSaved(true)
        fadeTimeout.current = setTimeout(() => setShowSaved(false), 1200)
      }, 1500)
      prevMarkdown.current = markdown
    }
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
    }
  }, [markdown])

  // Toast close handler
  const closeToast = () => setToast(t => ({ ...t, visible: false }))

  // Clear editor and remove from localStorage
  const handleClear = () => {
    onChange('')
    localStorage.removeItem('markdown')
  }

  // Export as .md file
  const handleExportMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'markdown_export.md'
    a.click()
    URL.revokeObjectURL(url)
    setToast({ visible: true, message: '✅ Markdown exported as .md file!', type: 'success' })
  }

  // Export as .html file
  const handleExportHtml = () => {
    const html = markdownToHtml(markdown)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'preview_export.html'
    a.click()
    URL.revokeObjectURL(url)
    setToast({ visible: true, message: '✅ HTML preview exported!', type: 'success' })
  }

  return (
    <div className="relative flex flex-col h-full">
      {/* Toast notification */}
      <Toast message={toast.message} visible={toast.visible} onClose={closeToast} type={toast.type} />
      {/* Toolbar */}
      <div className="flex gap-2 px-4 pt-4 pb-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-2xl">
        <button
          className="editor-btn undo-btn px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleUndo}
          disabled={!isUndoAvailable}
          title="Undo (Ctrl+Z)"
        >
          ↩️ Undo
        </button>
        <button
          className="editor-btn redo-btn px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleRedo}
          disabled={!isRedoAvailable}
          title="Redo (Ctrl+Y)"
        >
          ↪️ Redo
        </button>
      </div>
      {/* Editor Textarea */}
      <textarea
        ref={textareaRef}
        className="editor-textarea flex-1 w-full resize-none p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-none outline-none font-mono text-base rounded-b-2xl focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition shadow-inner"
        value={markdown}
        onChange={e => onChange(e.target.value)}
        placeholder="Type your markdown here..."
        aria-label="Markdown Editor"
        spellCheck={true}
      />
      {/* Action Buttons */}
      <div className="flex gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-b-2xl">
        <button
          className="editor-btn clear-btn px-3 py-1.5 rounded-md bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-700 shadow-sm hover:bg-red-200 dark:hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleClear}
          disabled={!markdown}
          title="Clear editor"
        >
          🧹 Clear
        </button>
        <button
          className="editor-btn export-md-btn px-3 py-1.5 rounded-md bg-blue-600 text-white border border-blue-700 shadow-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleExportMd}
          disabled={!markdown}
          title="Export as .md"
        >
          ⬇️ Export .md
        </button>
        <button
          className="editor-btn export-html-btn px-3 py-1.5 rounded-md bg-green-600 text-white border border-green-700 shadow-sm hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleExportHtml}
          disabled={!markdown}
          title="Export as .html"
        >
          ⬇️ Export .html
        </button>
      </div>
      {/* Auto-save indicator */}
      <div className={`autosave-indicator absolute bottom-4 right-4 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg shadow transition-opacity duration-300 ${showSaved ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        💾 Auto-saved
      </div>
    </div>
  )
}

export default Editor 