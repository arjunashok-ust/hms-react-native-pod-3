import { StyleSheet } from "react-native";
export function authInputTextStyles() {
  return StyleSheet.create({
    container: {
      width: "80%",
      height: 60,
      paddingHorizontal: 20,
      borderRadius: 15,
      marginVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#ffffff",
      borderColor: "rgba(0,0,0,0.2)",
      borderWidth: 1,
    },
    textInput: {
      fontFamily: "Sans",
      fontSize: 14,
      lineHeight: 14,
      height: "100%",
      flex: 1,
      width: "100%",
      borderRadius: 16,
      color: "black",
      marginLeft: 10,
    },
  });
}
