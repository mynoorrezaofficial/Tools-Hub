import os
import sys
from modules.converter import convert_to_format

# Mock data
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
OUTPUT_FOLDER = os.path.join(BASE_DIR, 'outputs')
TEMP_FOLDER = os.path.join(BASE_DIR, 'temp')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs(TEMP_FOLDER, exist_ok=True)

# Test Image to PDF
test_img = os.path.join(UPLOAD_FOLDER, "test.png")
from PIL import Image
Image.new('RGB', (100, 100), color='red').save(test_img)

print("--- Testing Image to PDF ---")
success, msg = convert_to_format([test_img], os.path.join(OUTPUT_FOLDER, "test.pdf"), 'pdf', TEMP_FOLDER)
print(f"Success: {success}, Message: {msg}")

# Test Text to PDF
test_txt = os.path.join(UPLOAD_FOLDER, "test.txt")
with open(test_txt, 'w') as f: f.write("Hello World")

print("\n--- Testing Text to PDF ---")
success, msg = convert_to_format([test_txt], os.path.join(OUTPUT_FOLDER, "test_txt.pdf"), 'pdf', TEMP_FOLDER)
print(f"Success: {success}, Message: {msg}")

print("\n--- Diagnostic Check ---")
try:
    import fitz
    import docx
    import reportlab
    print("All libraries imported successfully.")
except Exception as e:
    print(f"Library Missing: {e}")
