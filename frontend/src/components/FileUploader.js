import React, { useState } from 'react';
import axios from 'axios';
import './FileUploader.css';

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // File validation settings
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'text/plain', 'application/pdf', 
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setError('');
    
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      setSelectedFile(null);
      return;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('File type not supported. Please upload images, text files, PDFs, or Word documents.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // Create a synthetic event to reuse validation logic
      const syntheticEvent = {
        target: { files: [file] }
      };
      handleFileSelect(syntheticEvent);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Use environment-based API URL
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/upload' 
        : 'http://localhost:5001/api/upload';
        
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        setUploadedFiles([...uploadedFiles, {
          name: selectedFile.name,
          url: response.data.fileUrl,
          size: selectedFile.size,
          type: selectedFile.type,
          uploadedAt: new Date().toISOString()
        }]);
        setSelectedFile(null);
        // Reset file input
        document.getElementById('file-input').value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
    alert('URL copied to clipboard!');
  };

  return (
    <div className="file-uploader">
      <div className="upload-area">
        <div 
          className={`drop-zone ${selectedFile ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            id="file-input"
            type="file"
            onChange={handleFileSelect}
            accept={ALLOWED_TYPES.join(',')}
            className="file-input"
          />
          
          {!selectedFile ? (
            <div className="drop-zone-content">
              <div className="upload-icon">📁</div>
              <p>Drag & drop a file here, or click to select</p>
              <p className="file-restrictions">
                Max size: 5MB | Supported: Images, Text, PDF, Word docs
              </p>
            </div>
          ) : (
            <div className="selected-file">
              <div className="file-icon">📄</div>
              <div className="file-info">
                <p className="file-name">{selectedFile.name}</p>
                <p className="file-details">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </p>
              </div>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {selectedFile && (
          <button 
            onClick={handleUpload} 
            disabled={uploading}
            className="upload-button"
          >
            {uploading ? `Uploading... ${uploadProgress}%` : 'Upload File'}
          </button>
        )}

        {uploading && (
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h3>Uploaded Files</h3>
          <div className="files-list">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="uploaded-file-item">
                <div className="file-details">
                  <strong>{file.name}</strong>
                  <p>{formatFileSize(file.size)} • Uploaded: {new Date(file.uploadedAt).toLocaleString()}</p>
                </div>
                <div className="file-actions">
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-button"
                  >
                    View
                  </a>
                  <button 
                    onClick={() => copyToClipboard(file.url)}
                    className="copy-button"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;