// contexts/NutritionContext.js
import React, { createContext, useContext, useState } from 'react';

const NutritionContext = createContext();

export const NutritionProvider = ({ children }) => {
  // Initialize with proper structure
  const [meals, setMeals] = useState({
    breakfast: { foods: [], totals: { calories: 0, protein: 0, carbs: 0, fats: 0 } },
    lunch: { foods: [], totals: { calories: 0, protein: 0, carbs: 0, fats: 0 } },
    dinner: { foods: [], totals: { calories: 0, protein: 0, carbs: 0, fats: 0 } }
  });

  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  const addMeal = (mealType, mealData) => {
    // Add validation
    if (!mealData || !mealData.totals) {
      return;
    }

    setMeals(prev => ({
      ...prev,
      [mealType]: {
        foods: mealData.foods || [],
        totals: mealData.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 }
      }
    }));

    setDailyTotals(prev => ({
      calories: prev.calories + (mealData.totals?.calories || 0),
      protein: prev.protein + (mealData.totals?.protein || 0),
      carbs: prev.carbs + (mealData.totals?.carbs || 0),
      fats: prev.fats + (mealData.totals?.fats || 0)
    }));
  };

  return (
    <NutritionContext.Provider value={{ meals, dailyTotals, addMeal }}>
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};