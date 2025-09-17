import React, { useState } from 'react';
import './PdfToolbar.css';

const PdfToolbar = ({ filename, onFilenameChange, pdfUrl, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempFilename, setTempFilename] = useState(filename);

  const handleRename = () => {
    if (tempFilename !== filename) {
      onRename(tempFilename);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempFilename(filename);
    setIsEditing(false);
  };

  return (
    <div className="pdf-toolbar">
      <h3>PDF Preview</h3>
      <div className="filename-input-container">
        <label htmlFor="pdf-filename">Filename:</label>
        {isEditing ? (
          <>
            <input
              id="pdf-filename"
              type="text"
              value={tempFilename}
              onChange={(e) => setTempFilename(e.target.value)}
              placeholder="document"
              className="filename-input"
              autoFocus
            />
            <span className="file-extension">.pdf</span>
            <button className="rename-btn save" onClick={handleRename}>✓</button>
            <button className="rename-btn cancel" onClick={handleCancel}>✗</button>
          </>
        ) : (
          <>
            <input
              id="pdf-filename"
              type="text"
              value={filename}
              onChange={(e) => onFilenameChange(e.target.value)}
              placeholder="document"
              className="filename-input"
              readOnly
            />
            <span className="file-extension">.pdf</span>
            {pdfUrl && (
              <button className="rename-btn edit" onClick={() => setIsEditing(true)}>✏️</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PdfToolbar;
