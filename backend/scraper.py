import requests
from bs4 import BeautifulSoup
from utils.helpers import clean_text


def scrape_website(url):
    headers = {
        "User-Agent": (
            "Mozilla/5.0 "
            "(Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 "
            "(KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        )
    }

    response = requests.get(url, headers=headers, timeout=10)

    if response.status_code != 200:
        raise Exception("Failed to fetch webpage")

    soup = BeautifulSoup(response.text, "html.parser")

    for script in soup(["script", "style"]):
        script.extract()

    text = soup.get_text(separator=" ")

    cleaned_text = clean_text(text)

    return cleaned_text[:5000]