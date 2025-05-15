import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function MealDetail() {
  const { mealType } = useLocalSearchParams();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('recent');
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredItems, setFilteredItems] = useState({ recent: [], suggest: [], favorite: [] });
  const [currentMeal, setCurrentMeal] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      title: `${mealType}`,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 28,
        fontWeight: 'bold',
      },
    });
  }, [mealType]);

  const allFoodItems = {
    recent: [
      { id: 1, name: 'Sandwich', calories: 300, protein: 12, carbs: 45, fats: 8},
      { id: 2, name: 'Bread', calories: 160, protein: 5, carbs: 30, fats: 2},
      { id: 3, name: 'Sushi', calories: 200, protein: 8, carbs: 35, fats: 3}
    ],
    suggest: [
      { id: 4, name: 'Milk', calories: 120, protein: 8, carbs: 12, fats: 5},
      { id: 5, name: 'Pancake', calories: 250, protein: 6, carbs: 38, fats: 7},
      { id: 6, name: 'Omelet', calories: 180, protein: 12, carbs: 2, fats: 14}
    ],
    favorite: [
      { id: 7, name: 'Chicken', calories: 165, protein: 31, carbs: 0, fats: 3.6},
      { id: 8, name: 'Salad', calories: 50, protein: 2, carbs: 8, fats: 0.5},
      { id: 9, name: 'Yogurt', calories: 150, protein: 5, carbs: 20, fats: 4}
    ]
  };

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(allFoodItems);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = {
        recent: allFoodItems.recent.filter(item => item.name.toLowerCase().includes(query)),
        suggest: allFoodItems.suggest.filter(item => item.name.toLowerCase().includes(query)),
        favorite: allFoodItems.favorite.filter(item => item.name.toLowerCase().includes(query))
      };
      setFilteredItems(filtered);
    }
  }, [searchQuery]);

  const openFoodDetail = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  const closeFoodDetail = () => {
    setModalVisible(false);
  };

  // Calculate totals
  const calculateTotals = () => {
    return currentMeal.reduce((totals, item) => {
      return {
        calories: totals.calories + item.calories,
        protein: totals.protein + item.protein,
        carbs: totals.carbs + item.carbs,
        fats: totals.fats + item.fats
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const totals = calculateTotals();

  const addFoodToMeal = (food) => {
    setCurrentMeal([...currentMeal, food]);
    setModalVisible(false);
    
    Alert.alert(
      'Added to Meal',
      `${food.name} (${food.calories} kcal) added to your meal`,
      [{ text: 'OK' }]
    );
  };

  const saveMeal = () => {
    if (currentMeal.length === 0) {
      Alert.alert('Empty Meal', 'Please add some foods to your meal before saving');
      return;
    }
    
    // Here you would typically save to AsyncStorage or your state management
    Alert.alert(
      'Meal Saved',
      `Your meal with ${currentMeal.length} items (${totals.calories} kcal) has been saved`,
      [{ text: 'OK' }]
    );
    
    // Reset the current meal
    setCurrentMeal([]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      
      {/* Search Bar */}
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
      
      {/* Category Buttons */}
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
      
      {/* Food Items List */}
      <ScrollView style={styles.itemsContainer}>
        {filteredItems[activeCategory].length > 0 ? (
          filteredItems[activeCategory].map((item) => (
            <TouchableOpacity 
              key={`${activeCategory}-${item.id}`} 
              style={styles.item}
              onPress={() => {
                setSelectedFood(item);
                setModalVisible(true);
              }}
            >
              <View style={styles.itemContent}>
                <View>
                  <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodDetails}>
              {item.calories} kcal | P: {item.protein}g | C: {item.carbs}g | F: {item.fats}g
            </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => addFoodToMeal(item)}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No foods found</Text>
            <Text style={styles.noResultsSubText}>Try a different search term</Text>
          </View>
        )}
      </ScrollView>

      {/* Current Meal Summary */}
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
      
      {/* Fixed Bottom Block - Calories and Save */}
      <View style={styles.bottomBlock}>
        <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesLabel}>Total Calories:</Text>
          <Text style={styles.caloriesLabel}>  {totals.calories} kcal</Text>
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
      
      {/* Food Detail Modal */}
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
                    <Text style={styles.nutritionValue}>{selectedFood.carbs}g</Text>
                  </View>
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Fats:</Text>
                    <Text style={styles.nutritionValue}>{selectedFood.fats}g</Text>
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
                      addFoodToMeal(selectedFood);
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
    paddingHorizontal: 16,
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
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 45,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#ccc',
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
  },
  activeCategory: {
    backgroundColor: '#4CAF50',
  },
  categoryButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 15,
  },
  activeCategoryText: {
    color: 'white',
  },
  itemsContainer: {
    flex: 1,
    marginBottom: 80,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  foodImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginBottom: 5,
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#999',
  },
  bottomBlock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonLarge: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    height: 45,
    justifyContent: 'center',
  },
  addButtonLargeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'black',
    borderRadius: 15,
    padding: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#D3D3D3',
  },
  nutritionInfo: {
    marginVertical: 15,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#D3D3D3',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D3D3D3',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  closeButton: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  addButtonModal: {
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  addButtonModalText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    height: 45,
    justifyContent: 'center',
    flex: 1,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    paddingHorizontal: 8,
    marginLeft: 8,
  },
});
