import { StyleSheet, View } from 'react-native';

import DonutChart from '@/components/Donut';
import EditableNumber from '@/components/EditableNumber';
import MealButton from '@/components/MealButton';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';


export default function HomeScreen() {
  const [kcal, setkcal] = useState(2200);
  const router = useRouter();

  const goToMeal = (mealType: string) => {
    router.push(`/meal/${mealType}`);
  };
  return (
    <><ThemedText style={styles.Text}>Calories Today</ThemedText>
    <View style={styles.container}>
      <View style={styles.column}>
        <ThemedText style={styles.CalCount}>Calories</ThemedText>
        <ThemedText style={styles.CalCount}>out of</ThemedText>
        <EditableNumber 
          value={kcal}
          onChange={setkcal}
        />
      </View>
      <View style={styles.column}>
        <DonutChart 
        ratio={0.7}
        size={150}
        color="#e3f6c3"
        />
      </View>
    </View>
    <View style={styles.container}>
      <View style={styles.column}>
        <ThemedText style={styles.subCatText}>Proteins</ThemedText>
        <DonutChart 
        ratio={0.8}
        size = {110}
        color = "#4ecdc4"
        />
      </View>
      <View style={styles.column}>
        <ThemedText style={styles.subCatText}>Carbs</ThemedText>
        <DonutChart
        ratio={0.8}
        size = {110}
        color = "#45b7d1"
        />
      </View>
      <View style={styles.column}>
        <ThemedText style={styles.subCatText}>Fats</ThemedText>
        <DonutChart 
        ratio={0.8}
        size = {110}
        color = "#ffa07a"
        />
      </View>
    </View>
    <MealButton label="Breakfast" onPress={() => goToMeal('Breakfast')} />
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
