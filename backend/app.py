from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper import scrape_website
from summarizer import generate_summary

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/summarize", methods=["POST"])
def summarize():

    try:
        data = request.get_json()

        if not data or "url" not in data:
            return jsonify({
                "error": "URL is required"
            }), 400

        url = data["url"]

        scraped_text = scrape_website(url)

        if not scraped_text:
            return jsonify({
                "error": "Could not scrape webpage"
            }), 400

        summary = generate_summary(scraped_text)

        return jsonify({
            "summary": summary
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)