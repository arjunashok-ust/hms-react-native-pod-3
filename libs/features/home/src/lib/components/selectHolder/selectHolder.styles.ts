import { StyleSheet } from "react-native";

export function selectHolderStyles() {
  return StyleSheet.create({
    selectHolder: {
      maxWidth: "100%",
      padding: 10,
      marginHorizontal: 3,
      marginVertical: 5,
      borderWidth: 1,
      borderColor: "rgb(209, 209, 209)",
      borderRadius: 5,
    },
    selectHolderText: {
      fontSize: 14,
      lineHeight: 14,
    },
    selectedStyle: {
      borderColor: "rgb(96, 96, 96)",
      backgroundColor: "rgb(238, 238, 238)",
    },
    text: {
      fontFamily: "Sans",
    },
  });
}
