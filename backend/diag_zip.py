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

# Test PDF to ZIP
test_pdf = os.path.join(OUTPUT_FOLDER, "test.pdf") # Using the one from previous diag run if it exists
if not os.path.exists(test_pdf):
    from reportlab.pdfgen import canvas
    c = canvas.Canvas(test_pdf)
    c.drawString(100, 750, "Test PDF content")
    c.save()

print("\n--- Testing PDF to ZIP Images ---")
try:
    success, msg = convert_to_format(test_pdf, os.path.join(OUTPUT_FOLDER, "test.zip"), 'zip', os.path.join(TEMP_FOLDER, "diag_unique_id"))
    print(f"Success: {success}, Message: {msg}")
except Exception as e:
    import traceback
    traceback.print_exc()
