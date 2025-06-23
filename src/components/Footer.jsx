import React from 'react'

const Footer = () => (
  <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-inner mt-8">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-2">
      <span className="text-gray-600 dark:text-gray-400 text-sm">© {new Date().getFullYear()} MEditor</span>
      <span className="flex gap-4 text-sm">
        <a href="https://github.com/fabriceCODER/MEditor" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub</a>
        <a href="mailto:fabricecoder009@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">Contact</a>
      </span>
    </div>
  </footer>
)

export default Footer 