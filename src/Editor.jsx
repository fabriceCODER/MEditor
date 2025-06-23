import React, { useState, useRef, useEffect, useCallback } from 'react'
import Toast from './Toast'
import JSZip from 'jszip'
import Mousetrap from 'mousetrap'
import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, TextRun } from 'docx'

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

  // DOCX export using docx library
  const handleExportDocx = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            ...activeFile.content.split('\n').map(line =>
              new Paragraph({
                children: [new TextRun(line)],
              })
            ),
          ],
        },
      ],
    })
    const blob = await Packer.toBlob(doc)
    saveAs(blob, activeFile.name.replace(/\.md$/, '.docx'))
    setToast({ visible: true, message: '✅ DOCX exported!', type: 'success' })
  }
  const handleExportRtf = () => {
    const rtf = markdownToRtf(activeFile.content)
    const blob = new Blob([rtf], { type: 'application/rtf' })
    saveAs(blob, activeFile.name.replace(/\.md$/, '.rtf'))
    setToast({ visible: true, message: '✅ RTF exported!', type: 'success' })
  }
  const handleExportSlides = () => {
    const html = markdownToSlides(activeFile.content)
    const blob = new Blob([html], { type: 'text/html' })
    saveAs(blob, activeFile.name.replace(/\.md$/, '_slides.html'))
    setToast({ visible: true, message: '✅ Slides exported!', type: 'success' })
  }

  return (
    <div className="relative flex flex-col h-full w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast(t => ({ ...t, visible: false }))} type={toast.type} />
      {/* File Tabs */}
      <div className="flex items-center border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 px-4 py-2 gap-2 rounded-t-2xl">
        {files.map(file => (
          <div
            key={file.id}
            className={`flex items-center px-4 py-1.5 rounded-t-lg cursor-pointer transition-colors font-medium text-sm ${file.id === activeFileId ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500 dark:border-blue-400' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            onClick={() => setActiveFileId(file.id)}
          >
            {renamingId === file.id ? (
              <form onSubmit={e => { e.preventDefault(); handleRenameFile(file.id, renameValue || file.name) }} className="flex items-center gap-2">
                <input
                  autoFocus
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onBlur={() => setRenamingId(null)}
                  className="text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                />
                <button type="submit" className="ml-1 text-green-600 dark:text-green-400 hover:underline">✔️</button>
              </form>
            ) : (
              <>
                <span className="mr-2 truncate max-w-[120px]">{file.name}</span>
                <button className="ml-1 text-yellow-600 dark:text-yellow-400 hover:underline" onClick={e => { e.stopPropagation(); setRenamingId(file.id); setRenameValue(file.name) }}>✏️</button>
                <button className="ml-1 text-red-600 dark:text-red-400 hover:underline" onClick={e => { e.stopPropagation(); handleDeleteFile(file.id) }}>🗑️</button>
              </>
            )}
          </div>
        ))}
        <button className="ml-2 px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition" onClick={handleNewFile}>➕</button>
        <button className="ml-auto px-3 py-1.5 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition" onClick={handleExportAll}>⬇️ Export All</button>
      </div>
      {/* Toolbar */}
      <div className="flex gap-2 px-4 pt-4 pb-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <button
          className="px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleUndo}
          disabled={!isUndoAvailable}
          title="Undo (Ctrl+Z)"
        >
          ↩️ Undo
        </button>
        <button
          className="px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleRedo}
          disabled={!isRedoAvailable}
          title="Redo (Ctrl+Y)"
        >
          ↪️ Redo
        </button>
        <button
          className="px-3 py-1.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 shadow-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition ml-2"
          onClick={() => setShowShortcuts(s => !s)}
          title="Keyboard Shortcuts"
        >
          ⌨️ Shortcuts
        </button>
        <button
          className="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => setShowHistory(s => !s)}
          title="Version History"
        >
          🕑 History
        </button>
      </div>
      {/* Editor Textarea */}
      <textarea
        ref={textareaRef}
        className="flex-1 w-full min-h-[200px] p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-none outline-none font-mono text-base rounded-b-2xl focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition shadow-inner resize-none"
        value={activeFile.content}
        onChange={e => updateFileContent(e.target.value)}
        placeholder="Type your markdown here..."
        aria-label="Markdown Editor"
        spellCheck={true}
      />
      {/* Action Buttons */}
      <div className="flex gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-b-2xl">
        <button
          className="px-3 py-1.5 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-700 shadow-sm hover:bg-red-200 dark:hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => updateFileContent('')}
          disabled={!activeFile.content}
          title="Clear editor"
        >
          🧹 Clear
        </button>
        <button
          className="px-3 py-1.5 rounded bg-blue-600 text-white border border-blue-700 shadow-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="px-3 py-1.5 rounded bg-green-600 text-white border border-green-700 shadow-sm hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="px-3 py-1.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 shadow-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition"
          onClick={handleShare}
          disabled={!activeFile.content}
          title="Copy shareable URL"
        >
          🔗 Share
        </button>
        <div className="relative inline-block">
          <button className="px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition" disabled={!activeFile.content} title="Export options">
            ⬇️ Export ▼
          </button>
          {/* Dropdown menu can be implemented here if needed */}
        </div>
      </div>
      {/* Auto-save indicator */}
      <div className={`absolute bottom-4 right-4 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg shadow transition-opacity duration-300 ${showSaved ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        💾 Auto-saved
      </div>
    </div>
  )
}

export default Editor 