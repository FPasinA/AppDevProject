import { Tabs } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Drawer } from 'expo-router/drawer';

const NumberContext = createContext({storedNumber: 2200, setStoredNumber: (num: number) => {}});
export function useNumber() {
  const context = useContext(NumberContext);
  if (!context) {
    throw new Error('useNumber must be used within a NumberProvider');
  }
  return context;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [storedNumber, setStoredNumber] = useState(2200) // default number
const contextProvider = (
    <NumberContext.Provider value={{ storedNumber, setStoredNumber }}>
      {Platform.OS === 'web' ? (
        <Drawer>
          <Drawer.Screen name="index" options={{ title: 'Home' }} />
          <Drawer.Screen name="tracker" options={{ title: 'Tracker' }} />
          <Drawer.Screen name="foodsuggest" options={{ title: 'Food Suggestion' }} />
          <Drawer.Screen name="explore" options={{ title: 'Explore' }} />
        </Drawer>
      ) : (
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
              ios: { position: 'absolute' },
              default: {},
            }),
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="tracker"
            options={{
              title: 'Tracker',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="pencil.and.list.clipboard" color={color} />,
            }}
          />
          <Tabs.Screen
            name="foodsuggest"
            options={{
              title: 'Food Suggestion',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="fork.knife.circle" color={color} />,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
            }}
          />
        </Tabs>
      )}
    </NumberContext.Provider>
  );

  return contextProvider;
}