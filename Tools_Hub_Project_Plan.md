# Tools Hub Project Plan
**by Mynoor Reza**

---

## 1. Project Overview
**Tools Hub** is an all-in-one web platform for students to handle assignments, presentations, and file-related tasks.  
The MVP includes:

- Background remover (BiRefNet advanced model for sharp edges)
- File converter (Document & Image format routing)
- Media Downloader (High-quality MP4/MP3 extraction from URL)
- Ad Blocker (Browser extension for Chrome/Edge)

**Future features may include:**

- OCR (image → text)
- Notes summarizer
- Assignment formatting tools
- Slide content generator

---

## 2. Tech Stack

### 2.1 Frontend (Advanced UI)
- **Languages:** HTML5, CSS3, JavaScript
- **Frameworks/Libraries:**
  - React.js (component-based dynamic UI)
  - Tailwind CSS (modern styling)
  - Framer Motion (animations)
  - React Router (page navigation)
  - Axios / Fetch API (API calls)
- **Features:**
  - Responsive design (mobile + desktop)
  - Drag & drop uploads
  - Edge-to-edge Glassmorphism Navigation
  - Smooth React Router native transitions
  - Dark/Light mode toggle

### 2.2 Backend
- **Language:** Python
- **Framework:** Flask (lightweight) / FastAPI (advanced, async)
- **Libraries:**
  - `rembg` (BiRefNet) → background remover
  - `Pillow` → image processing
  - `pdf2image` / `python-docx` / `python-pptx` → advanced file conversions
  - `yt-dlp` → media metadata extraction & single-video downloading
  - `Tesseract OCR` → text extraction (future)
- **Features:**
  - File upload/download handling
  - API endpoints for frontend
  - Modular processing logic

### 2.3 Hosting & Deployment
- **Frontend (Vercel):** 
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Environment Variable: `VITE_API_URL` (Point to Render backend URL)
- **Backend (Render):**
  - Root Directory: `backend`
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `gunicorn app:app`
  - Environment Variable: `PORT` (Automatic)
- **Repo:** `https://github.com/mynoorrezaofficial/Tools-Hub.git`

---

## 3. Project Structure
tools-hub/
│
├── frontend/ # React App
│ ├── src/
│ │ ├── components/ # Navbar, Footer, Buttons
│   │   ├── pages/ # Home, BgRemove, Converter, MediaDownloader, AdBlocker
│   │   ├── App.jsx
│   │   └── index.css
│   └── public/
│       └── index.html
│
├── backend/ # Flask API (Active Venv)
│   ├── app.py # Main application router
│   ├── modules/ # Core processing logic
│   │   ├── bg_remove.py (BiRefNet logic)
│   │   ├── converter.py
│   │   └── media_downloader.py (yt-dlp core)
│   ├── uploads/ # Temporary user uploads
│   └── outputs/ # Processed file outputs
│
├── extensions/ # Browser extensions
    ├── adblocker/ # Ad Blocker source (manifest v3)
├── requirements.txt # Python dependencies (Flask, yt-dlp, rembg, etc.)
├── package.json # React dependencies
└── README.md / Tools_Hub_Project_Plan.md # Project documentation

---

## 4. Page Flow (User Journey)

### 4.1 Homepage
- Intro to Tools Hub
- Buttons for:
  - Background Remover
  - File Converter
- Quick description of tools

### 4.2 Background Remover Page
- Upload image (JPG/PNG)
- Click “Remove Background”
- Download result as PNG

### 4.3 File Converter Page
- Clean drag-and-drop workspace
- Select conversion routes (PDF to JPG, Word to PDF, etc.)
- Click “Convert”
- Download processed file

### 4.4 Media Downloader Page
- Input target media URL (YouTube, Twitter, TikTok, etc.)
- Backend automatically ignores playlists (`noplaylist` engine target)
- UI renders embedded Title, Duration, and Thumbnail
- 1-Click options for MP4 (720p/1080p) or MP3/M4A Audio

### 4.5 Ad Blocker Page
- Direct download button for `toolshub-adblocker.zip`
- Detailed 4-step manual installation guide (Chrome/Edge Developer Mode)
- Premium landing page UI describing block status and safety benefits

---

## 5. Routing Plan (Flask Example)

```python
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/bg-remove', methods=['GET', 'POST'])
def bg_remove():
    return render_template('bg_remove.html')

@app.route('/converter', methods=['GET', 'POST'])
def converter():
    return render_template('converter.html')