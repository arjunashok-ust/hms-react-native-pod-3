import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/login/login";
import SignUp from "./screens/signup/signup";
import { AuthenticationMicroAppProps } from "./micro-app.types";
import { AuthStackParamList } from "./navigation/navigation-types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthenticationMicroApp({
  onSignedIn,
}: AuthenticationMicroAppProps) {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="login"
    >
      <Stack.Screen name="login">
        {() => <Login onSignedIn={onSignedIn} />}
      </Stack.Screen>
      <Stack.Screen name="signup">{() => <SignUp />}</Stack.Screen>
    </Stack.Navigator>
  );
}
