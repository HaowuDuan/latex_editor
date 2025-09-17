import React, { useState, useRef, useEffect, useCallback } from 'react';
import './SplitPane.css';

const SplitPane = ({ children }) => {
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const splitPaneRef = useRef(null);
  const animationFrameRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !splitPaneRef.current) return;

    // Cancel previous animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Schedule update for next frame
    animationFrameRef.current = requestAnimationFrame(() => {
      const rect = splitPaneRef.current.getBoundingClientRect();
      const mouseX = e.clientX;
      const containerLeft = rect.left;
      const containerWidth = rect.width;
      
      const newLeftWidth = ((mouseX - containerLeft) / containerWidth) * 100;
      const constrainedWidth = Math.min(Math.max(newLeftWidth, 15), 85);
      
      setLeftWidth(constrainedWidth);
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className={`split-pane ${isDragging ? 'dragging' : ''}`} ref={splitPaneRef}>
      <div 
        className="split-pane-left" 
        style={{ width: `${leftWidth}%` }}
      >
        {children[0]}
      </div>
      <div 
        className="split-pane-divider"
        onMouseDown={handleMouseDown}
      />
      <div 
        className="split-pane-right" 
        style={{ width: `${100 - leftWidth}%` }}
      >
        {children[1]}
      </div>
    </div>
  );
};

export default SplitPane;
