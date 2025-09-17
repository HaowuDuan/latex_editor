# LaTeX Web Editor

A web-based LaTeX editor with split-pane layout: LaTeX input on the left, PDF preview on the right.

## Features

- **Split-pane interface**: Edit LaTeX on the left, view PDF on the right
- **Real-time compilation**: Click "Compile" to generate PDF from LaTeX source
- **Error handling**: Clear error messages for compilation failures
- **Clean UI**: Modern, responsive design
- **Pre-loaded template**: Basic LaTeX document structure included

## Technology Stack

- **Backend**: Flask (Python) - handles LaTeX compilation
- **Frontend**: React - provides the user interface
- **LaTeX**: System LaTeX installation (pdflatex)

## Prerequisites

- Python 3.7+
- Node.js 14+
- LaTeX distribution (TeX Live, MiKTeX, etc.)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd latex_editor
   ```

2. **Set up Python backend**
   ```bash
   # Activate virtual environment (already created)
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install Python dependencies
   cd backend
   pip install -r requirements.txt
   ```

3. **Set up React frontend**
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. **Start the Flask backend** (in one terminal)
   ```bash
   cd backend
   python app.py
   ```
   The backend will run on http://localhost:5000

2. **Start the React frontend** (in another terminal)
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on http://localhost:3000

3. **Open your browser** and navigate to http://localhost:3000

## Usage

1. Edit the LaTeX code in the left pane
2. Click the "Compile" button to generate the PDF
3. View the compiled PDF in the right pane
4. If there are compilation errors, they will be displayed above the editor

## API Endpoints

- `POST /api/compile` - Compile LaTeX to PDF
  - Request body: `{"latex": "LaTeX source code"}`
  - Success: Returns PDF file
  - Error: Returns JSON with error message

- `GET /api/health` - Health check endpoint

## Project Structure

```
latex-editor/
├── backend/                    # Flask backend
│   ├── app.py                 # Main Flask application
│   ├── temp/                  # Temporary LaTeX/PDF files
│   └── requirements.txt       # Python dependencies
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── LatexEditor.js    # Left pane: LaTeX text editor
│   │   │   ├── PdfViewer.js      # Right pane: PDF display
│   │   │   └── SplitPane.js      # Split layout container
│   │   ├── App.js             # Main React component
│   │   └── index.js           # React entry point
│   └── package.json           # Node.js dependencies
├── README.md
└── .gitignore
```

## Troubleshooting

- **"pdflatex command not found"**: Make sure LaTeX is installed and in your PATH
- **CORS errors**: Ensure the Flask backend is running on port 5000
- **PDF not displaying**: Check browser console for errors and ensure the backend is running

## License

MIT License
