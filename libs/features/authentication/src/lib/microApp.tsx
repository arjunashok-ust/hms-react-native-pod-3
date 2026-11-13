import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/login/loginContent";
import SignUp from "./screens/signup/signupContent";
import { AuthenticationMicroAppProps } from "./microAppTypes";
import { AuthStackParamList } from "./navigation/navigationTypes";
import { AuthenticationProvider } from "./providers/authenticationProvider";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthenticationMicroApp({
  onSignedIn,
}: AuthenticationMicroAppProps) {
  return (
    <AuthenticationProvider>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="login"
      >
        <Stack.Screen name="login">
          {() => <Login onSignedIn={onSignedIn} />}
        </Stack.Screen>
        <Stack.Screen name="signup">{() => <SignUp />}</Stack.Screen>
      </Stack.Navigator>
    </AuthenticationProvider>
  );
}
