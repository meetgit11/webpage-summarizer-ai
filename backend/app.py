from flask import Flask, request, jsonify
from flask_cors import CORS

import requests
from bs4 import BeautifulSoup

import google.generativeai as genai

from dotenv import load_dotenv
import os

# Load environment variables from .env file (local dev only)
load_dotenv()

app = Flask(__name__)
CORS(app)

# ── Gemini Setup ──────────────────────────────────────────────────────────────
# The API key comes from .env locally, and from Render environment vars in prod.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # gemini-1.5-flash is the stable, widely-available free-tier model.
    # If you have access to gemini-2.0-flash, swap the string below.
    model = genai.GenerativeModel("gemini-2.0-flash")
else:
    model = None
    print("WARNING: GEMINI_API_KEY not set — AI summarization will be disabled.")


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def home():
    return "Web Page Summarizer AI — Backend is Running ✅"


@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    url = data.get("url", "").strip()

    if not url:
        return jsonify({"error": "URL is required"}), 400

    # ── Step 1: Scrape the webpage ─────────────────────────────────────────
    try:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            )
        }
        response = requests.get(url, headers=headers, timeout=12)
        response.raise_for_status()  # raises for 4xx/5xx status codes
    except requests.exceptions.Timeout:
        return jsonify({"error": "The webpage took too long to respond (timeout)."}), 408
    except requests.exceptions.ConnectionError:
        return jsonify({"error": "Could not connect to the URL. Please check it and try again."}), 400
    except requests.exceptions.HTTPError as e:
        return jsonify({"error": f"The webpage returned an error: {e}"}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to fetch webpage: {str(e)}"}), 500

    # ── Step 2: Parse and clean the HTML ──────────────────────────────────
    try:
        soup = BeautifulSoup(response.text, "html.parser")

        # Remove tags that don't contain readable content
        for tag in soup(["script", "style", "noscript", "nav", "footer", "header"]):
            tag.decompose()

        text = soup.get_text(separator=" ", strip=True)

        # Collapse excessive whitespace
        import re
        text = re.sub(r"\s+", " ", text).strip()

        if len(text) < 100:
            return jsonify({"error": "No readable content found on this webpage."}), 400

        # Limit to 8 000 chars — Gemini's free tier handles this comfortably
        text_for_ai = text[:8000]

    except Exception as e:
        return jsonify({"error": f"Failed to parse webpage content: {str(e)}"}), 500

    # ── Step 3: Generate AI Summary ───────────────────────────────────────
    summary = None
    ai_error = None

    if model is None:
        ai_error = "AI summarization is unavailable (API key not configured)."
    else:
        try:
            prompt = (
                "You are a helpful assistant. "
                "Read the following webpage content and write a clear, concise summary "
                "in 3–5 sentences. Focus on the main topic and key points. "
                "Do not start with phrases like 'This webpage' or 'This article'.\n\n"
                f"Content:\n{text_for_ai}"
            )
            gemini_response = model.generate_content(prompt)
            summary = gemini_response.text.strip()

        except Exception as e:
            error_msg = str(e).lower()
            if "quota" in error_msg or "429" in error_msg or "resource_exhausted" in error_msg:
                ai_error = (
                    "Gemini API quota exceeded. "
                    "The extracted text is shown below — please try again later for the AI summary."
                )
            elif "api_key" in error_msg or "invalid" in error_msg:
                ai_error = "Gemini API key is invalid or not authorized."
            else:
                ai_error = f"AI summarization failed: {str(e)}"

    # ── Step 4: Return response ───────────────────────────────────────────
    return jsonify({
        "summary": summary,               # None if AI failed
        "ai_error": ai_error,             # None if AI succeeded
        "extracted_text": text[:1500],    # Preview of scraped text
        "char_count": len(text),
    })


if __name__ == "__main__":
    app.run(debug=True)
