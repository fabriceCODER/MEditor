import React, { useEffect } from 'react'

const Toast = ({ message, visible, onClose, type = 'success' }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 2500)
      return () => clearTimeout(timer)
    }
  }, [visible, onClose])

  return (
    <div
      className={`toast-notification${visible ? ' toast-visible' : ''} toast-${type}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </div>
  )
}

export default Toast 