import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MicroAppProps } from "@hms/models";
import { HostProvider } from "@hms/shared-util";
import ProfileViewScreen from "./screens/profile-view/profile-view";
import ProfileEditScreen from "./screens/profile-edit/profile-edit";
import type { ProfileStackParamList } from "./navigation/navigation-types";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileMicroApp({ host }: MicroAppProps) {
  return (
    <HostProvider host={host}>
      <Stack.Navigator
        initialRouteName="profileView"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="profileView" component={ProfileViewScreen} />
        <Stack.Screen name="profileEdit" component={ProfileEditScreen} />
      </Stack.Navigator>
    </HostProvider>
  );
}
