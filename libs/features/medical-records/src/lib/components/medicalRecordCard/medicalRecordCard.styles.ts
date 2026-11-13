import { StyleSheet } from "react-native";

export function medicalRecordCardStyles() {
  return StyleSheet.create({
    appointmentContainer: {
      margin: 20,
      backgroundColor: "rgba(210, 210, 210, 0.3)",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "rgba(127, 27, 131, 0.2)",
      padding: 20,
    },
    appointmentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    appointmentIconAndText: { flexDirection: "row", flex: 1 },
    appointmentTextHolder: {
      flexDirection: "column",
      marginLeft: 10,
      justifyContent: "center",
      flex: 1,
    },
    headerRight: { alignItems: "center" },
    avatarIcon: {
      backgroundColor: "rgb(108, 19, 109)",
      borderRadius: 100,
      height: 50,
      width: 50,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgba(194, 80, 247, 0.4)",
    },
    avatarText: {
      color: "rgba(205, 148, 255, 0.8)",
      fontSize: 14,
      lineHeight: 14,
    },
    doctorText: { color: "#232323", fontSize: 16, lineHeight: 16 },
    doctorSubTitle: {
      color: "#7b7b7b",
      fontSize: 12,
      lineHeight: 12,
      marginTop: 4,
    },
    text: { fontFamily: "Sans" },
  });
}
