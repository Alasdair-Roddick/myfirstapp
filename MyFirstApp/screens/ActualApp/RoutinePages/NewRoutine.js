import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../colors'; 
import { TextInput } from 'react-native-gesture-handler';

const WorkoutNameCard = ({ title, value, isSelected, onPress }) => (
    <TouchableOpacity 
        style={[styles.workoutNameCard, isSelected && styles.selectedCard]} 
        onPress={onPress}
    >
        <Text style={[styles.cardTitle, isSelected && styles.selectedText]}>{title}</Text>
        <Text style={[styles.cardValue, isSelected && styles.selectedText]}>{value}</Text>
    </TouchableOpacity>
);

const NewRoutine = ({ navigation }) => {
    const [selectedWorkouts, setSelectedWorkouts] = useState([]);
    const [routineName, setRoutineName] = useState('');
    
    const workouts = [
        { id: 1, title: 'Workout 1', value: 'Chest' },
        { id: 2, title: 'Workout 2', value: 'Back' },
        { id: 3, title: 'Workout 3', value: 'Legs' },
        { id: 4, title: 'Workout 4', value: 'Shoulders' },
        { id: 5, title: 'Workout 5', value: 'Arms' }
    ];

    const toggleWorkoutSelection = (id) => {
        setSelectedWorkouts(prevSelected => 
            prevSelected.includes(id)
                ? prevSelected.filter(workoutId => workoutId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSaveRoutine = () => {
        const selectedRoutine = workouts.filter(workout => selectedWorkouts.includes(workout.id));
        console.log('Routine Name:', routineName);
        console.log('Selected Workouts:', selectedRoutine);
        // Here, you can send `selectedRoutine` to your database
        navigation.navigate('App', { screen: 'Routines' });
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

            <View style={styles.cardContainer}>
                {workouts.map(workout => (
                    <WorkoutNameCard 
                        key={workout.id} 
                        title={workout.title} 
                        value={workout.value} 
                        isSelected={selectedWorkouts.includes(workout.id)}
                        onPress={() => toggleWorkoutSelection(workout.id)}
                    />
                ))}
            </View>

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
        backgroundColor: colors.background 
    },
    cardContainer: {
        width: '80%',
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
        marginTop: 20,
        marginBottom: 20,
    },
    RoutineName: {
        width: '80%',
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
    },
    buttonText: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: 'bold',
    }
});

export default NewRoutine;