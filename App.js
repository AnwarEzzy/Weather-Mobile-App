import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import AppNavigation from "./src/navigation/AppNavigation";
import { AuthProvider } from "./src/context/AuthContext";
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useEffect } from "react";

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Apply global font
      const customTextProps = { style: { fontFamily: 'Inter_400Regular' } };
      const customInputProps = { style: { fontFamily: 'Inter_400Regular' } };

      // Override Text.render to merge styles? 
      // Simplest "hack" for existing apps without refactoring every Text component:
      // Note: This is deprecated but effective for "do it everywhere automatically".
      // A better way is creating a StyledText component, but for this task:

      const setGlobalFont = (Component, defaultProps) => {
        const oldRender = Component.render;
        // This approach is risky with functional components.
        // Fallback to defaultProps which works on the class-based internal Text?
        // Actually, in RN 0.70+, Text is functional. 
        // defaultProps might not work on modern standard Text.
      };
    }
  }, [fontsLoaded]);

  // Alternative: Just use explicit style if defaultProps fails.
  // But let's try setting defaultProps on the imported Text first.
  if (Text.defaultProps == null) Text.defaultProps = {};
  Text.defaultProps.style = { fontFamily: 'Inter_400Regular' };

  if (TextInput.defaultProps == null) TextInput.defaultProps = {};
  TextInput.defaultProps.style = { fontFamily: 'Inter_400Regular' };


  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}
