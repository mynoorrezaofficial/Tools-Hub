# 🚀 Tools Hub: The All-in-One Student Toolkit

**Tools Hub** is a premium, open-source productivity suite designed specifically for modern student workflows. It combines artificial intelligence with robust file processing to provide a seamless "all-in-one" experience for handling assignments, presentations, and media.

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Flask%20%7C%20AI-blue)

## Live Demo
🚀 [Click here to try Tools Hub](https://toolshub-snowy.vercel.app/)

---

## ✨ Key Features

### 🖼️ AI Background Remover
Powered by the **BiRefNet** model, this tool provides professional-grade background removal.
- **Sharp Edges:** Custom alpha clamping logic ensures zero semi-transparency for crisp cutouts.
- **High Resolution:** Supports large images with optimized processing.
- **Perfect for:** Profile pictures, slide decks, and creative projects.

### 🔄 Dynamic File Converter
A comprehensive routing engine for dozens of file format combinations.
- **Image/PDF:** Convert images to PDF or extract PDF pages as images (individual or ZIP).
- **Documents:** Convert between Word (DOCX), Text (TXT), and PDF.
- **Data/Web:** Convert CSV to Excel (XLSX) or generate HTML/PPTX from text.
- **Auto-Slides:** Create basic PowerPoint presentations directly from text lines.

### 🎥 Universal Media Downloader
Extract high-quality media from across the web using the power of `yt-dlp`.
- **Wide Support:** Works with YouTube, TikTok, Twitter/X, and more.
- **Metadata Preview:** Real-time fetching of thumbnails, titles, and video duration.
- **Flexible Formats:** Download as MP4 (up to 1080p) or high-quality Audio (M4A).

### 📄 Professional CV Maker
A high-performance, multi-step resume builder with real-time visual feedback.
- **High-Fidelity Previews:** Live, scaled-down renders of actual templates (not static images).
- **Comprehensive Sections:** Dedicated areas for Experience, Education, Training, Languages, and References.
- **Custom Sections:** Add unlimited personalized categories like "Volunteering" or "Projects."
- **Premium Templates:** 6 distinct, professionally designed layouts (Classic, Atlantic Blue, Mercury Flow, etc.).
- **Multi-Format Export:** One-click download as PDF or Word (Docx).

### 🛡️ Browser Adblocker
A dedicated Manifest V3 browser extension for a distraction-free student experience.

---

## 🛠️ Technology Stack

### Frontend (Modern SPA)
- **Framework:** [React.js](https://reactjs.org/) (Vite-powered)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Design:** Glassmorphism UI with dynamic 3D elements and glow backdrops.

### Backend (Robust API)
- **Language:** Python
- **Framework:** [Flask](https://flask.palletsprojects.com/)
- **AI/ML:** `rembg` with BiRefNet model.
- **File Engines:** `PyMuPDF` (fitz), `python-docx`, `openpyxl`, `python-pptx`, `ReportLab`.
- **Downloader:** `yt-dlp`.

---

## 📂 Project Structure

```text
Tools_Hub/
├── frontend/             # React + Vite Application
│   ├── src/
│   │   ├── pages/        # BgRemove, Converter, MediaDownloader, CVMaker
│   │   ├── components/   # UI Layout & Navbar
│   │   └── App.jsx       # Routing & Home Page
├── backend/              # Flask API
│   ├── modules/          # Core Logic (bg_remove, converter, downloader)
│   ├── uploads/          # Temporary file storage
│   ├── outputs/          # Processed file storage
│   └── app.py            # API Routes
├── extensions/           # Browser extensions (Adblocker)
└── run_tools_hub.bat     # One-click launch script
```

---

## 🚀 Getting Started

### 1. Prerequisite
Ensure you have **Python 3.10+** and **Node.js** installed on your system.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Running the Project
For convenience, you can use the provided batch script on Windows:
```bash
run_tools_hub.bat
```

---

## 👤 Author
**Mynoor Reza**
- [Twitter](https://x.com/MynoorReza)
- [LinkedIn](https://www.linkedin.com/in/mynoor-reza/)
- [GitHub](https://github.com/mynoorrezaofficial)

---

## 📄 License
This project is open-source and available under the MIT License.
