import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MicroAppProps } from "@hms/models";
import { Login } from "./screens/login/login";

const Stack = createNativeStackNavigator();

export function AuthenticationMicroApp({ host }: MicroAppProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login">{() => <Login host={host} />}</Stack.Screen>
    </Stack.Navigator>
  );
}
