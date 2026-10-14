import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MicroAppProps } from "@hms/models";
import { AppointmentLanding } from "./screens/appointment-landing/appointment-landing";

const Stack = createNativeStackNavigator();

export function AppointmentMicroApp({ host }: MicroAppProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="appointmentsLanding">
        {() => <AppointmentLanding host={host} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
