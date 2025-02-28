import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../colors';
import { ref, get } from 'firebase/database';
import { auth, database } from '../../firebaseConfig';

const RoutineCard = ({ name, onPress }) => (
  <TouchableOpacity style={styles.routineCard} onPress={onPress}>
    <Text style={styles.cardTitle}>{name}</Text>
  </TouchableOpacity>
);

const RoutinesScreen = ({ navigation }) => {
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    const fetchRoutines = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const routinesRef = ref(database, `users/${user.uid}/routines`);
      const snapshot = await get(routinesRef);

      if (snapshot.exists()) {
        setRoutines(Object.keys(snapshot.val()));
      }
    };

    fetchRoutines();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Routines</Text>

      <FlatList
        data={routines}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <RoutineCard name={item} onPress={() => navigation.navigate('RoutineDetails', { routineName: item })} />
        )}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.plusButton} onPress={() => navigation.navigate('NewRoutine')}>
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 80, // Prevents overlapping with the button
    alignItems: 'center', // Ensures cards are centered
  },
  routineCard: {
    padding: 15,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
    width: 350, // Ensures all cards have the same width
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white || '#333',
    textAlign: 'center',
  },
  plusButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 50,
  },
  plusButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
});


export default RoutinesScreen;
