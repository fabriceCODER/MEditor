import React from 'react';

const DocumentationPage = () => (
  <div className="max-w-3xl mx-auto px-4 py-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 mt-8 mb-12 text-gray-900 dark:text-gray-100">
    <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">📘 Documentation</h1>

    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-2">📄 Markdown Syntax Reference</h2>
      <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap mb-2 border border-gray-200 dark:border-gray-700">
{`# Heading 1
## Heading 2
### Heading 3

**Bold**  
*Italic*  
~~Strikethrough~~

[Link](https://example.com)

- Unordered list item
- Another item

1. Ordered list item
2. Second item

> This is a blockquote

\`Inline code\`

\`\`\`js
// Code block
function helloWorld() {
  console.log("Hello, Markdown!");
}
\`\`\`

| Table | Example |
|-------|---------|
| Row 1 | Value 1 |
| Row 2 | Value 2 |

![Image](https://via.placeholder.com/150)

- [x] Task complete
- [ ] Task not complete
`}
      </pre>
    </section>

    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-2">⚙️ Usage Guide</h2>
      <ul className="list-disc pl-6 space-y-2 text-base">
        <li>✍️ Write Markdown in the left editor pane.</li>
        <li>👀 Instantly see a live HTML preview on the right.</li>
        <li>📤 Use the export buttons to download your content as <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.md</code> or <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.html</code>.</li>
        <li>🌙 Toggle between Light and Dark modes using the theme switch in the header.</li>
        <li>💾 Changes are saved locally so your work won't be lost.</li>
        <li>📂 Load from or save to custom templates in the Templates Library.</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-2">❓ FAQ</h2>
      <ul className="space-y-4 text-base">
        <li>
          <b>How do I export my Markdown?</b><br />
          Use the "Export as .md" or "Export as .html" buttons in the toolbar.
        </li>
        <li>
          <b>Can I import Markdown files?</b><br />
          Yes, file import will be supported soon in the Templates section.
        </li>
        <li>
          <b>Is this app free?</b><br />
          Yes — it's completely free to use, with no account required.
        </li>
        <li>
          <b>Does it work offline?</b><br />
          Yes! It's a Progressive Web App (PWA) and stores your content in localStorage.
        </li>
      </ul>
    </section>
  </div>
);

export default DocumentationPage;
