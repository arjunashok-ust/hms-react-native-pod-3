import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStackParamList } from "./navigationTypes";
import { Home } from "../screens/home/home";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function SecureNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="home" component={Home}></Stack.Screen>
    </Stack.Navigator>
  );
}
