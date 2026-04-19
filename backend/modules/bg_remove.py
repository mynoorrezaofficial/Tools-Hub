# Imports are moved inside to save memory during startup
from PIL import Image

# Persistent session variable
_session = None

def get_session():
    """Lazy-load the BiRefNet model session."""
    from rembg import new_session
    global _session
    if _session is None:
        _session = new_session("birefnet-general")
    return _session

def process_bg_removal(input_path, output_path):
    """
    Removes the background using a deferred rembg import.
    """
    from rembg import remove
    try:
        input_image = Image.open(input_path)
        # Use the lazy-loaded BiRefNet session instance and apply post-processing
        output_image = remove(input_image, session=get_session(), post_process_mask=True)
        
        # --- FORCED SHARP EDGE CUTOUT ---
        # Rembg produces anti-aliased (feathered) edges by default. 
        # To force a strictly sharp edge (no semi-transparent fading), we clamp the alpha channel.
        # Ensure image is in RGBA mode
        output_image = output_image.convert("RGBA")
        
        # Get pixels and modify alpha
        pixel_data = output_image.getdata()
        sharp_pixels = []
        for r, g, b, a in pixel_data:
            # If alpha is greater than 100, make it fully solid; else make it fully transparent (0)
            if a > 100:
                sharp_pixels.append((r, g, b, 255))
            else:
                sharp_pixels.append((r, g, b, 0))
                
        output_image.putdata(sharp_pixels)
        # --------------------------------

        # Ensure it's saved as a PNG with transparency
        output_image.save(output_path, "PNG")
        return True, "Background removed successfully with sharp edges."
    except Exception as e:
        return False, str(e)
