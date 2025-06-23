import React, { useState } from 'react';

const FeedbackPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can later integrate a backend, email service, or save to localStorage
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 mt-8 mb-12 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">💬 Feedback & Feature Requests</h1>
      <p className="mb-8 text-base text-gray-700 dark:text-gray-300">Help us improve! Share your ideas, report bugs, or request new features.</p>

      {submitted ? (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg mb-6 border border-green-300 dark:border-green-700">
          ✅ Thank you! Your feedback has been submitted.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-semibold mb-1">Name (optional):</label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block font-semibold mb-1">Email (optional):</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="feedback" className="block font-semibold mb-1">Your feedback or feature request:</label>
            <textarea
              id="feedback"
              required
              rows={5}
              placeholder="Let us know what's on your mind..."
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition" type="submit">
            🚀 Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackPage;
