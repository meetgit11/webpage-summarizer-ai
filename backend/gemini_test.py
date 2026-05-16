import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("models/gemini-2.0-flash-lite")

response = model.generate_content(
    "Explain AI in one simple sentence."
)

print(response.text)