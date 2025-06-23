import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const features = [
  { icon: '⚡', label: 'Live preview' },
  { icon: '🌗', label: 'Dark/light themes' },
  { icon: '⬇️', label: 'Export to PDF/Markdown/HTML' },
  { icon: '🕑', label: 'Version history' },
  { icon: '📄', label: 'Custom templates' },
]

const LandingPage = ({ onToggleTheme, theme }) => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar onToggleTheme={onToggleTheme} theme={theme} />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <section className="w-full max-w-2xl text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-blue-700 dark:text-blue-400">Markdown Editor & Previewer</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">A fast, modern, offline-ready Markdown editing tool for writers, developers, and teams.</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-8 py-3 shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => navigate('/dashboard')}
          >
            Start Editing
          </button>
        </section>
        <section className="w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Core Features</h2>
          <ul className="flex flex-wrap justify-center gap-8">
            {features.map(f => (
              <li key={f.label} className="flex flex-col items-center min-w-[120px]">
                <span className="text-4xl mb-2 text-blue-600 dark:text-blue-400">{f.icon}</span>
                <span className="text-base text-gray-700 dark:text-gray-300 font-medium">{f.label}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage 