import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import AuthenticationHost from "../microapps/authentication";
import { useSessionStatus } from "@hms/data-access";
import { navigationRef } from "./navigation-ref";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const status = useSessionStatus();

  if (status === "loading") return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={status == "authenticated" ? "tabs" : "auth"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="auth" component={AuthenticationHost} />
        <Stack.Screen name="tabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
