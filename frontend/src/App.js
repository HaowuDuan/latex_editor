import React, { useState } from 'react';
import SplitPane from './components/SplitPane';
import LatexEditor from './components/LatexEditor';
import PdfViewer from './components/PdfViewer';
import PackageManager from './components/PackageManager';
import './App.css';

const defaultLatex = `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{geometry}
\\usepackage{hyperref}
\\usepackage{xcolor}

\\geometry{margin=1in}

\\begin{document}

\\title{My LaTeX Document}
\\author{Your Name}
\\date{\\today}
\\maketitle

\\section{Introduction}
This is an introduction section with some math: $E = mc^2$

\\section{Math Examples}
Here are some mathematical expressions:

\\begin{equation}
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
\\end{equation}

\\begin{align}
a^2 + b^2 &= c^2 \\\\
\\frac{d}{dx}(x^n) &= nx^{n-1}
\\end{align}

\\section{Conclusion}
This is a conclusion section.

\\end{document}`;

function App() {
  const [latexContent, setLatexContent] = useState(defaultLatex);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState('document');

  const handleRename = async (newFilename) => {
    if (!pdfUrl) return;
    
    try {
      // Create a new blob with the same content but different filename
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      
      // Create a new File with the new filename
      const file = new File([blob], `${newFilename}.pdf`, { type: 'application/pdf' });
      const newUrl = URL.createObjectURL(file);
      
      // Clean up the old URL
      URL.revokeObjectURL(pdfUrl);
      
      // Update the PDF URL and filename
      setPdfUrl(newUrl);
      setFilename(newFilename);
    } catch (err) {
      console.error('Error renaming PDF:', err);
    }
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    setError(null);
    
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          latex: latexContent,
          filename: filename || 'document'
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        // Create a blob with the proper filename
        const file = new File([blob], `${filename || 'document'}.pdf`, { type: 'application/pdf' });
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Compilation failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>LaTeX Editor</h1>
        <button 
          className="compile-button" 
          onClick={handleCompile}
          disabled={isCompiling}
        >
          {isCompiling ? 'Compiling...' : 'Compile'}
        </button>
      </header>
      
      {error && (
        <div className="error-message">
          <h3>Compilation Error:</h3>
          <pre>{error}</pre>
        </div>
      )}
      
      <PackageManager />
      
      <SplitPane>
        <LatexEditor 
          value={latexContent} 
          onChange={setLatexContent}
        />
        <PdfViewer 
          pdfUrl={pdfUrl} 
          filename={filename}
          onFilenameChange={setFilename}
          onRename={handleRename}
        />
      </SplitPane>
    </div>
  );
}

export default App;
