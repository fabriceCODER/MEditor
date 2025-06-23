import React, { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import html2pdf from 'html2pdf.js'
import Toast from './Toast'

// Previewer component for rendering markdown with syntax highlighting
const Previewer = ({ markdown }) => {
  const previewRef = useRef(null)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })
  const exporting = useRef(false)

  const handleExportPDF = async () => {
    if (!previewRef.current || !markdown.trim()) return
    exporting.current = true
    try {
      await html2pdf().set({
        margin: 0.5,
        filename: 'preview_export.pdf',
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      }).from(previewRef.current).save()
      setToast({ visible: true, message: '✅ PDF exported!', type: 'success' })
    } catch (e) {
      setToast({ visible: true, message: '❌ PDF export failed', type: 'error' })
    } finally {
      exporting.current = false
    }
  }

  const closeToast = () => setToast(t => ({ ...t, visible: false }))

  return (
    <div className="preview-content" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toast message={toast.message} visible={toast.visible} onClose={closeToast} type={toast.type} />
      <div ref={previewRef} style={{ flex: 1, minHeight: 200 }}>
        <ReactMarkdown
          children={markdown}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
          }}
        />
      </div>
      <div style={{ marginTop: '1rem', textAlign: 'right' }}>
        <button
          className="editor-btn export-md-btn"
          onClick={handleExportPDF}
          disabled={!markdown.trim() || exporting.current}
          title="Export as PDF"
        >
          🖨️ Export to PDF
        </button>
      </div>
    </div>
  )
}

export default Previewer 