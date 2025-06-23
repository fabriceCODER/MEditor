import React from 'react'
import './Footer.css'

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <span>© {new Date().getFullYear()} Markdown Editor & Previewer</span>
      <span className="footer-links">
        <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="mailto:developer@example.com">Contact</a>
      </span>
    </div>
  </footer>
)

export default Footer 