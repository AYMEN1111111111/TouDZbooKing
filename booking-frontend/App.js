import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import FlightsScreen from './screens/FlightsScreen';
import HotelsScreen from './screens/HotelsScreen';
import ToursScreen from './screens/ToursScreen';
import FlightResultsScreen from './screens/FlightResultsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FlightsScreen" component={FlightsScreen} />
        <Stack.Screen name="HotelsScreen" component={HotelsScreen} />
        <Stack.Screen name="ToursScreen" component={ToursScreen} />
        <Stack.Screen name="FlightResultsScreen" component={FlightResultsScreen} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
