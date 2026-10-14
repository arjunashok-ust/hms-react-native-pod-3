import { Text, View } from "react-native";
import type { MicroAppProps } from "@hms/models";

export function AppointmentLanding({ host }: MicroAppProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>
        Appointments micro app patient id {host.patientId ?? "unknown"}
      </Text>
    </View>
  );
}
