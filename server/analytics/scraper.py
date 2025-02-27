import requests
from bs4 import BeautifulSoup
import pandas as pd

URL = "https://example.com/ingredients"
HEADERS = {"User-Agent": "Mozilla/5.0"}

response = requests.get(URL, headers=HEADERS)
soup = BeautifulSoup(response.text, "html.parser")

# Find ingredient names and prices
ingredients = []
for item in soup.find_all("div", class_="ingredient-item"):
    name = item.find("h2").text
    price = item.find("span", class_="price").text
    ingredients.append({"name": name, "price": price})

# Convert to DataFrame and save to CSV
df = pd.DataFrame(ingredients)
df.to_csv("ingredient_prices.csv", index=False)