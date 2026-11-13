import { StyleSheet } from "react-native";
export function authSubmitTextStyles() {
  return StyleSheet.create({
    submitButton: {
      width: "80%",
      marginTop: 30,
      padding: 10,
      backgroundColor: "#4c1c77",
      borderColor: "rgba(0,0,0,0.3)",
      borderWidth: 1,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontFamily: "Sans",
      color: "#f0f0f0",
      fontSize: 14,
      lineHeight: 30,
    },
  });
}
