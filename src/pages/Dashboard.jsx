import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Editor from '../Editor'
import Previewer from '../Previewer'

const Dashboard = (props) => {
  const { files, setFiles, activeFileId, setActiveFileId, ...rest } = props
  const activeFile = files.find(f => f.id === activeFileId) || files[0]
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar onToggleTheme={props.onToggleTheme} theme={props.theme} />
      <main className="flex-1 flex flex-col md:flex-row gap-6 px-2 md:px-8 py-6">
        <section className="flex-1 flex flex-col mb-6 md:mb-0 md:mr-3">
          <h2 className="sr-only">Editor</h2>
          <Editor
            files={files}
            setFiles={setFiles}
            activeFileId={activeFileId}
            setActiveFileId={setActiveFileId}
            {...rest}
          />
        </section>
        <section className="flex-1 flex flex-col md:ml-3">
          <h2 className="sr-only">Preview</h2>
          <Previewer markdown={activeFile?.content || ''} theme={props.theme} />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard 