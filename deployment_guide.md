# 🚀 Deployment Guide: Tools Hub

To deploy Tools Hub successfully, we recommend a **Split-Deployment Architecture**. This ensures the frontend remains lightning-fast on Vercel while the heavy AI-powered backend has enough resources on a dedicated Python host.

---

## 🏗️ Recommended Architecture

*   **Frontend (React/Vite):** Deploy on **Vercel** (Free, Optimized for React).
*   **Backend (Flask/AI):** Deploy on **Render** or **Railway** (Better for heavy Python libraries like `rembg` and `yt-dlp`).

---

## 🛠️ Step 1: Prepare the Backend (Render)

The backend is heavy because of the BiRefNet AI model. Render is excellent for this.

1.  **Create a GitHub Repository** and push your `backend/` folder to it (or push the whole project and set the build root to `backend`).
2.  **Create a New Web Service** on Render.
3.  **Configure Service:**
    - **Runtime:** `Python 3`
    - **Build Command:** `pip install -r requirements.txt`
    - **Start Command:** `gunicorn app:app` (You may need to add `gunicorn` to `requirements.txt`).
4.  **Environment Variables:**
    - No specific vars needed initially, but ensure `PORT` is handled by Render (it usually is).
5.  **Copy the URL:** Once deployed, Render will give you a URL like `https://tools-hub-api.onrender.com`.

---

## 🌐 Step 2: Prepare the Frontend (Vercel)

Vercel is the best home for your Vite-powered React app.

1.  **Push your code** to GitHub (if not already done).
2.  **Import to Vercel:**
    - Log in to [Vercel](https://vercel.com).
    - Click **"Add New"** -> **"Project"**.
    - Import your Tools Hub repository.
3.  **Configure Project:**
    - **Framework Preset:** `Vite`
    - **Root Directory:** `frontend`

4.  **Deploy:** Click **"Deploy"**.

---

## 🔗 Step 3: Connect Frontend to Backend

Your frontend has been configured to **automatically detect** its environment and route API requests accordingly using dynamic browser routing. You do not need to configure any environment variables in Vercel.

### Update logic:
The code across all tools automatically uses:
```javascript
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:5000' 
  : 'https://tools-hub-9q7i.onrender.com';
```

---

## 📝 Important Notes for Vercel
- **Serverless Limits:** Do NOT host the Flask backend directly on Vercel as a "Serverless Function." The AI models and video downloads will likely exceed Vercel's execution time and memory limits.
- **CORS:** Ensure your Flask backend has `CORS(app)` enabled (which it already does in `app.py`).

---

**Next Steps:** Your application is fully configured and ready for production!
