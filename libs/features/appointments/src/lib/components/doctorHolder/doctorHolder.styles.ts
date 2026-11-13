import { StyleSheet } from "react-native";

export function doctorHolderStyles() {
  return StyleSheet.create({
    dropdownHolder: {
      backgroundColor: "rgb(222, 222, 222)",
      borderWidth: 1,
      borderColor: "rgba(83, 11, 107, 0.3)",
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
      margin: 20,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    picker: {
      flex: 1,
      marginLeft: 3,
      color: "rgb(39, 39, 39)",
      fontFamily: "Sans",
    },
    dropDownIcon: {
      padding: 10,
      backgroundColor: "rgb(108, 19, 109)",
      borderWidth: 1,
      borderColor: "rgba(198, 53, 255, 0.2)",
      borderRadius: 10,
    },
  });
}
