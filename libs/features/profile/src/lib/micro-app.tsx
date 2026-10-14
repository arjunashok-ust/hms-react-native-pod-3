import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MicroAppProps } from "@hms/models";
import { Profile } from "./screens/profile/profile";

const Stack = createNativeStackNavigator();

export function ProfileMicroApp({ host }: MicroAppProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile">
        {() => <Profile host={host} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
