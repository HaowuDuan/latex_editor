import React from 'react';
import PdfToolbar from './PdfToolbar';
import PdfDocument from './PdfDocument';
import './PdfViewer.css';

const PdfViewer = ({ pdfUrl, filename, onFilenameChange, onRename }) => {
  return (
    <div className="pdf-viewer">
      <PdfToolbar 
        filename={filename} 
        onFilenameChange={onFilenameChange}
        pdfUrl={pdfUrl}
        onRename={onRename}
      />
      <PdfDocument pdfUrl={pdfUrl} />
    </div>
  );
};

export default PdfViewer;
