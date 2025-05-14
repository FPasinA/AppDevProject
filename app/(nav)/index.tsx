import { Button, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useNumber } from './_layout';
import { useState } from 'react';


export default function HomeScreen() {
  const { storedNumber, setStoredNumber } = useNumber();
  return (
    <><ThemedText style={styles.Text}>Calories Today</ThemedText>
    <View style={styles.container}>
      <View style={styles.column}>
        <ThemedText style={styles.Text}>out of {storedNumber}</ThemedText>
        <Button title="Set kcal" onPress={() => } />
      </View>
      <View style={styles.column}>
        <ThemedText style={styles.Text}>Column 2</ThemedText>
      </View>
    </View></>
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
});
