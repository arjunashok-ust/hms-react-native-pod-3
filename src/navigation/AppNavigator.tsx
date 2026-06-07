import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/login";
import SignUpScreen from "../screens/signup";
import TabNavigator from "./TabNavigator";
import ViewAppointmentScreen from "../screens/view-appointment";
import EditAppointmentScreen from "../screens/edit-appointment";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator initialRouteName="login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="signup" component={SignUpScreen} />
        <Stack.Screen name="tabs" component={TabNavigator} />
        <Stack.Screen name="viewAppointment" component={ViewAppointmentScreen} />
        <Stack.Screen name="editAppointment" component={EditAppointmentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
