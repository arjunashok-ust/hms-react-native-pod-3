import { AppointmentMicroApp } from "@hms/feature-appointments";
import type { TabParamList } from "@hms/models";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useHostContext } from "./use-host-context";

export default function AppointmentHost() {
  const route = useRoute<RouteProp<TabParamList, "appointment">>();
  const host = useHostContext();
  // a new launchId remounts the micro app, so its nested stack restarts on the form
  return (
    <AppointmentMicroApp
      key={route.params?.launchId}
      host={host}
      initialDoctorId={route.params?.doctorId}
    />
  );
}
