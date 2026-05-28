# Web Page Summarizer AI — Complete Setup Guide

## Project Structure

```
root/
├── app.py               ← Flask backend (fixed)
├── requirements.txt     ← Minimal Python dependencies
├── .env                 ← Local secrets (NOT committed to Git)
├── .env.example         ← Template to share with team
│
└── frontend/            ← React + Vite app
    ├── src/
    │   ├── App.jsx      ← Main UI component (fixed)
    │   ├── main.jsx     ← React entry point
    │   └── index.css    ← Tailwind import
    ├── .env             ← Frontend env vars (VITE_ prefix)
    ├── package.json
    └── vite.config.js
```

---

## Local Development Setup

### 1. Backend

```bash
# In the root/backend folder
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# → Edit .env and add your GEMINI_API_KEY

# Run Flask
python app.py
# Backend runs at http://localhost:5000
```

### 2. Frontend

```bash
# In the frontend folder
npm install

# Create frontend .env
echo "VITE_API_URL=http://localhost:5000" > .env

# Run Vite dev server
npm run dev
# Frontend runs at http://localhost:5173
```

---

## Render Deployment

### Backend (Web Service)

| Setting | Value |
|---|---|
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app` |
| **Environment Variables** | See below |

**Environment Variables to add in Render dashboard:**

| Key | Value |
|---|---|
| `GEMINI_API_KEY` | Your key from https://aistudio.google.com |

### Frontend (Static Site)

| Setting | Value |
|---|---|
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Environment Variables** | See below |

**Environment Variables for frontend build:**

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://your-backend-name.onrender.com` |

> ⚠️ The `VITE_API_URL` must be set **before** building — Vite bakes it into the bundle at build time.

---

## Getting a Gemini API Key (Free)

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with a Google account
3. Click **Create API Key**
4. Copy the key → paste into `.env` or Render env vars

**Free tier limits:** 15 requests/minute, 1 million tokens/day (more than enough for this app)

---

## Common Issues & Fixes

| Problem | Fix |
|---|---|
| `GEMINI_API_KEY not set` | Add the key to `.env` locally or Render env vars |
| `Quota exceeded (429)` | Wait a minute; free tier is 15 req/min |
| `Could not reach server` | Check `VITE_API_URL` points to correct backend URL |
| `No readable content found` | The site may block scrapers (e.g. JS-heavy SPAs) |
| Render backend sleeps (free tier) | First request takes ~30s to wake up — this is normal |

---

## What Was Fixed

1. **`app.py`** — Removed `print(summary)` / `print(text[:500])` outside functions (caused startup crash)
2. **Gemini model** — Using `gemini-1.5-flash` (stable free-tier model)
3. **Error handling** — Separate handling for timeout, connection errors, quota exceeded, and invalid key
4. **`requirements.txt`** — Stripped from 50+ packages to 7 essentials (faster Render deploys)
5. **`App.jsx`** — Properly renders summary, AI errors (quota), extracted text, and loading/error states
6. **Fallback** — If Gemini quota fails, the extracted text preview is still shown
