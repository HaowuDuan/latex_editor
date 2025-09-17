import React from 'react';
import './ThumbnailsSidebar.css';

const ThumbnailsSidebar = ({ pdfUrl }) => {
  return (
    <div className="thumbnails-sidebar">
      <div className="thumbnails-content">
        {pdfUrl ? (
          <div className="thumbnails-list">
            {/* PDF page thumbnails will be rendered here */}
            <div className="thumbnail-item">
              <div className="page-number">1</div>
            </div>
          </div>
        ) : (
          <div className="no-pdf-message">
            <p>No PDF</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailsSidebar;
