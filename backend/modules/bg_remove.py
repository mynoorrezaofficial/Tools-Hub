# Imports are moved inside to save memory during startup
from PIL import Image

# Persistent session variable
_session = None

def get_session():
    """Lazy-load a lightweight model session suitable for cloud free tiers (512MB)."""
    from rembg import new_session
    global _session
    if _session is None:
        # Using birefnet-general as requested
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
        
        # --- OPTIMIZED SHARP EDGE CUTOUT ---
        output_image = output_image.convert("RGBA")
        
        # Split into channels
        r, g, b, a = output_image.split()
        
        # Threshold the alpha channel: if a > 100, set to 255, else 0
        a = a.point(lambda p: 255 if p > 100 else 0)
        
        # Merge back
        output_image = Image.merge("RGBA", (r, g, b, a))
        # -----------------------------------
        # --------------------------------

        # Ensure it's saved as a PNG with transparency
        output_image.save(output_path, "PNG")
        return True, "Background removed successfully with sharp edges."
    except Exception as e:
        return False, str(e)
