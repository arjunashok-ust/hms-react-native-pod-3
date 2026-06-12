import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigationRef } from "./src/navigation/RootNavigation";
import { useFonts } from "expo-font";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import MainTabNavigator from "./src/navigation/MainTabNavigator";
import Toast from "react-native-toast-message"; // 🟢 Imported
import { RootStackParamList } from "./src/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    Sans: require("./assets/fonts/GoogleSans.ttf"),
    Montserrat: require("./assets/fonts/Montserrat.ttf"),
    ShareTech: require("./assets/fonts/ShareTech-Regular.ttf"),
    Lexend: require("./assets/fonts/Lexend.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>

      {/* 🟢 Toast must be placed here, outside of the SafeArea and Navigation containers */}
      <Toast />
    </>
  );
}
