import { View, Text } from "react-native";
import { MicroAppProps } from "@hms/models";

export function Profile({ host }: MicroAppProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Profile screen patient id ${host.patientId}</Text>
    </View>
  );
}
