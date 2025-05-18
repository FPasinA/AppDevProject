#fiirebase
import firebase_admin
from firebase_admin import credentials, db

from google.colab import files
uploaded = files.upload()
service_account_key = list(uploaded.keys())[0]
cred = credentials.Certificate(service_account_key)

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://nutrimate-database-default-rtdb.asia-southeast1.firebasedatabase.app/'
})
ref = db.reference('/Nutrimate-Database')

#fetching
import requests
import time
import re

def parse_grams(serving_str):
    """
    Extracts the number of grams from a serving size string like '30g', '1 cup (240g)', etc.
    Returns float grams or None.
    """
    if not serving_str:
        return None
    match = re.search(r"([\d.]+)\s*(g|grams)", serving_str.lower())
    if match:
        return float(match.group(1))
    return None

def fetch_nutrition_per_serving(rate_limit_seconds=6, max_retries=3, page_size=100):
    all_data = []
    base_url = "https://world.openfoodfacts.org/api/v2/search"
    headers = {
        "User-Agent": "NutritionFetcherBot - you@example.com"
    }

    current_page = 1

    while True:
        print(f"Fetching page {current_page}...")
        params = {
            "page": current_page,
            "page_size": page_size,
            "fields": "product_name,brands,nutriments,serving_size",
            "sort_by": "unique_scans_n"
        }

        retries = 0
        success = False

        while retries < max_retries:
            try:
                response = requests.get(base_url, headers=headers, params=params)
                if response.status_code == 200:
                    success = True
                    break
                else:
                    print(f"Non-200 response: {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"Request error: {e}")
            retries += 1
            time.sleep(rate_limit_seconds)

        if not success:
            print("Max retries reached. Stopping.")
            break

        data = response.json()
        products = data.get("products", [])
        if not products:
            print("No more products found.")
            break

        for product in products:
            nutriments = product.get("nutriments", {})
            serving_size_str = product.get("serving_size")
            serving_grams = parse_grams(serving_size_str)

            def calc_per_serving(nutrient_100g):
                if serving_grams and nutrient_100g is not None:
                    return (nutrient_100g * serving_grams) / 100
                return 0

            nutrition = {
                "product_name": product.get("product_name"),
                "brand": product.get("brands"),
                "serving_size": serving_size_str,
                "calories_per_serving": nutriments.get("energy-kcal_serving") or calc_per_serving(nutriments.get("energy-kcal_100g")),
                "fat_per_serving": nutriments.get("fat_serving") or calc_per_serving(nutriments.get("fat_100g")),
                "carbohydrates_per_serving": nutriments.get("carbohydrates_serving") or calc_per_serving(nutriments.get("carbohydrates_100g")),
                "proteins_per_serving": nutriments.get("proteins_serving") or calc_per_serving(nutriments.get("proteins_100g")),
            }

            all_data.append(nutrition)

        print(f"Total collected: {len(all_data)}")
        current_page += 1
        time.sleep(rate_limit_seconds)

    print("\n Done fetching all available nutrition data.")
    return all_data

nutrition_data_per_serving = fetch_nutrition_per_serving()

#uploading to db
def sanitize_key(key):
    return re.sub(r'[.$#[\]/]', '_', key)

for item in nutrition_data_per_serving:
    product_name = item.get("product_name")
    if product_name:
        ref.child(sanitize_key(product_name)).set(item)
        print(f"Data for {product_name} pushed successfully.")
    else:
        print("Product name missing, skipping.")
