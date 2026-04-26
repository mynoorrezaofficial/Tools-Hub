import os
import yt_dlp
import uuid

def get_media_info(url):
    """
    Fetches the metadata (thumbnail, title, duration) for a given media URL.
    """
    ydl_opts = {
        'quiet': False,
        'no_warnings': False,
        'noplaylist': True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            title = info.get('title', 'Unknown Media')
            duration = info.get('duration', 0)
            thumbnail = info.get('thumbnail', None)
            
            return {
                "success": True,
                "title": title,
                "duration": duration,
                "thumbnail": thumbnail,
                "resolutions": ["1080p", "720p"] 
            }
    except Exception as e:
        import traceback
        print(f"[media_downloader ERROR] {str(e)}")
        print(traceback.format_exc())
        return {
            "success": False,
            "error": str(e)
        }

def download_media(url, format_type, quality, output_dir):
    """
    Downloads the media and saves it to the output_dir. 
    Returns the final file path upon success.
    """
    try:
        # Give it a unique name to prevent collisions
        filename = f"{uuid.uuid4()}"
        outtmpl = os.path.join(output_dir, f"{filename}.%(ext)s")
        
        ydl_opts = {
            'outtmpl': outtmpl,
            'quiet': True,
            'no_warnings': True,
            'noplaylist': True,
            # Suppress yt-dlp logging output for clean console
            'logger': None, 
        }
        
        if format_type == "audio":
            # Best audio in m4a natively (doesn't require FFmpeg to merge/extract)
            ydl_opts['format'] = 'bestaudio[ext=m4a]/bestaudio/best'
        else:
            # We enforce [ext=mp4] which guarantees wide compatibility and often pre-merged AV.
            # If 1080p exists as pre-merged, it grabs it. Usually YouTube caps pre-merged at 720p.
            if quality == "720p":
                ydl_opts['format'] = 'best[height<=720][ext=mp4]/best[ext=mp4]/best'
            elif quality == "1080p":
                ydl_opts['format'] = 'best[height<=1080][ext=mp4]/best[ext=mp4]/best'
            else:
                ydl_opts['format'] = 'best[ext=mp4]/best'

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            dl_file = ydl.prepare_filename(info)
            
            # Determine actual generated extension
            if format_type == "audio":
                ext = info.get('audio_ext', 'm4a')
                if ext == 'none': ext = 'm4a'
            else:
                ext = info.get('ext', 'mp4')
                
            return {
                "success": True,
                "file_path": dl_file,
                "title": info.get('title', 'media_file'),
                "ext": ext
            }
                
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
