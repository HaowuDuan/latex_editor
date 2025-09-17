import React, { useState, useEffect } from 'react';
import './PackageManager.css';

const PackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      const data = await response.json();
      setPackages(data.packages || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.sty')) {
      setMessage('Only .sty files are allowed');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-package', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        fetchPackages();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  const deletePackage = async (filename) => {
    try {
      const response = await fetch(`/api/delete-package/${filename}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        fetchPackages();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Delete failed: ' + error.message);
    }
  };

  return (
    <div className="package-manager">
      <h3>Custom LaTeX Packages</h3>
      
      <div className="upload-section">
        <label htmlFor="package-upload" className="upload-button">
          {uploading ? 'Uploading...' : 'Upload .sty File'}
        </label>
        <input
          id="package-upload"
          type="file"
          accept=".sty"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </div>

      {message && (
        <div className={`message ${message.includes('error') || message.includes('failed') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="packages-list">
        {packages.length === 0 ? (
          <p className="no-packages">No custom packages uploaded</p>
        ) : (
          <ul>
            {packages.map((pkg, index) => (
              <li key={index} className="package-item">
                <span className="package-name">{pkg}</span>
                <button 
                  className="delete-button"
                  onClick={() => deletePackage(pkg)}
                  title="Delete package"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default PackageManager;
