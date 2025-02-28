import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../colors'; 
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.text}>Manage your settings here.</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background},
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  text: { fontSize: 18, color: '#666', marginTop: 10 },
});

export default SettingsScreen;
