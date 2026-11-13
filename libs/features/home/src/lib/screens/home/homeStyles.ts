import { StyleSheet } from "react-native";

export function homeScreenStyles() {
  return StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    text: {
      fontFamily: "Sans",
    },
    container: {
      backgroundColor: "rgb(255, 255, 255)",
      flex: 1,
      marginTop: 10,
      paddingVertical: 50,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    contentHolder: {
      marginHorizontal: 20,
      marginVertical: 5,
      borderRadius: 10,
      padding: 10,
    },
    contentTitle: {
      fontSize: 16,
      color: "rgb(109, 109, 109)",
    },
  });
}
