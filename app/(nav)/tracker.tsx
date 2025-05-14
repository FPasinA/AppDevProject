import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { View } from 'react-native';

export default function TrackerScreen() {
    
    if (Platform.OS === 'web') {
        return (
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Your Daily Tracker</ThemedText>
            </ThemedView>
        );
    }
    return (
        <><ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.ThemedText}>Tracker</ThemedText>
        </ThemedView>
        <View style={styles.container}>
                <View style={styles.column}>
                    <ThemedText style={styles.ThemedText}>Column 1</ThemedText>
                </View>
                <View style={styles.column}>
                    <ThemedText style={styles.ThemedText}>Column 2</ThemedText>
                </View>
            </View></>
    );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    marginTop: 75,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
    titlename: {
        fontSize: 45,
        fontWeight: 'bold',
        color: '#D3D3D3',
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
  ThemedText: {
    color: "#D3D3D3",
  }
});