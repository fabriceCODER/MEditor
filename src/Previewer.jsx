import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Previewer component for rendering markdown with syntax highlighting
const Previewer = ({ markdown }) => {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none w-full h-full p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl shadow-inner overflow-auto leading-relaxed tracking-normal">
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
  )
}

export default Previewer 