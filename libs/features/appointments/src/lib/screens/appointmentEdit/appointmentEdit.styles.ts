import { StyleSheet } from "react-native";

export function appointmentEditStyles() {
  return StyleSheet.create({
    wrapper: { flex: 1 },
    overlay: { flex: 1, backgroundColor: "rgba(255, 255, 255, 0.8)" },
    scrollView: { height: 450 },
  });
}
