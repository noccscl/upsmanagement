from flask import Flask, send_from_directory, jsonify, request
import os

app = Flask(__name__)

# List of root directories for the CSV folders
CSV_ROOT_DIRECTORIES = [
    '.',  # Current directory
    'C:\Users\Dell\Desktop\ups management\csv.file'  # Replace with your actual path
]

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/list_folders', methods=['GET'])
def list_folders():
    all_folders = []
    try:
        for root_dir in CSV_ROOT_DIRECTORIES:
            folders = [f for f in os.listdir(root_dir) if os.path.isdir(os.path.join(root_dir, f))]
            all_folders.extend([os.path.join(root_dir, folder) for folder in folders])
        return jsonify(all_folders)
    except Exception as e:
        return str(e), 500

@app.route('/list_files', methods=['GET'])
def list_files():
    folder = request.args.get('folder')
    if not folder:
        return "Folder not specified", 400

    try:
        files = [f for f in os.listdir(folder) if f.endswith('.csv')]
        return jsonify(files)
    except Exception as e:
        return str(e), 500

@app.route('/get_csv', methods=['GET'])
def get_csv():
    folder = request.args.get('folder')
    filename = request.args.get('filename')
    if not folder or not filename:
        return "Folder or filename not specified", 400
    
    file_path = os.path.join(folder, filename)
    if os.path.exists(file_path):
        return send_from_directory(folder, filename)
    else:
        return "File not found", 404

if __name__ == '__main__':
    app.run(debug=True)
