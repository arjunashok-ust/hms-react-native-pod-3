import { StyleSheet } from "react-native";

export function appointmentFormBodyStyles() {
  return StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 35,
      margin: 20,
      backgroundColor: "#f2f2f2",
      borderColor: "rgba(207, 75, 255, 0.2)",
      borderWidth: 1,
      paddingBottom: 20,
    },
    text: {
      fontFamily: "Sans",
    },
    errorText: {
      color: "#ef2121",
      fontSize: 13,
      width: "80%",
      borderLeftWidth: 4,
      borderColor: "#cd1717",
      borderRadius: 4,
      marginTop: 5,
      paddingHorizontal: 10,
    },
  });
}
