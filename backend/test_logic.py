import os
from PIL import Image
from modules.bg_remove import process_bg_removal
from modules.converter import image_to_pdf

def test():
    # Setup paths
    os.makedirs('uploads', exist_ok=True)
    os.makedirs('outputs', exist_ok=True)
    
    test_img_path = 'uploads/test_image.png'
    test_bg_out = 'outputs/test_nobg.png'
    test_pdf_out = 'outputs/test_pdf.pdf'

    # 1. Create a dummy test image
    img = Image.new('RGB', (100, 100), color = 'red')
    img.save(test_img_path)
    print("Created test image.")

    # 2. Test BG removal
    print("Testing background removal (this might download the rembg model on first run)...")
    success, msg = process_bg_removal(test_img_path, test_bg_out)
    if success:
        print(f"✅ BG Removal passed.")
    else:
        print(f"❌ BG Removal failed: {msg}")

    # 3. Test conversion
    print("Testing image to PDF conversion...")
    success, msg = image_to_pdf([test_img_path], test_pdf_out)
    if success:
        print(f"✅ Image to PDF passed.")
    else:
        print(f"❌ Image to PDF failed: {msg}")

if __name__ == '__main__':
    test()
