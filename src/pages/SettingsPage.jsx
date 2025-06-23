import React from 'react';

const SettingsPage = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 mt-8 mb-12 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">⚙️ Settings</h1>
      <p className="mb-8 text-base text-gray-700 dark:text-gray-300">Customize your Markdown editing environment. Preferences will be saved for your next visit.</p>

      <form>
        <div className="mb-6">
          <label htmlFor="theme" className="block font-semibold mb-2">Theme</label>
          <select id="theme" name="theme" className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <option value="system">System Default</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <small className="block mt-1 text-gray-500 dark:text-gray-400">Choose between light, dark, or system-based theme.</small>
        </div>

        <div className="mb-6">
          <label htmlFor="font" className="block font-semibold mb-2">Editor Font</label>
          <select id="font" name="font" className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </select>
          <small className="block mt-1 text-gray-500 dark:text-gray-400">Adjust the font used in the Markdown editor.</small>
        </div>

        <div className="mb-6">
          <label htmlFor="autosave" className="font-semibold flex items-center">
            <input type="checkbox" id="autosave" name="autosave" className="mr-2 rounded" defaultChecked />
            Enable Auto-Save
          </label>
          <small className="block mt-1 text-gray-500 dark:text-gray-400">Automatically save your work to localStorage every few seconds.</small>
        </div>

        <div>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition cursor-not-allowed opacity-60" disabled>
            Save Preferences (Coming Soon)
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
