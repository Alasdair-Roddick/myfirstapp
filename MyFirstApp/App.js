import 'react-native-reanimated'; // ADD THIS LINE AT THE VERY TOP


import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from './firebaseConfig';
import { ref, get } from "firebase/database";
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from './colors'; 
import * as Font from "expo-font";


// Import screens
import DashboardScreen from './screens/DashboardScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import SetupScreen from './screens/SetupScreen';
import HomeScreen from './screens/ActualApp/HomeScreen';
import RoutinesScreen from './screens/ActualApp/RoutinesScreen';
import SettingsScreen from './screens/ActualApp/SettingsScreen';
import NewRoutine from './screens/ActualApp/RoutinePages/NewRoutine';
import RoutineSetupScreen from './screens/ActualApp/RoutinePages/RoutineSetupScreen';
import RoutineDetails from './screens/ActualApp/RoutinePages/RoutineDetails';
import CountdownScreen from './screens/ActualApp/CountdownScreen';
import WorkoutSessionScreen from './screens/ActualApp/WorkoutSessionScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const loadFonts = async () => {
  await Font.loadAsync({
    'Montserrat': require('./assets/fonts/Montserrat-VariableFont_wght.ttf'), // Ensure these are correct
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });
};

// Bottom Tab Navigation
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.primary, // Keeping the color scheme
          height: 70,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          position: 'absolute',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Routines') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={28} color={focused ? '#fff' : '#ddd'} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Routines" component={RoutinesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Dashboard");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = ref(database, `users/${currentUser.uid}/setupComplete`);
        const snapshot = await get(userRef);
        setInitialRoute(snapshot.exists() && snapshot.val() === true ? "App" : "Setup");
      } else {
        setUser(null);
        setInitialRoute("Dashboard");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <View />; // Prevent flickering
  }


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Setup" component={SetupScreen} options={{ headerShown: false }} />
        <Stack.Screen 
  name="App" 
  component={BottomTabs} 
  options={{ 
    headerShown: false,
    gestureEnabled: false // Disable swipe back gesture
  }} 
/>

        <Stack.Screen name="NewRoutine" component={NewRoutine} options={{ headerShown: false }} />
        <Stack.Screen name="RoutineSetup" component={RoutineSetupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RoutineDetails" component={RoutineDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Countdown" component={CountdownScreen} options={{ headerShown: false }} />
<Stack.Screen name="WorkoutSession" component={WorkoutSessionScreen} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
