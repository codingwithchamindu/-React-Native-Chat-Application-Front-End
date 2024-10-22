import React, { useState, useEffect } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Welcome from './Welcome';
import Home from './Home';
import Chat from './Chat';
import MyProfile from './MyProfile';


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

async function checkUser() {
  const user = await AsyncStorage.getItem('user');
  return user;
}

function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const user = await AsyncStorage.getItem('user');
      setInitialRoute(user ? 'Home' : 'Sign In');
    }

    fetchUser();
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={checkUser != null ? "Welcome" : "Sign In"}>
        <Stack.Screen name="Sign In" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="Sign Up" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
        <Stack.Screen name="MyProfile" component={MyProfile} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;

