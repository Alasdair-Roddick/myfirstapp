import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { ref, push, set } from 'firebase/database';
import { auth, database } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../colors';

const WorkoutSessionScreen = ({ navigation, route }) => {
  const { routineName, exercises } = route.params;
  const [workoutData, setWorkoutData] = useState(exercises);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  const updateSet = (exerciseId, setIndex, field, value) => {
    setWorkoutData(prev =>
      prev.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set, i) => (i === setIndex ? { ...set, [field]: value } : set))
            }
          : ex
      )
    );
  };

  const addSet = (exerciseId) => {
    setWorkoutData(prev =>
      prev.map(ex =>
        ex.id === exerciseId ? { ...ex, sets: [...ex.sets, { reps: '', weight: '' }] } : ex
      )
    );
  };

  const discardWorkout = () => {
    Alert.alert('Discard Workout', 'Are you sure you want to discard this workout?', [
      { text: 'Cancel', style: 'cancel' },

      { text: 'Discard', onPress: () => navigation.goBack(), style: 'destructive' }
    ]);
  };

  const endWorkout = async () => {
    const user = auth.currentUser;
    if (!user) return;
  
    try {
        // Save completed workout to pastWorkouts
        const pastWorkoutsRef = ref(database, `users/${user.uid}/pastWorkouts`);
        await push(pastWorkoutsRef, { routineName, exercises: workoutData, timestamp: Date.now() });

        // Correctly update the routine without overwriting it
        const routineRef = ref(database, `users/${user.uid}/routines/${routineName}/exercises`);
        await set(routineRef, workoutData); // Update only the exercises field
  
        navigation.navigate('App', { screen: 'RoutineScreen' });
    } catch (error) {
        console.error('Error updating workout:', error);
        Alert.alert('Error', 'Could not save workout. Please try again.');
    }
};

  

  const nextSet = () => {
    const currentExercise = workoutData[currentExerciseIndex];

    if (currentSetIndex < currentExercise.sets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
    } else if (currentExerciseIndex < workoutData.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
    } else {
      endWorkout();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Menu */}
      <View style={styles.topMenu}>
        <TouchableOpacity onPress={discardWorkout}>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Workout Cards - All exercises visible */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {workoutData.map((exercise, exerciseIndex) => (
          <View key={exercise.id} style={styles.exerciseContainer}>
            <Text
              style={[
                styles.exerciseTitle,
                exerciseIndex === currentExerciseIndex && styles.activeExercise
              ]}
            >
              {exercise.name}
            </Text>

            {exercise.sets.map((set, setIndex) => (
              <View
                key={setIndex}
                style={[
                  styles.setContainer,
                  exerciseIndex === currentExerciseIndex && setIndex === currentSetIndex && styles.activeSet
                ]}
              >
                <Text style={styles.setLabel}>Set {setIndex + 1}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Reps"
                  placeholderTextColor="#fff"
                  value={set.reps}
                  onChangeText={value => updateSet(exercise.id, setIndex, 'reps', value)}
                />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Weight (kg)"
                  placeholderTextColor="#fff"
                  value={set.weight}
                  onChangeText={value => updateSet(exercise.id, setIndex, 'weight', value)}
                />

                {/* Play / Stop Button for Set */}
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => {
                    setCurrentExerciseIndex(exerciseIndex);
                    setCurrentSetIndex(setIndex);
                  }}
                >
                  <Ionicons
                    name={exerciseIndex === currentExerciseIndex && setIndex === currentSetIndex ? "pause-circle" : "play-circle"}
                    size={28}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Set Button */}
            <TouchableOpacity style={styles.addSetButton} onPress={() => addSet(exercise.id)}>
              <Text style={styles.addSetText}>+ Add Set</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Button - Next Set */}
      <TouchableOpacity style={styles.controlButton} onPress={nextSet}>
        <Text style={styles.controlButtonText}>
          {currentExerciseIndex === workoutData.length - 1 && currentSetIndex === workoutData[currentExerciseIndex].sets.length - 1
            ? 'Finish Workout'
            : 'Next Set'}
        </Text>
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
  
    // Top Menu - Clean & simple
    topMenu: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 10,
    },
  
    // Scroll Area - More breathing room
    scrollContainer: {
      alignItems: 'center',
      paddingBottom: 80,
    },
  
    // 🔥 Exercise Card - Modernized
    exerciseContainer: {
      backgroundColor: colors.cardBackground,
      width: '100%',
      borderRadius: 20,
      padding: 18,
      marginBottom: 20,
      shadowColor: colors.shadowColor,
      shadowOpacity: 0.25,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    },
  
    // Exercise Titles - Bigger & Stronger
    exerciseTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 15,
    },
  
    activeExercise: {
      color: colors.highlight,
    },
  
    // Set Container - Smoothed Out
    setContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      padding: 14,
      borderRadius: 14,
      marginVertical: 6,
      justifyContent: 'space-between',
      shadowColor: colors.shadowColor,
      shadowOpacity: 0.18,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
  
    activeSet: {
      borderWidth: 2,
      borderColor: colors.highlight,
      backgroundColor: colors.white,
    },
  
    setLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
  
    // ✏️ Text Input - Modern, Minimal
    input: {
      backgroundColor: colors.white,
      color: colors.textPrimary,
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 12,
      textAlign: 'center',
      flex: 1,
      fontSize: 16,
      marginHorizontal: 6,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
  
    // 🎬 Play Button - Feels Tactile
    playButton: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadowColor,
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
  
    // ➕ Add Set Button - Looks Clickable!
    addSetButton: {
      backgroundColor: colors.secondary,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 12,
      shadowColor: colors.shadowColor,
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
  
    addSetText: {
      color: colors.white,
      fontWeight: 'bold',
      fontSize: 16,
    },
  
    // 🎯 Bottom Control Button - BIG & INVITING
    controlButton: {
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 14,
      alignItems: 'center',
      marginTop: 30,
      shadowColor: colors.shadowColor,
      shadowOpacity: 0.25,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    },
  
    controlButtonText: {
      color: colors.white,
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
  

export default WorkoutSessionScreen;
