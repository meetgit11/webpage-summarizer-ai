import requests
from bs4 import BeautifulSoup


def scrape_website(url):
    try:
        response = requests.get(url)

        soup = BeautifulSoup(response.text, "html.parser")

        paragraphs = soup.find_all("p")

        text = ""

        for p in paragraphs:
            text += p.get_text()

        return text[:5000]

    except Exception as e:
        return f"Error scraping website: {str(e)}"