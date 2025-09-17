import React from 'react';
import './PdfSidebar.css';

const PdfSidebar = ({ pdfUrl }) => {
  return (
    <div className="pdf-sidebar">
      <div className="sidebar-content">
        {pdfUrl ? (
          <div className="thumbnails-container">
            {/* PDF thumbnails will be rendered here */}
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

export default PdfSidebar;
