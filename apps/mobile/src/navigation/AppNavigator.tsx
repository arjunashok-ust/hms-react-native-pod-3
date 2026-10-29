import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import AuthenticationHost from "../microapps/authentication";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="auth"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="auth" component={AuthenticationHost} />
        <Stack.Screen name="tabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
