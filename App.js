import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/loginScreen";
import SignupScreen from "./src/screens/signUpScreen";
import HomeScreen from "./src/screens/homeScreen";
import SplashScreen from "./src/screens/splashScreen";
import BottomTabs from "./src/navigation/bottomTabs";
import AppointmentScreen from "./src/screens/appointmentScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Main" component={BottomTabs} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
