import os
import uuid
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from modules.bg_remove import process_bg_removal
from modules.converter import convert_to_format

print("--- Tools Hub Backend Initializing ---")

app = Flask(__name__)
CORS(app)

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
OUTPUT_FOLDER = os.path.join(BASE_DIR, 'outputs')
TEMP_FOLDER = os.path.join(BASE_DIR, 'temp')

print(f"Base Directory: {BASE_DIR}")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs(TEMP_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['TEMP_FOLDER'] = TEMP_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 32 * 1024 * 1024  # 32 MB

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Tools Hub API is running! 🚀"
    })

@app.route('/api/remove-bg', methods=['POST'])
def remove_bg():
    if 'image' not in request.files:
        return jsonify({"error": "No image field provided"}), 400
    
    file = request.files['image']
    if file.filename == '' or not file:
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    unique_id = str(uuid.uuid4())
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_id}_{filename}")
    output_filename = f"{os.path.splitext(filename)[0]}_nobg.png"
    output_path = os.path.join(app.config['OUTPUT_FOLDER'], f"{unique_id}_{output_filename}")
    
    file.save(input_path)
    success, message = process_bg_removal(input_path, output_path)
    
    if success:
        return send_file(output_path, as_attachment=True, download_name=output_filename, mimetype='image/png')
    else:
        return jsonify({"error": message}), 500

@app.route('/api/convert', methods=['POST'])
def convert_route():
    if 'files' not in request.files:
        return jsonify({"error": "No files provided"}), 400
    
    target_format = request.form.get('target_format', 'pdf').lower()
    files = request.files.getlist('files')
    
    if not files or files[0].filename == '':
        return jsonify({"error": "Empty file list"}), 400
        
    unique_id = str(uuid.uuid4())
    input_paths = []
    
    for file in files:
        filename = secure_filename(file.filename)
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_id}_{filename}")
        file.save(input_path)
        input_paths.append(input_path)
            
    output_filename = f"converted_{unique_id}.{target_format}"
    output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
    
    try:
        # Process conversion
        success, message = convert_to_format(
            input_paths, 
            output_path, 
            target_format, 
            os.path.join(app.config['TEMP_FOLDER'], unique_id)
        )
        
        if success:
            mimetypes = {
                'pdf':  'application/pdf',
                'zip':  'application/zip',
                'png':  'image/png',
                'jpg':  'image/jpeg',
                'jpeg': 'image/jpeg',
                'webp': 'image/webp',
                'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'txt':  'text/plain',
                'html': 'text/html',
                'csv':  'text/csv',
            }
            return send_file(
                output_path, 
                as_attachment=True, 
                download_name=f"tools_hub_result.{target_format}",
                mimetype=mimetypes.get(target_format, 'application/octet-stream')
            )
        else:
            print(f"Conversion Error: {message}")
            return jsonify({"error": message}), 500
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

from modules.media_downloader import get_media_info, download_media

@app.route('/api/media/info', methods=['POST'])
def media_info():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    
    try:
        result = get_media_info(url)
        if result['success']:
            return jsonify(result)
        else:
            return jsonify({"error": result['error']}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/media/download', methods=['POST'])
def media_download():
    data = request.json
    url = data.get('url')
    format_type = data.get('format', 'video') # audio or video
    quality = data.get('quality', '720p')
    
    if not url:
        return jsonify({"error": "No URL provided"}), 400
        
    download_dir = os.path.join(app.config['OUTPUT_FOLDER'])
    
    try:
        result = download_media(url, format_type, quality, download_dir)
        if result['success']:
            safe_title = "".join([c for c in result["title"] if c.isalpha() or c.isdigit() or c==' ']).rstrip()
            filename = f"{safe_title}.{result['ext']}"
            mime = 'video/mp4' if result['ext'] == 'mp4' else 'audio/mp4'
            return send_file(result['file_path'], as_attachment=True, download_name=filename, mimetype=mime)
        else:
            return jsonify({"error": result['error']}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Use environment variable for port if available (for direct running)
    port = int(os.environ.get("PORT", 5000))
    print(f"Server starting on port {port}...")
    app.run(host='0.0.0.0', port=port)
