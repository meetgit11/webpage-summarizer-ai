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

        # Fetch webpage
        webpage = requests.get(url)

        soup = BeautifulSoup(webpage.text, "html.parser")

        paragraphs = soup.find_all("p")

        text = " ".join([p.get_text() for p in paragraphs])

        text = text[:3000]

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "deepseek/deepseek-chat",
            "messages": [
                {
                    "role": "user",
                    "content": f"Summarize this webpage:\n\n{text}"
                }
            ]
        }

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload
        )

        result = response.json()

        print(result)

        if "choices" not in result:
            return jsonify({
                "error": result
            }), 500

        summary = result["choices"][0]["message"]["content"]

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)