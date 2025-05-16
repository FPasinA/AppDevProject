import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCGEOx_7T-YqxyjJDQpqEFUCELkpQPg9Iw",
  authDomain: "nutrimate-database.firebaseapp.com",
  databaseURL: "https://nutrimate-database-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nutrimate-database",
  storageBucket: "nutrimate-database.firebasestorage.app",
  messagingSenderId: "101978859809",
  appId: "1:101978859809:web:b2140c5d59f6eb0fbf7660"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function fetchFoodData(foodName) {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&action=process&json=1`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.products || data.products.length === 0) {
    throw new Error("No products found.");
  }

  const product = data.products[0]; // First match

  // Extract nutrients safely
  const nutrients = product.nutriments || {};

  // Return only the necessary data fields
  return {
    name: product.product_name || foodName,
    calories: nutrients["energy-kcal"] || 0,
    fat: nutrients.fat || 0,
    protein: nutrients.proteins || 0,
    carbohydrates: nutrients.carbohydrates || 0
  };
}

// Fetch all unique foods from OpenFoodFacts
async function fetchAllFoods() {
  const allFoods = [];
  let page = 1;
  let uniqueFoodNames = new Set();

  while (true) {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_simple=1&json=1&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      break; // No more products to fetch
    }

    for (const product of data.products) {
      const foodName = product.product_name;
      if (foodName && !uniqueFoodNames.has(foodName)) {
        uniqueFoodNames.add(foodName);
        allFoods.push(foodName); // Add unique food name to the list
      }
    }

    page++;
  }

  return allFoods; // Return the list of unique food names
}

async function uploadFoodToDatabase(foodName) {
  try {
    const foodData = await fetchFoodData(foodName);

    // Refine the data to ensure only the required fields are pushed
    const refinedFoodData = {
      name: foodData.name,
      fat: foodData.fat,
      calories: foodData.calories,
      carbohydrates: foodData.carbohydrates,
      protein: foodData.protein
    };

    const foodRef = ref(database, 'foods/');
    await push(foodRef, refinedFoodData);

    console.log(`Uploaded ${refinedFoodData.name} successfully to database.`);
  } catch (error) {
    console.error("Error uploading food data:", error.message);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadAllFoods() {
  try {
    const foodList = await fetchAllFoods(); // Get all unique food names from OpenFoodFacts

    for (let i = 0; i < foodList.length; i++) {
      const food = foodList[i];

      console.log(`⏳ (${i + 1}/${foodList.length}) Fetching: ${food}`);
      await uploadFoodToDatabase(food);

      if (i < foodList.length - 1) {
        console.log("⏱ Waiting 6 seconds to respect rate limits...");
        await delay(6000); // 6 seconds = 10 req/min max
      }
    }

    console.log("✅ All food uploads complete.");
  } catch (error) {
    console.error("Error fetching food list:", error.message);
  }
}

uploadAllFoods();
