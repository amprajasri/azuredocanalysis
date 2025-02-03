import React, { useState } from 'react';
import axios from 'axios';
import Loading from './Loading';
import Results from './Results'; // Add this import

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log("Selected file:", selectedFile); // Debugging log

    if (selectedFile && selectedFile.type === 'application/pdf') {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB size limit
        setError('File size should not exceed 5MB.');
        setFile(null);
      } else {
        setFile(selectedFile);
        setError(null);
      }
    } else {
      setError('Please upload a PDF file.');
      setFile(null);
    }

    console.log("File state after change:", file); // Debugging log
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted with file:", file); // Debugging log

    if (!file) {
      // setError('No file selected or invalid file format.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, { // Use the full server URL
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error during file upload:", err); // Debugging log
      setError('Error uploading file.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload">
      <h1>Upload and Analyze PDF</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {error && <p className="error">{error}</p>}
      {loading && <Loading />}
      {data && <Results data={data} />} {/* Make sure this line uses the Results component */}
    </div>
  );
};

export default UploadForm;
