import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Editor from '../Editor'
import Previewer from '../Previewer'

const Dashboard = (props) => {
  const { files, setFiles, activeFileId, setActiveFileId, ...rest } = props
  const activeFile = files.find(f => f.id === activeFileId) || files[0]
  return (
    <div className="dashboard-root">
      <Navbar onToggleTheme={props.onToggleTheme} theme={props.theme} />
      <main className="dashboard-main">
        <div className="main-layout">
          <section className="editor-card">
            <h2 className="sr-only">Editor</h2>
            <Editor
              files={files}
              setFiles={setFiles}
              activeFileId={activeFileId}
              setActiveFileId={setActiveFileId}
              {...rest}
            />
          </section>
          <section className="preview-card">
            <h2 className="sr-only">Preview</h2>
            <Previewer markdown={activeFile?.content || ''} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard 