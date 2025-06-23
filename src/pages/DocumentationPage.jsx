import React from 'react'

const DocumentationPage = () => (
  <div className="page-content">
    <h1>Documentation</h1>
    <h2>Markdown Syntax Reference</h2>
    <pre style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
{`# Heading 1
## Heading 2
**Bold**  *Italic*  ~~Strikethrough~~
[Link](https://example.com)
- List item
1. Numbered item
> Blockquote


'three backticks for code blocks
`}
    </pre>
    <h2>Usage Guide</h2>
    <ul>
      <li>Type Markdown in the editor and see the live preview.</li>
      <li>Use the export buttons to download your work in various formats.</li>
      <li>Switch between light and dark themes using the toggle in the header.</li>
    </ul>
    <h2>FAQ</h2>
    <ul>
      <li><b>How do I export?</b> Use the export buttons in the editor.</li>
      <li><b>How do I share?</b> Use the Share button to copy a public URL.</li>
    </ul>
  </div>
)

export default DocumentationPage 