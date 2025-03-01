import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withSequence } from 'react-native-reanimated';
import colors from '../../colors';

const CountdownScreen = ({ navigation, route }) => {
  const [countdown, setCountdown] = useState(3);
  const { routineName, exercises } = route.params;
  const pulse = useSharedValue(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      navigation.replace('WorkoutSession', { routineName, exercises });
    }
  }, [countdown]);

  pulse.value = withSequence(
    withRepeat(withSpring(1.5, { damping: 3, stiffness: 50 }), 3, true),
    withSpring(1)
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.countdownText, animatedStyle]}>{countdown}</Animated.Text>
      <Text style={styles.subText}>Get Ready...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  countdownText: {
    fontSize: 120,
    color: colors.primary,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
  },
  subText: {
    fontSize: 22,
    color: '#aaa',
    marginTop: 20,
    fontWeight: '600',
  },
});

export default CountdownScreen;
