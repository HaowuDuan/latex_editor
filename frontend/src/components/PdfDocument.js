import React, { useRef, useEffect } from 'react';
import './PdfDocument.css';

const PdfDocument = ({ pdfUrl }) => {
  const pdfContainerRef = useRef(null);

  useEffect(() => {
    let initialDistance = 0;
    let initialZoom = 1;

    const handleWheel = (e) => {
      // Check if it's a pinch gesture (two fingers on trackpad)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        
        const iframe = pdfContainerRef.current?.querySelector('.pdf-iframe');
        if (!iframe) return;

        // Get current zoom level from iframe
        const currentZoom = iframe.style.zoom || '1';
        const zoomLevel = parseFloat(currentZoom);
        
        // Calculate new zoom level
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1; // Zoom out if deltaY > 0, zoom in if < 0
        const newZoom = Math.max(0.5, Math.min(3.0, zoomLevel * zoomFactor));
        
        // Apply zoom
        iframe.style.zoom = newZoom.toString();
        iframe.style.transform = `scale(${newZoom})`;
        iframe.style.transformOrigin = 'top left';
        
        console.log('PDF zoom:', newZoom);
      }
    };

    const handleTouchStart = (e) => {
      console.log('Touch start:', e.touches.length, 'fingers');
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        const iframe = pdfContainerRef.current?.querySelector('.pdf-iframe');
        if (iframe) {
          initialZoom = parseFloat(iframe.style.zoom || '1');
        }
        console.log('Two finger touch detected, initial distance:', initialDistance);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        if (initialDistance > 0) {
          const scale = currentDistance / initialDistance;
          const newZoom = Math.max(0.5, Math.min(3.0, initialZoom * scale));
          
          const iframe = pdfContainerRef.current?.querySelector('.pdf-iframe');
          if (iframe) {
            iframe.style.zoom = newZoom.toString();
            iframe.style.transform = `scale(${newZoom})`;
            iframe.style.transformOrigin = 'top left';
            console.log('Touch zoom:', newZoom);
          }
        }
      }
    };

    const handleTouchEnd = (e) => {
      initialDistance = 0;
      initialZoom = 1;
    };

    const iframe = pdfContainerRef.current?.querySelector('.pdf-iframe');
    if (iframe) {
      iframe.addEventListener('wheel', handleWheel, { passive: false });
      iframe.addEventListener('touchstart', handleTouchStart, { passive: false });
      iframe.addEventListener('touchmove', handleTouchMove, { passive: false });
      iframe.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('wheel', handleWheel);
        iframe.removeEventListener('touchstart', handleTouchStart);
        iframe.removeEventListener('touchmove', handleTouchMove);
        iframe.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="pdf-document" ref={pdfContainerRef}>
      {pdfUrl ? (
        <div className="pdf-wrapper">
          <iframe
            key={pdfUrl}
            src={pdfUrl}
            className="pdf-iframe"
            title="PDF Document"
            style={{ pointerEvents: 'auto' }}
          />
          <div 
            className="pdf-overlay"
            onDoubleClick={() => {
              const iframe = pdfContainerRef.current?.querySelector('.pdf-iframe');
              if (iframe) {
                iframe.style.pointerEvents = iframe.style.pointerEvents === 'auto' ? 'none' : 'auto';
                console.log('PDF pointer events:', iframe.style.pointerEvents);
              }
            }}
          />
        </div>
      ) : (
        <div className="pdf-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">📄</div>
            <p>Click "Compile" to generate PDF preview</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfDocument;
