import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function TrackerScreen() {
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiStatus, setBmiStatus] = useState('');
  const today = new Date();

  useEffect(() => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      dates.push(d);
    }
    setWeekDates(dates);
  }, []);

  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;

    if (w > 0 && h > 0) {
      const calculatedBmi = w / (h * h);
      setBmi(calculatedBmi);

      if (calculatedBmi < 18.5) setBmiStatus('Underweight');
      else if (calculatedBmi < 25) setBmiStatus('Healthy');
      else if (calculatedBmi < 30) setBmiStatus('Overweight');
      else setBmiStatus('Obese');
    } else {
      setBmi(null);
      setBmiStatus('');
    }
  }, [weight, height]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>Tracker</Text>

        {/* Day Selector */}
        <View style={styles.daySelector}>
          {weekDates.map((date, idx) => {
            const isToday =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear();

            return (
              <View key={idx} style={styles.dayItem}>
                <Text style={styles.dayLabel}>{format(date, 'EEE')}</Text>
                <View style={[styles.dayCircle, isToday && styles.dayCircleActive]}>
                  <Text style={[styles.dayText, isToday && styles.dayTextActive]}>
                    {date.getDate()}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Calorie Tracker */}
        <View style={styles.circleContainer}>
          <AnimatedCircularProgress
            size={240}
            width={18}
            fill={70}
            tintColor="#4CAF50"
            backgroundColor="#2e2e2e"
            rotation={0}
          >
            {() => (
              <View style={styles.calorieTextContainer}>
                <Text style={styles.calorieText}>1684</Text>
                <Text style={styles.calorieSubText}>kcal eaten</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>

        {/* Weight & Height Inputs Side by Side */}
        <View style={styles.inputsRow}>
          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>Weight</Text>
            <TextInput
              style={styles.input}
              placeholder="kg"
              placeholderTextColor="#555"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>
          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>Height</Text>
            <TextInput
              style={styles.input}
              placeholder="cm"
              placeholderTextColor="#555"
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
          </View>
        </View>

        {/* BMI Display */}
        <View style={styles.bmiContainer}>
          <Text style={styles.bmiLabel}>Your BMI Value:</Text>
          <Text style={styles.bmiValue}>
            {bmi ? bmi.toFixed(1) : '--'}
          </Text>
          <Text style={styles.bmiStatus}>{"You are " + bmiStatus}</Text>
        </View>

        
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  innerContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  dayItem: {
    alignItems: 'center',
  },
  dayLabel: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
  },
  dayCircle: {
    backgroundColor: '#555',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: {
    backgroundColor: '#4CAF50',
  },
  dayText: {
    color: '#eee',
  },
  dayTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  circleContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  calorieTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  calorieSubText: {
    fontSize: 16,
    color: '#ccc',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  inputBlock: {
    flex: 1,
    alignItems: 'center',
  },
  inputLabel: {
    color: '#fff',
    marginBottom: 4,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#ccc',
    width: '90%',
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 6,
    color: '#000',
  },
  bmiContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  bmiLabel: {
    color: '#fff',
    fontSize: 20,
  },
  bmiValue: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  bmiStatus: {
    color: '#fff',
    fontSize: 20,
  },
});