from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/")
def home():
    return "Backend is working!"

@app.route("/summarize", methods=["POST"])
def summarize():

    data = request.get_json()

    url = data.get("url")

    return jsonify({
        "message": "Summarize route working",
        "url_received": url
    })

if __name__ == "__main__":
    app.run(debug=True)