import React, { useState } from 'react';
import {
    Button,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempInput, setTempInput] = useState('');
  const [storedNumber, setStoredNumber] = useState(2200); // default number

  const handleConfirm = () => {
    const num = parseFloat(tempInput);
    if (!isNaN(num)) {
      setStoredNumber(num);
      setModalVisible(false);
      setTempInput('');
    } else {
      alert('Please enter a valid number');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stored Number: {storedNumber}</Text>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Click me" onPress={() => alert('Pressed')} />
      </View>

      <Button title="Update Number" onPress={() => setModalVisible(true)} />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Enter a new number:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={tempInput}
              onChangeText={setTempInput}
              placeholder="e.g. 123"
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.btn} onPress={handleConfirm}>
                <Text style={styles.btnText}>Confirm</Text>
              </Pressable>
              <Pressable style={[styles.btn, { backgroundColor: '#ccc' }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 5,
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
  },
});
