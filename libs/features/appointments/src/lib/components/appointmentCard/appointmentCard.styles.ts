import { StyleSheet } from "react-native";

export function appointmentCardStyles() {
  return StyleSheet.create({
    appointmentContainer: {
      margin: 20,
      backgroundColor: "rgba(210, 210, 210, 0.3)",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "rgba(127, 27, 131, 0.2)",
      padding: 20,
    },
    avatarIcon: {
      backgroundColor: "rgb(108, 19, 109)",
      borderRadius: 100,
      height: 50,
      width: 50,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgb(194, 80, 247,0.4)",
    },
    avatarText: {
      color: "rgba(205, 148, 255, 0.8)",
      fontSize: 14,
      lineHeight: 14,
    },
    doctorText: {
      color: "#232323",
      fontSize: 16,
      lineHeight: 16,
    },
    doctorSubTitle: {
      color: "#7b7b7b",
      fontSize: 12,
      lineHeight: 12,
    },
    appointmentStatus: {
      height: 40,
      borderRadius: 10,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
    },
    booked: {
      backgroundColor: "rgb(15, 118, 16)",
      borderColor: "rgba(175, 255, 226, 0.6)",
    },
    cancelled: {
      backgroundColor: "rgb(112, 14, 14)",
      borderColor: "rgba(255, 215, 186, 0.6)",
    },
    completed: {
      backgroundColor: "rgb(33, 18, 107)",
      borderColor: "rgba(168, 168, 255, 0.6)",
    },
    pending: {
      backgroundColor: "rgb(117, 69, 14)",
      borderColor: "rgba(254, 255, 168, 0.6)",
    },
    appointmentStatusText: {
      color: "#f5f5f5",
      fontSize: 12,
      lineHeight: 12,
    },
    appointmentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    appointmentTextHolder: {
      flexDirection: "column",
      marginLeft: 10,
      justifyContent: "center",
    },
    appointmentIconAndText: {
      flexDirection: "row",
    },
    appointmentIcon: {
      color: "rgb(101, 26, 114)",
    },
    footerText: {
      fontSize: 12,
      color: "rgb(46, 46, 46)",
      lineHeight: 12,
      marginHorizontal: 10,
    },
    appointmentFooter: {
      flexDirection: "column",
    },
    scheduleHolder: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    text: {
      fontFamily: "Sans",
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: "rgb(212, 212, 212)",
      marginVertical: 10,
    },
  });
}
