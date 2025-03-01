import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, get, set, remove } from 'firebase/database';
import { auth, database } from '../../../firebaseConfig';
import colors from '../../../colors';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Ionicons } from '@expo/vector-icons';

// Exercise Card Component
const ExerciseCard = ({ exercise, expanded, toggleExpand, updateSets, removeSet, addSet }) => {
    return (
      <View style={styles.exerciseCard}>
        <TouchableOpacity onPress={toggleExpand} style={styles.cardHeader}>
          <Text style={styles.exerciseTitle}>{exercise.name}</Text>
        </TouchableOpacity>
  
        {expanded && (
          <View style={styles.expandedContent}>
            {(exercise.sets || []).map((set, index) => (
              <View key={index} style={styles.setContainer}>
                <View style={[styles.inputContainer, { flex: 0.7 }]}>
                  <Text style={styles.inputLabel}>Reps</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={set.reps}
                    onChangeText={(value) => updateSets(exercise.id, index, 'reps', value)}
                    placeholder="Reps"
                    placeholderTextColor="#fff"
                  />
                </View>
  
                <View style={[styles.inputContainer, { flex: 1.3 }]}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={set.weight}
                    onChangeText={(value) => updateSets(exercise.id, index, 'weight', value)}
                    placeholder="Weight (kg)"
                    placeholderTextColor="#fff"
                  />
                </View>
  
                <TouchableOpacity onPress={() => removeSet(exercise.id, index)} style={styles.removeButton}>
                  <Text style={styles.removeSet}>✖</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addSetButton} onPress={() => addSet(exercise.id)}>
              <Text style={styles.addSetButtonText}>+ Add Set</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  
  

const RoutineDetails = ({ route, navigation }) => {
  const { routineName } = route.params;
  const [exercises, setExercises] = useState([]);
  const [expandedExercise, setExpandedExercise] = useState(null);

  useEffect(() => {
    const fetchRoutine = async () => {
        const user = auth.currentUser;
        if (!user) return;
      
        const routineRef = ref(database, `users/${user.uid}/routines/${routineName}`);
        const snapshot = await get(routineRef);
      
        if (snapshot.exists()) {
          const fetchedExercises = Object.values(snapshot.val()) || [];
          const exercisesWithSets = fetchedExercises.map((ex, index) => ({
            ...ex,
            id: ex.id || `exercise-${index}`, // ✅ Ensure each exercise has a unique ID
            sets: ex.sets || [] 
          }));
          setExercises(exercisesWithSets);
        } else {
          setExercises([]);
        }
      };
      
  
    fetchRoutine();
  }, []);
  
  
  

  const toggleExpand = (exerciseId) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
  };

  const updateSets = (exerciseId, index, field, value) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set, i) =>
                i === index ? { ...set, [field]: value } : set
              ),
            }
          : exercise
      )
    );
  };

  const addSet = (exerciseId) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, sets: [...exercise.sets, { reps: '', weight: '' }] }
          : exercise
      )
    );
  };

  const removeSet = (exerciseId, index) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, sets: exercise.sets.filter((_, i) => i !== index) }
          : exercise
      )
    );
  };

  const deleteRoutine = async () => {
    Alert.alert("Delete Routine", "Are you sure you want to delete this routine?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const user = auth.currentUser;
          if (!user) return;

          await remove(ref(database, `users/${user.uid}/routines/${routineName}`));
          navigation.navigate("App", { screen: "Routines" });
        },
      },
    ]);
  };




  const saveChanges = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await set(ref(database, `users/${user.uid}/routines/${routineName}`), exercises);
    navigation.navigate("App", { screen: "Routines" });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{routineName}</Text>
        <TouchableOpacity onPress={deleteRoutine}>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {exercises.length > 0 ? (
  exercises.map((exercise, index) => (
    <ExerciseCard
      key={exercise.id || `exercise-${index}`} // ✅ Ensure a unique key
      exercise={exercise}
      expanded={expandedExercise === exercise.id}
      toggleExpand={() => toggleExpand(exercise.id)}
      updateSets={updateSets}
      removeSet={removeSet}
      addSet={addSet}
    />
  ))
) : (
  <Text style={{ color: 'white', textAlign: 'center', marginTop: 10 }}>No exercises in this routine yet.</Text>
)}





      {/* Save & Start Workout */}
      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.startButton}
  onPress={() => navigation.navigate('Countdown', { routineName, exercises })}>
  <Text style={styles.startButtonText}>Start Workout</Text>
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
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
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    exerciseTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 10,
    },
    expandedContent: {
      marginTop: 10,
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
      color: '#fff',
    },
    removeButton: {
      marginTop: 20,
      padding: 8,
      borderRadius: 5,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    removeSet: {
      color: '#fff',
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
    startButton: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

  });
  

export default RoutineDetails;
