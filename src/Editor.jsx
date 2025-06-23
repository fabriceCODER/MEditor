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
    <div className="editor-outer" style={{ position: 'relative' }}>
      <Toast message={toast.message} visible={toast.visible} onClose={closeToast} type={toast.type} />
      <div className="editor-toolbar">
        <button
          className="editor-btn undo-btn"
          onClick={handleUndo}
          disabled={!isUndoAvailable}
          title="Undo (Ctrl+Z)"
        >
          ↩️ Undo
        </button>
        <button
          className="editor-btn redo-btn"
          onClick={handleRedo}
          disabled={!isRedoAvailable}
          title="Redo (Ctrl+Y)"
        >
          ↪️ Redo
        </button>
      </div>
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={markdown}
        onChange={e => onChange(e.target.value)}
        placeholder="Type your markdown here..."
        aria-label="Markdown Editor"
      />
      <div className="editor-buttons">
        <button
          className="editor-btn clear-btn"
          onClick={handleClear}
          disabled={!markdown}
          title="Clear editor"
        >
          🧹 Clear
        </button>
        <button
          className="editor-btn export-md-btn"
          onClick={handleExportMd}
          disabled={!markdown}
          title="Export as .md"
        >
          ⬇️ Export .md
        </button>
        <button
          className="editor-btn export-html-btn"
          onClick={handleExportHtml}
          disabled={!markdown}
          title="Export as .html"
        >
          ⬇️ Export .html
        </button>
      </div>
      {/* Auto-save indicator */}
      <div className={`autosave-indicator${showSaved ? ' autosave-indicator-visible' : ''}`}>
        💾 Auto-saved
      </div>
    </div>
  )
}

export default Editor 