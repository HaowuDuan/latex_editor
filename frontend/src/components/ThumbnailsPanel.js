import React from 'react';
import './ThumbnailsPanel.css';

const ThumbnailsPanel = ({ pdfUrl }) => {
  return (
    <div className="thumbnails-panel">
      <div className="thumbnails-content">
        {pdfUrl ? (
          <div className="thumbnails-list">
            {/* PDF page thumbnails will be rendered here */}
            <div className="thumbnail-placeholder">
              <div className="page-number">1</div>
            </div>
          </div>
        ) : (
          <div className="no-pdf-message">
            <p>No PDF loaded</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailsPanel;
