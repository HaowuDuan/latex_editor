from flask import Flask, request, jsonify, send_file
import subprocess
import os
import shutil
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration for file uploads
UPLOAD_FOLDER = 'temp'
ALLOWED_EXTENSIONS = {'sty'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload-package', methods=['POST'])
def upload_package():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        return jsonify({'message': f'Package {filename} uploaded successfully'})
    
    return jsonify({'error': 'Invalid file type. Only .sty files are allowed'}), 400

@app.route('/api/packages', methods=['GET'])
def list_packages():
    packages = []
    if os.path.exists(UPLOAD_FOLDER):
        for file in os.listdir(UPLOAD_FOLDER):
            if file.endswith('.sty'):
                packages.append(file)
    return jsonify({'packages': packages})

@app.route('/api/delete-package/<filename>', methods=['DELETE'])
def delete_package(filename):
    if not allowed_file(filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    filepath = os.path.join(UPLOAD_FOLDER, secure_filename(filename))
    if os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({'message': f'Package {filename} deleted successfully'})
    
    return jsonify({'error': 'Package not found'}), 404

@app.route('/api/compile', methods=['POST'])
def compile_latex():
    try:
        data = request.get_json()
        latex_content = data.get('latex', '')
        custom_filename = data.get('filename', 'document')
        
        if not latex_content:
            return jsonify({'error': 'No LaTeX content provided'}), 400
        
        # Use custom filename directly
        tex_file = os.path.join('temp', f'{custom_filename}.tex')
        pdf_file = os.path.join('temp', f'{custom_filename}.pdf')
        
        # Create a subdirectory for this compilation to support custom .sty files
        compile_dir = os.path.join('temp', f'{custom_filename}_compile')
        os.makedirs(compile_dir, exist_ok=True)
        
        # Write LaTeX content to file in the compile directory
        tex_file_in_dir = os.path.join(compile_dir, f'{custom_filename}.tex')
        with open(tex_file_in_dir, 'w', encoding='utf-8') as f:
            f.write(latex_content)
        
        # Copy any .sty files from the main temp directory to compile directory
        for file in os.listdir('temp'):
            if file.endswith('.sty'):
                src = os.path.join('temp', file)
                dst = os.path.join(compile_dir, file)
                shutil.copy2(src, dst)
        
        # Compile LaTeX to PDF in the compile directory
        result = subprocess.run(
            ['pdflatex', '-interaction=nonstopmode', '-output-directory', compile_dir, tex_file_in_dir],
            capture_output=True,
            text=True,
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        
        if result.returncode != 0:
            # Clean up files
            for ext in ['.tex', '.aux', '.log']:
                try:
                    os.remove(f'{tex_file_in_dir[:-4]}{ext}')
                except:
                    pass
            return jsonify({'error': f'LaTeX compilation failed: {result.stderr}'}), 400
        
        # Check if PDF was created in compile directory
        pdf_file_in_dir = os.path.join(compile_dir, f'{custom_filename}.pdf')
        if not os.path.exists(pdf_file_in_dir):
            return jsonify({'error': 'PDF file was not created'}), 400
        
        # Copy PDF to main temp directory for serving
        shutil.copy2(pdf_file_in_dir, pdf_file)
        
        # Return PDF file directly
        return send_file(pdf_file, as_attachment=False, mimetype='application/pdf', download_name=f'{custom_filename}.pdf')
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Create temp directory if it doesn't exist
    os.makedirs('temp', exist_ok=True)
    app.run(debug=True, port=5001)
