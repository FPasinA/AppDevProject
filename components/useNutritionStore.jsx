// stores/useNutritionStore.js
import { create } from 'zustand';

const useNutritionStore = create((set) => ({
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  },
  
  // Actions
  addToMeal: (mealType, food) => set((state) => ({
    meals: {
      ...state.meals,
      [mealType]: [...state.meals[mealType], food]
    }
  })),
  
  removeFromMeal: (mealType, foodId) => set((state) => ({
    meals: {
      ...state.meals,
      [mealType]: state.meals[mealType].filter(item => item.id !== foodId)
    }
  })),
  
  getTotals: (mealType) => {
    const currentMeal = useNutritionStore.getState().meals[mealType] || [];
    return currentMeal.reduce((acc, item) => ({
      calories: acc.calories + (item.calories || 0),
      protein: acc.protein + (item.protein || 0),
      carbs: acc.carbs + (item.carbs || 0),
      fats: acc.fats + (item.fats || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  }
}));

export default useNutritionStore;