import React, { useState, useRef, useEffect, useCallback } from 'react'
import Toast from './Toast'
import JSZip from 'jszip'
import Mousetrap from 'mousetrap'
import { saveAs } from 'file-saver'
import htmlToDocx from 'html-to-docx'
import latex from 'latex.js'

// Helper to convert markdown to HTML for export
function markdownToHtml(markdown) {
  return `<!DOCTYPE html>\n<html><head><meta charset='UTF-8'><title>Markdown Preview</title></head><body>${window.marked ? window.marked.parse(markdown) : markdown.replace(/\n/g, '<br>')}</body></html>`
}

function encodeForUrl(str) {
  // URL-safe base64
  return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function markdownToRtf(md) {
  // Very basic Markdown to RTF (bold, italic, heading, list, code)
  let rtf = '{\\rtf1\n'
  rtf += md
    .replace(/^# (.*)$/gm, '\\b \\fs36 $1 \\b0 \\fs24\n')
    .replace(/\*\*(.*?)\*\*/g, '\\b $1 \\b0')
    .replace(/\*(.*?)\*/g, '\\i $1 \\i0')
    .replace(/`([^`]+)`/g, '{\\f1 $1}')
    .replace(/^- (.*)$/gm, '\\bullet $1 \\par')
    .replace(/\n/g, '\\par\n')
  rtf += '}'
  return rtf
}

function markdownToSlides(md) {
  // Split by --- or H1 for slides
  const slides = md.split(/^---$/gm)
  return `<!DOCTYPE html>\n<html><head><meta charset='UTF-8'><title>Slides</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/theme/white.css"></head><body><div class="reveal"><div class="slides">${slides
    .map(s => `<section>${window.marked ? window.marked.parse(s) : s.replace(/\n/g, '<br>')}</section>`) .join('')}</div></div><script src="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.js"></script><script>Reveal.initialize();</script></body></html>`
}

const DEFAULT_FILE = () => ({
  id: Date.now().toString(),
  name: 'untitled.md',
  content: ''
})

const DEFAULT_SHORTCUTS = {
  bold: 'mod+b',
  italic: 'mod+i',
  heading: 'mod+shift+h',
  code: 'mod+shift+c',
  list: 'mod+shift+l',
}

const HISTORY_LIMIT = 20

const Editor = ({ files, setFiles, activeFileId, setActiveFileId, onShare }) => {
  const activeFile = files.find(f => f.id === activeFileId) || files[0]
  // Undo/Redo history per file
  const [history, setHistory] = useState([activeFile.content])
  const [historyIndex, setHistoryIndex] = useState(0)
  const isUndoAvailable = historyIndex > 0
  const isRedoAvailable = historyIndex < history.length - 1

  // Toast state
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })
  // Auto-save indicator state
  const [showSaved, setShowSaved] = useState(false)
  const saveTimeout = useRef(null)
  const fadeTimeout = useRef(null)
  const prevContent = useRef(activeFile.content)
  const textareaRef = useRef(null)
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')

  // Update history when switching files
  useEffect(() => {
    setHistory([activeFile.content])
    setHistoryIndex(0)
    prevContent.current = activeFile.content
  }, [activeFileId])

  // Update history on content change
  useEffect(() => {
    if (activeFile.content !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(activeFile.content)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
    // eslint-disable-next-line
  }, [activeFile.content])

  // Undo handler
  const handleUndo = useCallback(() => {
    if (isUndoAvailable) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      updateFileContent(history[newIndex])
      setToast({ visible: true, message: '↩️ Undo', type: 'success' })
    }
  }, [isUndoAvailable, history, historyIndex])

  // Redo handler
  const handleRedo = useCallback(() => {
    if (isRedoAvailable) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      updateFileContent(history[newIndex])
      setToast({ visible: true, message: '↪️ Redo', type: 'success' })
    }
  }, [isRedoAvailable, history, historyIndex])

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
    if (prevContent.current !== activeFile.content) {
      setShowSaved(false)
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
      saveTimeout.current = setTimeout(() => {
        setShowSaved(true)
        fadeTimeout.current = setTimeout(() => setShowSaved(false), 1200)
      }, 1500)
      prevContent.current = activeFile.content
    }
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
    }
  }, [activeFile.content])

  // Persist files in localStorage
  useEffect(() => {
    localStorage.setItem('markdown-files', JSON.stringify(files))
  }, [files])

  // Toast close handler
  const closeToast = () => setToast(t => ({ ...t, visible: false }))

  // Update file content
  const updateFileContent = (content) => {
    setFiles(files => files.map(f => f.id === activeFileId ? { ...f, content } : f))
  }

  // Tab actions
  const handleTabClick = (id) => setActiveFileId(id)
  const handleNewFile = () => {
    const newFile = DEFAULT_FILE()
    setFiles(files => [...files, newFile])
    setActiveFileId(newFile.id)
    setToast({ visible: true, message: '🆕 New file created', type: 'success' })
  }
  const handleDeleteFile = (id) => {
    if (files.length === 1) {
      setToast({ visible: true, message: '❌ Cannot delete the last file', type: 'error' })
      return
    }
    if (window.confirm('Are you sure you want to delete this file?')) {
      let idx = files.findIndex(f => f.id === id)
      let newFiles = files.filter(f => f.id !== id)
      setFiles(newFiles)
      if (activeFileId === id) {
        setActiveFileId(newFiles[Math.max(0, idx - 1)].id)
      }
      setToast({ visible: true, message: '🗑️ File deleted', type: 'success' })
    }
  }
  const handleRenameFile = (id, name) => {
    setFiles(files => files.map(f => f.id === id ? { ...f, name } : f))
    setRenamingId(null)
    setToast({ visible: true, message: '✏️ File renamed', type: 'success' })
  }

  // Export all as ZIP
  const handleExportAll = async () => {
    const zip = new JSZip()
    files.forEach(f => zip.file(f.name, f.content))
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'markdown_files.zip'
    a.click()
    URL.revokeObjectURL(url)
    setToast({ visible: true, message: '✅ All files exported as ZIP!', type: 'success' })
  }

  // Share button handler
  const handleShare = async () => {
    const encoded = encodeForUrl(activeFile.content)
    const url = `${window.location.origin}${window.location.pathname}?md=${encoded}`
    try {
      await navigator.clipboard.writeText(url)
      setToast({ visible: true, message: '🔗 Shareable URL copied!', type: 'success' })
      if (onShare) onShare()
    } catch {
      setToast({ visible: true, message: '❌ Failed to copy URL', type: 'error' })
    }
  }

  // Export handlers
  const handleExportDocx = async () => {
    const html = markdownToHtml(activeFile.content)
    const blob = await htmlToDocx(html, null, {
      orientation: 'portrait',
      title: activeFile.name.replace(/\.md$/, ''),
    })
    saveAs(blob, activeFile.name.replace(/\.md$/, '.docx'))
    setToast({ visible: true, message: '✅ DOCX exported!', type: 'success' })
  }
  const handleExportRtf = () => {
    const rtf = markdownToRtf(activeFile.content)
    const blob = new Blob([rtf], { type: 'application/rtf' })
    saveAs(blob, activeFile.name.replace(/\.md$/, '.rtf'))
    setToast({ visible: true, message: '✅ RTF exported!', type: 'success' })
  }
  const handleExportLatex = () => {
    try {
      const latexSrc = latex.parse(activeFile.content).latex || activeFile.content
      const blob = new Blob([latexSrc], { type: 'application/x-latex' })
      saveAs(blob, activeFile.name.replace(/\.md$/, '.tex'))
      setToast({ visible: true, message: '✅ LaTeX exported!', type: 'success' })
    } catch {
      setToast({ visible: true, message: '❌ LaTeX export failed', type: 'error' })
    }
  }
  const handleExportSlides = () => {
    const html = markdownToSlides(activeFile.content)
    const blob = new Blob([html], { type: 'text/html' })
    saveAs(blob, activeFile.name.replace(/\.md$/, '_slides.html'))
    setToast({ visible: true, message: '✅ Slides exported!', type: 'success' })
  }

  return (
    <div className="relative flex flex-col h-full">
      <Toast message={toast.message} visible={toast.visible} onClose={closeToast} type={toast.type} />
      {/* File Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--card-bg)', padding: '0.5rem 1.5rem 0.5rem 1.5rem', gap: '0.5rem' }}>
        {files.map(file => (
          <div
            key={file.id}
            className={`editor-tab${file.id === activeFileId ? ' editor-tab-active' : ''}`}
            onClick={() => handleTabClick(file.id)}
            style={{ userSelect: 'none', display: 'flex', alignItems: 'center', padding: '0.4rem 1rem', borderRadius: '6px 6px 0 0', cursor: 'pointer', background: file.id === activeFileId ? 'var(--autosave-bg)' : 'transparent', border: file.id === activeFileId ? '1px solid var(--border-color)' : '1px solid transparent', borderBottom: file.id === activeFileId ? 'none' : '1px solid var(--border-color)', fontWeight: file.id === activeFileId ? 600 : 400, color: 'var(--text-color)', marginRight: '0.25rem', position: 'relative' }}
          >
            {renamingId === file.id ? (
              <form onSubmit={e => { e.preventDefault(); handleRenameFile(file.id, renameValue || file.name) }} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  autoFocus
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onBlur={() => setRenamingId(null)}
                  style={{ fontSize: '1rem', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.1rem 0.5rem', marginRight: '0.5rem', background: 'var(--card-bg)', color: 'var(--text-color)' }}
                />
                <button type="submit" className="editor-btn" style={{ padding: '0.2rem 0.7rem', fontSize: '1rem' }}>✔️</button>
              </form>
            ) : (
              <>
                <span style={{ marginRight: 8 }}>{file.name}</span>
                <button className="editor-btn" style={{ padding: '0.2rem 0.7rem', fontSize: '1rem' }} onClick={e => { e.stopPropagation(); setRenamingId(file.id); setRenameValue(file.name) }}>✏️</button>
                <button className="editor-btn" style={{ padding: '0.2rem 0.7rem', fontSize: '1rem' }} onClick={e => { e.stopPropagation(); handleDeleteFile(file.id) }}>🗑️</button>
              </>
            )}
          </div>
        ))}
        <button className="editor-btn" style={{ marginLeft: 8, padding: '0.2rem 0.7rem', fontSize: '1rem' }} onClick={handleNewFile}>➕</button>
        <button className="editor-btn export-md-btn" style={{ marginLeft: 'auto', padding: '0.2rem 0.9rem', fontSize: '1rem' }} onClick={handleExportAll}>⬇️ Export All</button>
      </div>
      {/* Toolbar */}
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
      {/* Editor Textarea */}
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={activeFile.content}
        onChange={e => updateFileContent(e.target.value)}
        placeholder="Type your markdown here..."
        aria-label="Markdown Editor"
        spellCheck={true}
      />
      {/* Action Buttons */}
      <div className="editor-actions">
        <button
          className="editor-btn clear-btn"
          onClick={() => updateFileContent('')}
          disabled={!activeFile.content}
          title="Clear editor"
        >
          🧹 Clear
        </button>
        <button
          className="editor-btn export-md-btn"
          onClick={() => {
            const blob = new Blob([activeFile.content], { type: 'text/markdown' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = activeFile.name
            a.click()
            URL.revokeObjectURL(url)
            setToast({ visible: true, message: `✅ ${activeFile.name} exported!`, type: 'success' })
          }}
          disabled={!activeFile.content}
          title="Export as .md"
        >
          ⬇️ Export .md
        </button>
        <button
          className="editor-btn export-html-btn"
          onClick={() => {
            const html = markdownToHtml(activeFile.content)
            const blob = new Blob([html], { type: 'text/html' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = activeFile.name.replace(/\.md$/, '.html')
            a.click()
            URL.revokeObjectURL(url)
            setToast({ visible: true, message: `✅ HTML exported!`, type: 'success' })
          }}
          disabled={!activeFile.content}
          title="Export as .html"
        >
          ⬇️ Export .html
        </button>
        <button
          className="editor-btn export-md-btn"
          onClick={handleShare}
          disabled={!activeFile.content}
          title="Copy shareable URL"
        >
          🔗 Share
        </button>
        <div style={{ display: 'inline-block', position: 'relative' }}>
          <button className="editor-btn export-md-btn" disabled={!activeFile.content} title="Export options" style={{ minWidth: 110 }}>
            ⬇️ Export ▼
          </button>
          <div className="export-dropdown" style={{ position: 'absolute', left: 0, top: '110%', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 8, boxShadow: 'var(--shadow)', minWidth: 180, display: 'none' }}>
            <button className="editor-btn" style={{ width: '100%' }} onClick={handleExportDocx} disabled={!activeFile.content}>DOCX</button>
            <button className="editor-btn" style={{ width: '100%' }} onClick={handleExportRtf} disabled={!activeFile.content}>RTF</button>
            <button className="editor-btn" style={{ width: '100%' }} onClick={handleExportLatex} disabled={!activeFile.content}>LaTeX</button>
            <button className="editor-btn" style={{ width: '100%' }} onClick={handleExportSlides} disabled={!activeFile.content}>Slides (HTML)</button>
          </div>
        </div>
      </div>
      {/* Auto-save indicator */}
      <div className={`autosave-indicator${showSaved ? ' opacity-100' : ''}`}>
        💾 Auto-saved
      </div>
    </div>
  )
}

export default Editor 