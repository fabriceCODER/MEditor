import React from "react";

const templates = [
  {
    name: "Blog Post",
    description: "A clean layout for writing blog articles with headings, quotes, and code.",
    content: `# Blog Title\n\n_A short summary of the post._\n\n## Introduction\n\n...\n\n> A great quote here.\n\n\`\`\`js\n// Sample code block\nconsole.log("Hello, blog!");\n\`\`\``
  },
  {
    name: "Project README",
    description: "A professional README format for GitHub projects.",
    content: `# Project Name\n\n## Description\n\n## Installation\n\n## Usage\n\n## License\n\n## Contributing`
  },
  {
    name: "Documentation Section",
    description: "Perfect for building software or API documentation in Markdown.",
    content: `# API Documentation\n\n## Endpoints\n\n### GET /api/items\n\nReturns a list of items.\n\n### POST /api/items\n\nCreates a new item.`
  }
];

const TemplatesPage = () => {
  const handleLoadTemplate = (template) => {
    // You can implement actual logic to load it into the editor using context or props
    alert(`Template "${template.name}" loaded! (Simulation)`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 mt-8 mb-12 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-400">🗂 Templates Library</h1>
      <p className="mb-8 text-base text-gray-700 dark:text-gray-300">Choose from professionally crafted Markdown templates to get started faster.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {templates.map((template, index) => (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-6 flex flex-col items-start" key={index}>
            <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-300">{template.name}</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{template.description}</p>
            <div className="flex gap-2 mt-auto">
              <button onClick={() => handleLoadTemplate(template)} className="px-4 py-1.5 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Load Template</button>
              <button disabled className="px-4 py-1.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed ml-2">Preview</button>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">🛠 Import / Export Templates</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">Coming soon: upload your own templates or download existing ones as <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.md</code> or <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.json</code>.</p>
        <div className="flex gap-4">
          <button disabled className="px-4 py-1.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed">Import Template</button>
          <button disabled className="px-4 py-1.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed">Export All Templates</button>
        </div>
      </section>
    </div>
  );
};

export default TemplatesPage;
