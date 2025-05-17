import { StyleSheet, View } from 'react-native';

import DonutChart from '@/components/Donut';
import EditableNumber from '@/components/EditableNumber';
import MealButton from '@/components/MealButton';
import { useNutrition } from '@/components/NutrientContext';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function HomeScreen() {
  const [kcal, setkcal] = useState(2200);
  const { meals, dailyTotals } = useNutrition();

  const handleKcalChange = (newValue: number) => {
  if (newValue !== kcal) { // Only update if value changed
    setkcal(newValue);
  }
};

  const router = useRouter();

  const goToMeal = (mealType: string) => {
    router.push(`/meal/${mealType}`);
  };

  return (
    <><ThemedText style={styles.Text}>Calories Today</ThemedText>
    <View style={styles.container}>
      <View style={styles.column}>
        <ThemedText style={styles.CalCount}>{dailyTotals.calories}</ThemedText>
        <ThemedText style={styles.CalCount}>out of</ThemedText>
        <EditableNumber 
          value={kcal}
          onChange={handleKcalChange}
        />
      </View>
      <View style={styles.column}>
        <DonutChart 
        ratio={dailyTotals.calories / kcal}
        size={150}
        color="#e3f6c3"
        />
      </View>
    </View>
    <View style={styles.container}>
      <View style={styles.column}>
        <ThemedText style={styles.subCatText}>Proteins</ThemedText>
        <DonutChart 
        ratio={dailyTotals.protein*4 / kcal*0.40}
        size = {110}
        color = "#4ecdc4"
        />
      </View>
      <View style={styles.column}>
        <ThemedText style={styles.subCatText}>Carbs</ThemedText>
        <DonutChart
        ratio={dailyTotals.carbs*5 / kcal*0.40}
        size = {110}
        color = "#45b7d1"
        />
      </View>
      <View style={styles.column}>
        <ThemedText style={styles.subCatText}>Fats</ThemedText>
        <DonutChart 
        ratio={dailyTotals.fats*9 / kcal*0.20}
        size = {110}
        color = "#ffa07a"
        />
      </View>
    </View>
    <View style={styles.stepContainer}>
      <MealButton label="Breakfast" onPress={() => goToMeal('Breakfast')} />

    </View>
      <MealButton label="Lunch" onPress={() => goToMeal('Lunch')} />
      <MealButton label="Dinner" onPress={() => goToMeal('Dinner')} />
      <MealButton label="Snacks" onPress={() => goToMeal('Snacks')} />
      <MealButton label="Drinks" onPress={() => goToMeal('Drinks')} />
    
    
    </>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom:4,
  },
  stepContainer: {
    gap: 6,
    marginBottom: 4,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Text: {
    color: "white",
    fontSize: 45,
    fontWeight: 'bold',
    marginTop: 60,
  },
  CalCount: {
    color: "#D3D3D3",
    fontSize: 24,
    textAlign: 'center',
  },
  subCatText: {
    color: "#D3D3D3",
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
});
