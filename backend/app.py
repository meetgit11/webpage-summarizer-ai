from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

import requests
from bs4 import BeautifulSoup
import os
import re

load_dotenv()

app = Flask(__name__)
CORS(app)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


@app.route("/")
def home():
    return "Backend running successfully ✅"


@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        url = data.get("url", "").strip()

        if not url:
            return jsonify({"error": "URL is required"}), 400

        # Scrape webpage
        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        response = requests.get(url, headers=headers, timeout=20)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()

        text = soup.get_text(separator=" ", strip=True)
        text = re.sub(r"\s+", " ", text)

        if len(text) < 50:
            return jsonify({"error": "No readable content found"}), 400

        text_for_ai = text[:4000]

        # OpenRouter AI Summary
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": f"Summarize this webpage in 3 concise sentences:\n\n{text_for_ai}"
                }
            ]
        }

        ai_response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )

        result = ai_response.json()

        if "choices" not in result:
            return jsonify({
                "error": f"OpenRouter API error: {result}"
            }), 500

        summary = result["choices"][0]["message"]["content"]

        return jsonify({
            "summary": summary,
            "extracted_text": text[:1500],
            "char_count": len(text)
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)