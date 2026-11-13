import { StyleSheet } from "react-native";

export function appointmentListStyles() {
  return StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    scrollView: {
      height: 400,
    },
    container: {
      flex: 1,
      borderRadius: 35,
      marginTop: 10,
      borderColor: "rgba(207, 75, 255, 0.2)",
      backgroundColor: "#f2f2f2",
      borderWidth: 1,
      paddingBottom: 20,
    },
    formHeader: {
      padding: 20,
      flexDirection: "row",
    },
    formHeaderIcon: {
      padding: 15,
      backgroundColor: "rgb(108, 19, 109)",
      borderRadius: 100,
    },
    formHeaderTextHolder: {
      flexDirection: "column",
      marginLeft: 10,
      justifyContent: "center",
      alignItems: "flex-start",
    },
    formHeaderTitle: {
      fontSize: 10,
      lineHeight: 18,
      color: "#909090",
    },
    formHeaderValue: {
      fontSize: 18,
      lineHeight: 18,
      color: "#505050",
    },
    text: {
      fontFamily: "Sans",
    },
    noAppointmentsText: {
      color: "white",
      fontSize: 12,
      lineHeight: 12,
      textAlign: "center",
      backgroundColor: "rgb(75, 12, 67)",
      padding: 10,
    },
  });
}
