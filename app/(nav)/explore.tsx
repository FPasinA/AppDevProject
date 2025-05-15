import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Icon name="person-outline" size={60} color="#999" />
        </View>
      </View>

      <View style={styles.menu}>
        <MenuItem title="Personal Info" />
        <MenuItem title="Settings" />
        <MenuItem title="Logout" />
      </View>

    </View>
  );
}

const MenuItem = ({ title }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Text style={styles.menuText}>{title}</Text>
    <Icon name="chevron-forward" size={20} color="#fff" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 10,
  },
  topSection: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 30,
    color: '#fff',
    alignSelf: 'center',
    marginTop: 40,
    fontWeight: '600',
    marginBottom: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
});
