import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, set } from 'firebase/database';
import { auth, database } from '../../../firebaseConfig';
import colors from '../../../colors';

// Component for each exercise card
const ExerciseCard = ({ exercise, sets, setSets }) => {
  const addSet = () => {
    setSets(prevSets => ({
      ...prevSets,
      [exercise.id]: [...(prevSets[exercise.id] || []), { reps: '', weight: '' }]
    }));
  };

  const updateSet = (exerciseId, index, field, value) => {
    setSets(prevSets => ({
      ...prevSets,
      [exerciseId]: prevSets[exerciseId].map((set, i) => 
        i === index ? { ...set, [field]: value } : set
      )
    }));
  };

  const removeSet = (exerciseId, index) => {
    setSets(prevSets => ({
      ...prevSets,
      [exerciseId]: prevSets[exerciseId].filter((_, i) => i !== index)
    }));
  };

  return (
    <View style={styles.exerciseCard}>
      <Text style={styles.exerciseTitle}>{exercise.title}</Text>

      {sets[exercise.id]?.map((set, index) => (
        <View key={index} style={styles.setContainer}>
         <View style={[styles.inputContainer, { flex: 0.7 }]}>
            <Text style={styles.inputLabel}>Reps</Text>
            <TextInput
                style={styles.input}
                placeholder="Reps"
                placeholderTextColor="#fff" // Explicitly setting white placeholder text
                keyboardType="numeric"
                value={set.reps}
                onChangeText={(value) => updateSet(exercise.id, index, 'reps', value)}
            />

          </View>

          <View style={[styles.inputContainer, { flex: 1.3 }]}>
            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                placeholderTextColor="#fff" // Explicitly setting white placeholder text
                keyboardType="numeric"
                value={set.weight}
                onChangeText={(value) => updateSet(exercise.id, index, 'weight', value)}
            />
          </View>

          <TouchableOpacity onPress={() => removeSet(exercise.id, index)} style={styles.removeButton}>
                <Text style={styles.removeSet}>✖</Text>
            </TouchableOpacity>

        </View>
      ))}

      <TouchableOpacity style={styles.addSetButton} onPress={addSet}>
        <Text style={styles.addSetButtonText}>+ Add Set</Text>
      </TouchableOpacity>
    </View>
  );
};

const RoutineSetupScreen = ({ route, navigation }) => {
  const { routineName, exercises } = route.params;
  const [sets, setSets] = useState({});

  const handleSaveRoutine = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("User not found. Please log in again.");
      return;
    }
  
    const routineData = exercises.map(exercise => ({
      id: exercise.id,
      name: exercise.title,
      category: exercise.category,
      type: exercise.type,
      sets: sets[exercise.id] || [] // Ensure sets array
    }));
  
    await set(ref(database, `users/${user.uid}/routines/${routineName}`), routineData);
  
    navigation.navigate('App', { screen: 'Routines' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{routineName}</Text>

        {exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            sets={sets}
            setSets={setSets}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveRoutine}>
        <Text style={styles.saveButtonText}>Save Routine</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 20,
    },
    exerciseCard: {
      backgroundColor: colors.secondary,
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
    },
    exerciseTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 10,
    },
    setContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    inputContainer: {
      flex: 1,
      marginRight: 5,
    },
    inputLabel: {
      fontSize: 14,
      color: '#fff',
      marginBottom: 5,
    },
    input: {
      backgroundColor: colors.TextInputDarkBackground,
      padding: 10,
      borderRadius: 5,
      textAlign: 'center',
      color: '#fff', // Text inside input should be white
      fontFamily: colors.fonts.secondary,
    },
    removeButton: {
      marginTop: 20,
      padding: 8,
      borderRadius: 5,
      backgroundColor: 'rgba(255,255,255,0.2)', // Slight contrast for visibility
      alignItems: 'center',
      justifyContent: 'center',
    },
    removeSet: {
      color: '#fff', // Ensures ✖ is white
      fontSize: 18,
      fontWeight: 'bold',
    },
    addSetButton: {
      marginTop: 10,
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 5,
      alignItems: 'center',
    },
    addSetButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    saveButton: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  

export default RoutineSetupScreen;
