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
    - **Environment Variables:**
        - Add a variable named `VITE_API_BASE_URL`.
        - Value: `https://your-backend-url.onrender.com` (from Step 1).
4.  **Deploy:** Click **"Deploy"**.

---

## 🔗 Step 3: Connect Frontend to Backend

Currently, your frontend is hardcoded to `localhost`. I will help you update this to use the `VITE_API_BASE_URL` variable so it works both locally and in production.

### Update logic:
The code will be updated across all pages to use:
```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

---

## 📝 Important Notes for Vercel
- **Serverless Limits:** Do NOT host the Flask backend directly on Vercel as a "Serverless Function." The AI models and video downloads will likely exceed Vercel's execution time and memory limits.
- **CORS:** Ensure your Flask backend has `CORS(app)` enabled (which it already does in `app.py`).

---

**Next Steps:** I will now proceed to update your frontend files to support these environment variables.
