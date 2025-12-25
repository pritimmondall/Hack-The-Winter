import React, { useState } from 'react';
import axios from 'axios';
import '../styles/pages.css';

function PrescriptionPage({ userId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('prescription', selectedFile);

    axios.post(`/api/prescription/${userId}`, formData)
      .then(res => {
        setUploadStatus('Prescription uploaded successfully!');
        setSelectedFile(null);
      })
      .catch(err => {
        setUploadStatus('Upload failed');
        console.error(err);
      });
  };

  return (
    <div className="prescription-page">
      <h2>Upload Your Prescription</h2>
      <div className="upload-container">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
          className="file-input"
        />
        <button onClick={handleUpload} className="upload-btn">
          Upload Prescription
        </button>
        {uploadStatus && <p className="status">{uploadStatus}</p>}
      </div>
    </div>
  );
}

export default PrescriptionPage;
