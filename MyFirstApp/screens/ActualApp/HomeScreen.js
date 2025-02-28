import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../colors'; 

// Large & Small Card Components
const LargeCard = ({ title, value }) => (
  <View style={styles.largeCard}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const SmallCard = ({ title, value }) => (
  <View style={styles.smallCard}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

// Date Component
const DateTime = () => {
  const date = new Date();
  const day = date.getDate();
  const dayWord = date.toLocaleString('default', { weekday: 'long' });
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  // Function to get the ordinal suffix
  const getOrdinalSuffix = (day) => {
    if (day >= 11 && day <= 13) return "th"; // Special case for 11th, 12th, 13th
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const formattedDay = `${day}${getOrdinalSuffix(day)}`;

  return (
    <Text style={styles.date}>{`${dayWord} ${formattedDay} of ${month} ${year}`}</Text>
  );
};


const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <DateTime />
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.cardContainer}>
        <LargeCard title="Points" value="150 pts" />
        <SmallCard title="Your Earnings" value="23 pts" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A4A4A',
    marginBottom: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    fontFamily: colors.fonts.secondary,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  largeCard: {
    width: '60%',
    height: 150,
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  smallCard: {
    width: '35%',
    height: 120,
    backgroundColor: colors.secondary,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: colors.fonts.primary,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
    fontFamily: colors.fonts.primary,
  },
});

export default HomeScreen;
