import { useEffect, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const EditableNumber = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    const num = parseInt(inputValue) || 0;
    onChange(num);
    setIsEditing(false);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {isEditing ? (
        <>
          <TextInput
            ref={inputRef}
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="numeric"
            style={{ borderWidth: 1, padding: 8, width: 60, color:"D3D3D3", textAlign:"center", borderColor: 'white', borderRadius: 4, backgroundColor: 'white' }} // Green background
          />
          <TouchableOpacity onPress={handleSave}
          style={{
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'white', // Green background
  }}>
            <Text style={{ marginLeft: 8, color:"D3D3D3", textAlign:"center" }}>✓</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity 
  onPress={() => setIsEditing(true)}
  activeOpacity={0.6} // Slightly stronger press effect
  style={{
    padding: 8,
    borderRadius: 4,
  }}
>
  <Text style={{ color: '#D3D3D3', fontSize: 32, textAlign: 'center' }}>
    {value}
  </Text>
</TouchableOpacity>
      )}
    </View>

  );
};        
export default EditableNumber;