import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MedicalRecordStackParamList } from "./navigationTypes";
import { ViewMedicalRecord } from "../screens/viewMedicalRecord/viewMedicalRecord";

const Stack = createNativeStackNavigator<MedicalRecordStackParamList>();

export function SecureNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="viewMedicalRecord"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="viewMedicalRecord" component={ViewMedicalRecord} />
    </Stack.Navigator>
  );
}
