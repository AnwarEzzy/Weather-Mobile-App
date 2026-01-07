import { View, Text, LogBox } from "react-native";
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ProfileScreen from "../screens/ProfileScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state ",
]);

export default function AppNavigation() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              options={{ headerShown: false }}
              component={HomeScreen}
            />
            <Stack.Screen
              name="Profile"
              options={{ headerShown: false }}
              component={ProfileScreen}
            />
            <Stack.Screen
              name="Favorites"
              options={{ headerShown: false }}
              component={FavoritesScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              options={{ headerShown: false }}
              component={LoginScreen}
            />
            <Stack.Screen
              name="Signup"
              options={{ headerShown: false }}
              component={SignupScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
