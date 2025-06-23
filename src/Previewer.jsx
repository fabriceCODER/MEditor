import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import html2pdf from 'html2pdf.js'
import Toast from './Toast'

// Previewer component for rendering markdown with syntax highlighting
const Previewer = ({ markdown, theme }) => {
  const previewRef = React.useRef(null)
  const [toast, setToast] = React.useState({ visible: false, message: '', type: 'success' })
  const exporting = React.useRef(false)

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
    <div className="h-full w-full overflow-auto bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 prose prose-lg max-w-none dark:prose-invert transition-all">
      <Toast message={toast.message} visible={toast.visible} onClose={closeToast} type={toast.type} />
      <div ref={previewRef} style={{ flex: 1, minHeight: 200 }}>
        <ReactMarkdown
          children={markdown}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={theme === 'dark' ? oneDark : oneLight}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg shadow-inner my-4"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-200 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              )
            },
            img({ ...props }) {
              return <img {...props} className="rounded-lg shadow max-w-full h-auto mx-auto my-4" alt={props.alt || ''} />
            },
            a({ ...props }) {
              return <a {...props} className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 transition" />
            },
            blockquote({ ...props }) {
              return <blockquote {...props} className="border-l-4 border-blue-400 pl-4 italic text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-950 rounded my-4" />
            },
            table({ ...props }) {
              return <table {...props} className="table-auto border-collapse w-full my-4" />
            },
            th({ ...props }) {
              return <th {...props} className="border-b-2 border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-left" />
            },
            td({ ...props }) {
              return <td {...props} className="border-b border-gray-200 dark:border-gray-700 px-4 py-2" />
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