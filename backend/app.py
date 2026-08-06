import os
import json
import uuid
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from modules.bg_remove import process_bg_removal
from modules.converter import convert_to_format
from modules.cv_generator import generate_cv_pdf, generate_cv_docx
from modules.metadata_reader import (
    extract_metadata, update_pdf_metadata, update_jpeg_metadata,
    update_png_metadata, update_docx_metadata, update_xlsx_metadata,
    update_pptx_metadata, update_audio_metadata, update_video_metadata
)

print("--- Tools Hub Backend Initializing ---")

app = Flask(__name__)
# Standard CORS for public APIs
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

@app.errorhandler(Exception)
def handle_exception(e):
    import traceback
    print(f"--- GLOBAL BACKEND ERROR ---\n{str(e)}")
    print(traceback.format_exc())
    
    response = jsonify({
        "success": False,
        "error": "Internal Server Error",
        "description": str(e)
    })
    # Manually add CORS to error responses to ensure Vercel sees the real error
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 500

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

@app.route('/api/cv/generate', methods=['POST'])
def cv_generate():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    format_type = data.get('format', 'pdf').lower()
    template = data.get('template', 'classic').lower()
    
    unique_id = str(uuid.uuid4())
    output_filename = f"cv_{unique_id}.{format_type}"
    output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
    
    try:
        if format_type == 'pdf':
            success, message = generate_cv_pdf(data, output_path, template)
            mimetype = 'application/pdf'
        elif format_type == 'docx':
            success, message = generate_cv_docx(data, output_path, template)
            mimetype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        else:
            return jsonify({"error": f"Unsupported format: {format_type}"}), 400
            
        if success:
            return send_file(
                output_path, 
                as_attachment=True, 
                download_name=f"My_CV.{format_type}",
                mimetype=mimetype
            )
        else:
            return jsonify({"error": message}), 500
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/metadata', methods=['POST'])
def metadata_extract():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '' or not file:
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    unique_id = str(uuid.uuid4())
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_id}_{filename}")

    file.save(input_path)

    try:
        result = extract_metadata(input_path)
        if "error" in result:
            return jsonify(result), 500
        return jsonify(result)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)

@app.route('/api/metadata/update', methods=['POST'])
def metadata_update():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '' or not file:
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    ext = os.path.splitext(filename)[1].lower()

    mode = request.form.get('mode', 'replace').lower()
    unique_id = str(uuid.uuid4())
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_id}_{filename}")
    output_suffix = 'deleted' if mode == 'delete' else 'updated'
    output_filename = f"{os.path.splitext(filename)[0]}_metadata_{output_suffix}{ext}"
    output_path = os.path.join(app.config['OUTPUT_FOLDER'], f"{unique_id}_{output_filename}")

    metadata_updates = {}
    if mode != 'delete':
        raw_metadata = request.form.get('metadata', '{}')
        try:
            metadata_updates = json.loads(raw_metadata) if raw_metadata else {}
        except Exception:
            return jsonify({"error": "Invalid metadata payload."}), 400

    file.save(input_path)

    mimetype_map = {
        '.pdf': 'application/pdf',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.mp3': 'audio/mpeg',
        '.m4a': 'audio/mp4',
        '.aac': 'audio/aac',
        '.flac': 'audio/flac',
        '.ogg': 'audio/ogg',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.mov': 'video/quicktime',
        '.mkv': 'video/x-matroska',
        '.avi': 'video/x-msvideo',
        '.webm': 'video/webm',
    }

    update_handlers = {
        '.pdf': lambda i, o, m, d: update_pdf_metadata(i, o, metadata_updates=m, delete_all=d),
        '.jpg': lambda i, o, m, d: update_jpeg_metadata(i, o, metadata_updates=m, delete_all=d),
        '.jpeg': lambda i, o, m, d: update_jpeg_metadata(i, o, metadata_updates=m, delete_all=d),
        '.png': lambda i, o, m, d: update_png_metadata(i, o, metadata_updates=m, delete_all=d),
        '.docx': lambda i, o, m, d: update_docx_metadata(i, o, metadata_updates=m, delete_all=d),
        '.xlsx': lambda i, o, m, d: update_xlsx_metadata(i, o, metadata_updates=m, delete_all=d),
        '.pptx': lambda i, o, m, d: update_pptx_metadata(i, o, metadata_updates=m, delete_all=d),
        '.mp3': lambda i, o, m, d: update_audio_metadata(i, o, metadata_updates=m, delete_all=d),
        '.m4a': lambda i, o, m, d: update_audio_metadata(i, o, metadata_updates=m, delete_all=d),
        '.aac': lambda i, o, m, d: update_audio_metadata(i, o, metadata_updates=m, delete_all=d),
        '.flac': lambda i, o, m, d: update_audio_metadata(i, o, metadata_updates=m, delete_all=d),
        '.ogg': lambda i, o, m, d: update_audio_metadata(i, o, metadata_updates=m, delete_all=d),
        '.wav': lambda i, o, m, d: update_audio_metadata(i, o, metadata_updates=m, delete_all=d),
        '.mp4': lambda i, o, m, d: update_video_metadata(i, o, metadata_updates=m, delete_all=d),
        '.mov': lambda i, o, m, d: update_video_metadata(i, o, metadata_updates=m, delete_all=d),
        '.mkv': lambda i, o, m, d: update_video_metadata(i, o, metadata_updates=m, delete_all=d),
        '.avi': lambda i, o, m, d: update_video_metadata(i, o, metadata_updates=m, delete_all=d),
        '.webm': lambda i, o, m, d: update_video_metadata(i, o, metadata_updates=m, delete_all=d),
    }

    handler = update_handlers.get(ext)
    if not handler:
        return jsonify({"error": f"Metadata editing is not supported for {ext} files."}), 400

    try:
        success, message = handler(input_path, output_path, metadata_updates, (mode == 'delete'))
        mimetype = mimetype_map.get(ext, 'application/octet-stream')

        if not success:
            return jsonify({"error": message}), 500

        return send_file(
            output_path,
            as_attachment=True,
            download_name=output_filename,
            mimetype=mimetype
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)

if __name__ == '__main__':
    # Use environment variable for port if available (for direct running)
    port = int(os.environ.get("PORT", 5000))
    print(f"Server starting on port {port}...")
    app.run(host='0.0.0.0', port=port)
