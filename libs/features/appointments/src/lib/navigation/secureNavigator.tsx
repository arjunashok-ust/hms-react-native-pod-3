import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppointmentStackParamList } from "./navigationTypes";
import { AppointmentList } from "../screens/appointmentList/appointmentList";
import { AppointmentEdit } from "../screens/appointmentEdit/appointmentEdit";
import { AppointmentForm } from "../screens/appointmentForm/appointmentForm";

const Stack = createNativeStackNavigator<AppointmentStackParamList>();

export function SecureNavigator({
  initialDoctorId,
}: {
  initialDoctorId?: string;
}) {
  return (
    <Stack.Navigator
      initialRouteName="appointmentForm"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="appointmentForm">
        {(props) => (
          <AppointmentForm {...props} initialDoctorId={initialDoctorId} />
        )}
      </Stack.Screen>

      <Stack.Screen name="appointmentList" component={AppointmentList} />
      <Stack.Screen name="appointmentEdit" component={AppointmentEdit} />
    </Stack.Navigator>
  );
}
