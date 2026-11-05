import { StyleSheet } from "react-native";

export const viewMedicalRecordContentStyles = () =>
  StyleSheet.create({
    wrapper: { flex: 1 },
    overlay: { flex: 1, backgroundColor: "rgba(255, 255, 255, 0.8)" },
    container: {
      flex: 1,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      marginTop: 30,
      borderColor: "rgba(207, 75, 255, 0.2)",
      backgroundColor: "#f2f2f2",
      borderWidth: 1,
      paddingBottom: 20,
    },
    text: { fontFamily: "Sans" },
    noRecordsText: {
      color: "white",
      fontSize: 12,
      lineHeight: 12,
      textAlign: "center",
      backgroundColor: "rgb(75, 12, 67)",
      padding: 10,
    },
  });
