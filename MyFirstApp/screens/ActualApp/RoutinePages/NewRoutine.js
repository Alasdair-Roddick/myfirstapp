import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../colors';
import { ref, get, set } from 'firebase/database';
import { auth, database } from '../../../firebaseConfig';

const WorkoutNameCard = ({ title, category, type, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.workoutNameCard, isSelected && styles.selectedCard]}
    onPress={onPress}
  >
    <Text style={[styles.cardTitle, isSelected && styles.selectedText]}>{title}</Text>
    <Text style={[styles.cardValue, isSelected && styles.selectedText]}>{category} | {type}</Text>
  </TouchableOpacity>
);

const NewRoutine = ({ navigation }) => {
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [routineName, setRoutineName] = useState('');
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const workoutsRef = ref(database, 'exercises');
      const snapshot = await get(workoutsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        let workoutArray = [];

        // Loop through each category (chest, back, legs, etc.)
        Object.keys(data).forEach(category => {
          Object.keys(data[category]).forEach(exerciseId => {
            workoutArray.push({
              id: exerciseId,
              title: data[category][exerciseId].name,
              category: category,
              type: data[category][exerciseId].type
            });
          });
        });

        setWorkouts(workoutArray);
      }
    };

    fetchWorkouts();
  }, []);

  const toggleWorkoutSelection = (id) => {
    setSelectedWorkouts(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(workoutId => workoutId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSaveRoutine = async () => {
    if (!routineName) {
      alert("Please enter a routine name");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("User not found. Please log in again.");
      return;
    }

    const selectedRoutine = workouts.filter(workout => selectedWorkouts.includes(workout.id));
    const routineRef = ref(database, `users/${user.uid}/routines/${routineName}`);

    await set(routineRef, selectedRoutine);

    navigation.navigate('RoutineSetup', { routineName, exercises: selectedRoutine });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>New Routine</Text>
      <TextInput
        style={styles.RoutineName}
        placeholder="Routine Name"
        value={routineName}
        onChangeText={setRoutineName}
      />

      <ScrollView style={styles.scrollContainer}>
        {workouts.map(workout => (
          <WorkoutNameCard
            key={workout.id}
            title={workout.title}
            category={workout.category}
            type={workout.type}
            isSelected={selectedWorkouts.includes(workout.id)}
            onPress={() => toggleWorkoutSelection(workout.id)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleSaveRoutine}>
        <Text style={styles.buttonText}>Save Routine</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingTop: 20,
  },
  scrollContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: '90%',
    marginTop: 20,
  },
  workoutNameCard: {
    width: '100%',
    padding: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: colors.white || '#fff',
  },
  selectedCard: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
  selectedText: {
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  RoutineName: {
    width: '90%',
    padding: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default NewRoutine;
