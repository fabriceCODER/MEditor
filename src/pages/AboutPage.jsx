import React from 'react';

const AboutPage = () => (
  <div className="max-w-3xl mx-auto px-4 py-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 mt-8 mb-12 text-gray-900 dark:text-gray-100">
    <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">ℹ️ About This App</h1>
    <p className="mb-6 text-base text-gray-700 dark:text-gray-300">
      <strong>Markdown Editor & Previewer</strong> is a fully client-side web application designed to help you write and preview Markdown documents in real-time.
      It supports GitHub-Flavored Markdown, live preview, code highlighting, template management, and multiple export options.
    </p>

    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">🎯 Mission</h2>
      <p>
        To provide developers, writers, and students with a clean, fast, and powerful Markdown editing environment — without requiring any login, payment, or backend.
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">🧰 Tech Stack</h2>
      <ul className="list-disc pl-6 space-y-2 text-base">
        <li>⚛️ React + Vite</li>
        <li>🧠 React Hooks: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">useState</code>, <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">useEffect</code></li>
        <li>📝 Markdown Parsing: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">marked</code> or <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">react-markdown</code></li>
        <li>🎨 Code Highlighting: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">highlight.js</code></li>
        <li>💾 Persistence: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">localStorage</code></li>
        <li>📦 Export: Download as <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.md</code> and <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.html</code></li>
      </ul>
    </section>

    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">👨‍💻 Developer</h2>
      <p>
        Created with care by <strong>Fabrice Ishimwe</strong>, a passionate developer from Rwanda who loves building full-stack applications, tools, and developer platforms.
      </p>
    </section>

    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">📬 Contact & Links</h2>
      <ul className="list-disc pl-6 space-y-2 text-base">
        <li>GitHub Repo: <a href="https://github.com/fabriceCODER/MEditor" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 transition">github.com/your-repo</a></li>
        <li>Email: <a href="mailto:fabricecoder009@gmail.com" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 transition">fabricecoder009@gmail.com</a></li>
        <li>LinkedIn: <a href="https://www.linkedin.com/in/fabrice-ishimwe" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 transition">/fabrice-ishimwe</a></li>
      </ul>
    </section>

    <section className="text-sm text-gray-500 dark:text-gray-400">
      <p><strong>Version:</strong> 1.0.0</p>
      <p><strong>License:</strong> MIT</p>
    </section>
  </div>
);

export default AboutPage;
