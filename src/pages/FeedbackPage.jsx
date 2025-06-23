import React from 'react'

const FeedbackPage = () => (
  <div className="page-content">
    <h1>Feedback / Feature Request</h1>
    <form style={{ maxWidth: 400 }}>
      <label htmlFor="feedback">Your feedback or feature request:</label>
      <textarea id="feedback" rows={4} style={{ width: '100%', margin: '8px 0', borderRadius: 6, border: '1px solid var(--border-color)', padding: 8 }} />
      <button className="editor-btn export-md-btn" type="submit">Submit</button>
    </form>
  </div>
)

export default FeedbackPage 