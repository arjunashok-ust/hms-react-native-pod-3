import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "./navigationTypes";
import ProfileViewScreen from "../screens/profileView/profileView";
import ProfileEditScreen from "../screens/profileEdit/profileEdit";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function SecureNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="profileView"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="profileView" component={ProfileViewScreen} />
      <Stack.Screen name="profileEdit" component={ProfileEditScreen} />
    </Stack.Navigator>
  );
}
