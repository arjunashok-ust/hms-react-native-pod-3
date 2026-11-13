import { StyleSheet } from "react-native";

export function clinicalRowStyles() {
  return StyleSheet.create({
    appointmentIcon: { color: "rgb(101, 26, 114)", marginRight: 4 },
    clinicalRow: {
      backgroundColor: "rgba(127, 27, 131, 0.05)",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "rgba(127, 27, 131, 0.1)",
      padding: 10,
      marginVertical: 5,
    },
    clinicalLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    clinicalLabel: {
      fontSize: 10,
      color: "#7b7b7b",
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    clinicalValue: { fontSize: 13, color: "#232323", lineHeight: 18 },
    text: { fontFamily: "Sans" },
  });
}
