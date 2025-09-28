import React from 'react';
import FileUploader from './components/FileUploader';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Cloud File Uploader</h1>
        <h2>Progress Challenge 1</h2>
        <p>Created by <strong>Kiran</strong> from <strong>RV University</strong></p>
        <p>Upload your files to AWS S3 with ease</p>
      </header>
      <main>
        <FileUploader />
      </main>
    </div>
  );
}

export default App;