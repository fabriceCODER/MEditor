import React from 'react';

const NotFound = () => (
  <div className="max-w-xl mx-auto px-4 py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 mt-16 mb-16 text-gray-900 dark:text-gray-100 text-center">
    <h1 className="text-5xl font-extrabold mb-4">🚫 404 - Page Not Found</h1>
    <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
      Oops! The page you're looking for doesn't exist or has been moved.
    </p>
    <div className="mb-8">
      <p className="mb-2">Here are a few helpful links instead:</p>
      <ul className="flex flex-col gap-2 items-center">
        <li><a href="/" className="px-4 py-2 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition">🏠 Home</a></li>
        <li><a href="/dashboard" className="px-4 py-2 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition">📝 Dashboard (Editor)</a></li>
        <li><a href="/docs" className="px-4 py-2 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition">📚 Documentation</a></li>
        <li><a href="/templates" className="px-4 py-2 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition">🗂 Templates</a></li>
        <li><a href="/feedback" className="px-4 py-2 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition">💬 Send Feedback</a></li>
      </ul>
    </div>
    <p className="text-gray-400 text-sm">
      If you believe this is an error, feel free to contact us or report it via the feedback form.
    </p>
  </div>
);

export default NotFound;
