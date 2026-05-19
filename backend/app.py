from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/")
def home():
    return jsonify({
        "message": "Backend Working"
    })

@app.route("/summarize", methods=["POST"])
def summarize():
    return jsonify({
        "summary": "Test successful"
    })

if __name__ == "__main__":
    app.run(debug=True)