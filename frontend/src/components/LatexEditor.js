import React from 'react';
import './LatexEditor.css';

const LatexEditor = ({ value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="latex-editor">
      <div className="editor-header">
        <h3>LaTeX Source</h3>
      </div>
      <textarea
        className="latex-textarea"
        value={value}
        onChange={handleChange}
        placeholder="Enter your LaTeX code here..."
        spellCheck={false}
      />
    </div>
  );
};

export default LatexEditor;
