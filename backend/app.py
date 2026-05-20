from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


@app.route("/")
def home():
    return "Backend is working!"


@app.route("/summarize", methods=["POST"])
def summarize():

    try:
        data = request.get_json()

        url = data.get("url")

        if not url:
            return jsonify({
                "error": "URL is required"
            }), 400

        # Fetch webpage content
        webpage = requests.get(url)

        soup = BeautifulSoup(webpage.text, "html.parser")

        paragraphs = soup.find_all("p")

        text = " ".join([p.get_text() for p in paragraphs])

        text = text[:3000]

        # Temporary stable summary
        summary = f"""
Webpage fetched successfully.

URL:
{url}

Extracted Content Preview:
{text[:500]}

AI summary feature will be connected properly in next phase.
"""

        return jsonify({
            "summary": summary
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)