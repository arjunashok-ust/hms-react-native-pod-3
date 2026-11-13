import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppointmentStackParamList } from "./navigationTypes";
import { AppointmentScreen } from "../screens/appointmentForm/appointmentForm";
import ViewAppointmentScreen from "../screens/appointmentList/appointmentList";
import EditAppointmentScreen from "../screens/appointmentEdit/appointmentEdit";

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
          <AppointmentScreen {...props} initialDoctorId={initialDoctorId} />
        )}
      </Stack.Screen>

      <Stack.Screen name="appointmentList" component={ViewAppointmentScreen} />
      <Stack.Screen name="appointmentEdit" component={EditAppointmentScreen} />
    </Stack.Navigator>
  );
}
