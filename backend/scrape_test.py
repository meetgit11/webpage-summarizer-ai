import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

#print(OPENROUTER_API_KEY)

url = "https://en.wikipedia.org/wiki/Artificial_intelligence"

headers = {
    "Users-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)

soup = BeautifulSoup(response.text, "html.parser")

paragraphs = soup.find_all("p")

content =""

for p in paragraphs:
    content += p.get_text()

webpage_text = content[:3000]

print("Webpage text extracted successfully!")
print()

prompt = f"""
Summarize the following webpage content in simple language:

{webpage_text}
"""

response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    },
    json={
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

)

result =response.json()

#print(result)

summary = result["choices"][0]["message"]["content"]

print("AI SUMMARY:")
print()
print(summary)