import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const PlusButton = ({ onPress }) => (
  <TouchableOpacity style={styles.plusButton} onPress={onPress}>
    <Text style={styles.plusButtonText}>+</Text>
  </TouchableOpacity>
);

const RoutinesScreen = ({ navigation }) => { // Accept navigation prop
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Routines</Text>
      <Text style={styles.text}>This is the Routines page.</Text>

      {/* Plus Button Navigates to NewRoutine */}
      <PlusButton onPress={() => navigation.navigate('NewRoutine')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: colors.background 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: colors.primary 
  },
  text: { 
    fontSize: 18, 
    color: '#666', 
    marginTop: 0,
  },
  plusButton: { 
    backgroundColor: colors.primary, 
    width: 40, 
    height: 40, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'absolute', 
    bottom: 100, 
    right: 20, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  plusButtonText: { 
    color: '#fff', 
    fontSize: 25, 
    fontWeight: 'bold', 
    marginBottom: 2
  }
});

export default RoutinesScreen;
