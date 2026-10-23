import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MicroAppProps } from "@hms/models";
import { HostProvider } from "@hms/shared-util";
import { AppointmentScreen } from "./screens/appointment-form/appointment-form";
import EditAppointmentScreen from "./screens/appointment-edit/appointment-edit";
import ViewAppointmentScreen from "./screens/appointment-list/appointment-list";
import type { AppointmentStackParamList } from "./navigation/navigation-types";

const Stack = createNativeStackNavigator<AppointmentStackParamList>();

export type AppointmentMicroAppProps = MicroAppProps & { initialDoctorId?: string };

export function AppointmentMicroApp({ host, initialDoctorId }: AppointmentMicroAppProps) {
  return (
    <HostProvider host={host}>
      <Stack.Navigator
        initialRouteName="appointmentForm"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="appointmentForm">
          {(props) => (
            <AppointmentScreen {...props} initialDoctorId={initialDoctorId} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="appointmentList"
          component={ViewAppointmentScreen}
        />
        <Stack.Screen
          name="appointmentEdit"
          component={EditAppointmentScreen}
        />
      </Stack.Navigator>
    </HostProvider>
  );
}
