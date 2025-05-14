import { StyleSheet, View } from 'react-native';

import EditableNumber from '@/components/EditableNumber';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';


export default function HomeScreen() {
  const [kcal, setkcal] = useState(2200);
  return (
    <><ThemedText style={styles.Text}>Calories Today</ThemedText>
    <View style={styles.container}>
      <View style={styles.column}>
        <ThemedText style={styles.CalCount}>out of</ThemedText>
        <EditableNumber 
          value={kcal}
          onChange={setkcal}
        />
      </View>
      <View style={styles.column}>
        <ThemedText style={styles.CalCount}>Ellipse here</ThemedText>
      </View>
    </View>
    <View style={styles.container}>
      <View style={styles.column}>
        <ThemedText style={styles.subCatText}>Proteins</ThemedText>
      </View>
      <View style={styles.column}>
        <ThemedText style={styles.subCatText}>Carbs</ThemedText>
      </View>
      <View style={styles.column}>
        <ThemedText style={styles.subCatText}>Fats</ThemedText>
      </View>
    </View>
    
    
    </>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  Text: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#D3D3D3',
    marginTop: 60,
  },
  container: {
    flexDirection: 'row',   // 👉 lays out children horizontally
    padding: 16,
  },
  column: {
    flex: 1,                // 👈 takes up 50% of available space
    padding: 8,
    margin: 4,
  },
  CalCount: {
    fontSize: 20,
    color: '#D3D3D3',
    marginLeft: 20,
  },
  subCatText: {
    fontSize: 16,
    color: '#D3D3D3',
    textAlign: "center"
  },
});
