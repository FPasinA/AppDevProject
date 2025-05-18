import { useNutrition } from '@/components/NutrientContext';
import { database } from '@/database';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MealType = () => {
  const { mealType } = useLocalSearchParams();
  const navigation = useNavigation();
  const [foodList, setFoodList] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('recent');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMeal, setCurrentMeal] = useState([]);
  const { addMeal } = useNutrition();

  useEffect(() => {
    navigation.setOptions({
      title: `${mealType}`,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4CAF50',
      },
      headerStyle: {
        backgroundColor: '#000',
      },
    });
  }, [mealType]);

  useEffect(() => {
    const foodRef = ref(database, 'foods');
    onValue(foodRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const foodArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setFoodList(foodArray);
      }
    });
  }, []);

  const toggleSelectItem = (item) => {
    setCurrentMeal(prev => [...prev, item]);
    Alert.alert(
      'Added to Meal',
      `${item.name} (${item.calories} kcal) added to your meal`,
      [{ text: 'OK' }]
    );
  };

  const calculateTotals = () => {
    return currentMeal.reduce((totals, item) => {
      return {
        calories: totals.calories + item.calories,
        protein: totals.protein + item.protein,
        carbs: totals.carbs + item.carbohydrates,
        fats: totals.fats + item.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const totals = calculateTotals();

  const saveMeal = () => {
    if (currentMeal.length === 0) {
      Alert.alert('Empty Meal', 'Please add some foods to your meal before saving');
      return;
    }

    addMeal(mealType, {
      foods: [...currentMeal],
      totals: {
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fats: totals.fats
      }
    });

    Alert.alert(
      'Meal Saved',
      `Your meal with ${currentMeal.length} items (${totals.calories} kcal) has been saved`,
      [{ text: 'OK' }]
    );

    setCurrentMeal([]);
  };

  const openFoodDetail = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  const closeFoodDetail = () => {
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search foods..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.categoryButtons}>
        <TouchableOpacity 
          style={[styles.categoryButton, activeCategory === 'recent' && styles.activeCategory]}
          onPress={() => setActiveCategory('recent')}
        >
          <Text style={[styles.categoryButtonText, activeCategory === 'recent' && styles.activeCategoryText]}>Recent</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.categoryButton, activeCategory === 'suggest' && styles.activeCategory]}
          onPress={() => setActiveCategory('suggest')}
        >
          <Text style={[styles.categoryButtonText, activeCategory === 'suggest' && styles.activeCategoryText]}>Suggest</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.categoryButton, activeCategory === 'favorite' && styles.activeCategory]}
          onPress={() => setActiveCategory('favorite')}
        >
          <Text style={[styles.categoryButtonText, activeCategory === 'favorite' && styles.activeCategoryText]}>Favorite</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Select Foods</Text>
      <FlatList
        data={foodList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.foodItem}
            onPress={() => toggleSelectItem(item)}
            onLongPress={() => openFoodDetail(item)}
          >
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodDetails}>{item.calories} kcal</Text>
          </TouchableOpacity>
        )}
      />

      {currentMeal.length > 0 && (
        <View style={styles.currentMealContainer}>
          <Text style={styles.currentMealTitle}>Current Meal:</Text>
          {currentMeal.map((item, index) => (
            <View key={index} style={styles.currentMealItem}>
              <Text style={styles.currentMealText}>
                {item.name} - {item.calories} kcal
              </Text>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => {
                  setCurrentMeal(currentMeal.filter((_, i) => i !== index));
                }}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
      {currentMeal.length > 0 && (
        <View style={styles.bottomBlock}>
          <View style={styles.caloriesContainer}>
            <Text style={styles.caloriesLabel}>Total Calories: {totals.calories} kcal</Text>
            <Text style={styles.caloriesLabel}>Protein: {totals.protein}g</Text>
            <Text style={styles.caloriesLabel}>Carbs: {totals.carbs}g</Text>
            <Text style={styles.caloriesLabel}>Fats: {totals.fats}g</Text>
          </View>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveMeal}
          >
            <Text style={styles.saveButtonText}>SAVE MEAL</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeFoodDetail}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedFood && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedFood.name}</Text>
                </View>
                
                <View style={styles.nutritionInfo}>
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Calories:</Text>
                    <Text style={styles.nutritionValue}>{selectedFood.calories} kcal</Text>
                  </View>
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Protein:</Text>
                    <Text style={styles.nutritionValue}>{selectedFood.protein}g</Text>
                  </View>
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Carbs:</Text>
                    <Text style={styles.nutritionValue}>{selectedFood.carbohydrates}g</Text>
                  </View>
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Fats:</Text>
                    <Text style={styles.nutritionValue}>{selectedFood.fat}g</Text>
                  </View>
                </View>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={closeFoodDetail}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.addButtonModal}
                    onPress={() => {
                      toggleSelectItem(selectedFood);
                      closeFoodDetail();
                    }}
                  >
                    <Text style={styles.addButtonModalText}>Add to Meal</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000', // Black background
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#fff', // White text
  },
  foodItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Darker border
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#1a1a1a', // Dark gray background
  },
  selectedItem: {
    backgroundColor: '#2a2a2a', // Slightly lighter gray for selected
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50', // Green accent
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // White text
  },
  foodDetails: {
    fontSize: 14,
    color: '#bbb', // Light gray text
  },
  detailsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#1a1a1a', // Dark gray background
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // White text
  },
  detailsItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Darker border
    paddingBottom: 8,
  },
  detailText: {
    color: '#bbb', // Light gray text
  },
  addSelectedButton: {
    backgroundColor: '#4CAF50', // Green button
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addSelectedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50', // Green button
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginTop: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderColor: '#333', // Darker border
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 45,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a', // Dark gray background
    fontSize: 16,
    color: '#fff', // White text
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#333', // Dark gray
    width: 25,
    height: 25,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  categoryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1a1a1a', // Dark gray background
  },
  activeCategory: {
    backgroundColor: '#4CAF50', // Green active button
  },
  categoryButtonText: {
    color: '#bbb', // Light gray text
    fontWeight: '600',
    fontSize: 15,
  },
  activeCategoryText: {
    color: 'white',
  },
  currentMealContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#1a1a1a', // Dark gray background
    borderRadius: 8,
  },
  currentMealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // White text
  },
  currentMealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Darker border
  },
  currentMealText: {
    fontSize: 16,
    color: '#fff', // White text
  },
  removeButton: {
    backgroundColor: '#ff4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBlock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000', // Black background
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333', // Darker border
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriesContainer: {
    flex: 1,
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#fff', // White text
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)', // Darker overlay
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1a1a1a', // Dark gray background
    borderRadius: 15,
    padding: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff', // White text
  },
  nutritionInfo: {
    marginVertical: 15,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Darker border
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#fff', // White text
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50', // Green text for values
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  closeButton: {
    padding: 12,
    backgroundColor: '#333', // Dark gray
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff', // White text
    fontWeight: '600',
    fontSize: 16,
  },
  addButtonModal: {
    padding: 12,
    backgroundColor: '#4CAF50', // Green button
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  addButtonModalText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default MealType;