import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Category = 'suggest' | 'favorite';
type FoodItem = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};
type FoodItemsByCategory = {
  suggest: FoodItem[];
  favorite: FoodItem[];
};

const FoodSuggestionPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('suggest');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredItems, setFilteredItems] = useState<FoodItemsByCategory>({suggest: [], favorite: [] });

  // Sample data with more details
  const allFoodItems = {
    suggest: [
      { name: 'Milk', calories: 120, protein: 8, carbs: 12, fats: 5},
      { name: 'Pancake', calories: 250, protein: 6, carbs: 38, fats: 7},
      { name: 'Sandwich', calories: 300, protein: 12, carbs: 45, fats: 8},
      { name: 'Bread', calories: 160, protein: 5, carbs: 30, fats: 2},
      { name: 'Omelet', calories: 180, protein: 12, carbs: 2, fats: 14}
    ],
    favorite: [
      { name: 'Chicken', calories: 165, protein: 31, carbs: 0, fats: 3.6},
      { name: 'Salad', calories: 50, protein: 2, carbs: 8, fats: 0.5},
      { name: 'Sushi', calories: 200, protein: 8, carbs: 35, fats: 3},
      { name: 'Yogurt', calories: 150, protein: 5, carbs: 20, fats: 4}
    ]
  };

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(allFoodItems);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = {
        suggest: allFoodItems.suggest.filter(item => item.name.toLowerCase().includes(query)),
        favorite: allFoodItems.favorite.filter(item => item.name.toLowerCase().includes(query))
      };
      setFilteredItems(filtered);
    }
  }, [searchQuery]);

  const openFoodDetail = (food: React.SetStateAction<FoodItem | null>) => {
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
      {/* Header */}
      <Text style={styles.header}>What to eat?</Text>
      
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
          filteredItems[activeCategory].map((item, index) => (
            <TouchableOpacity 
              key={`${activeCategory}-${index}`} 
              style={styles.item}
              onPress={() => openFoodDetail(item)}
            >
              <View style={styles.itemContent}>
                <Text style={styles.itemText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No foods found</Text>
            <Text style={styles.noResultsSubText}>Try a different search term</Text>
          </View>
        )}
      </ScrollView>
      
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 20,
    textAlign: 'center',
    color: '#D3D3D3',
  },
  searchContainer: {
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
  itemText: {
    fontSize: 20,
    color: '#333',
    flexShrink: 1,
    textAlign: 'center',
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
});

export default FoodSuggestionPage;