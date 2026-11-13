import { StyleSheet } from "react-native";

export function timeSlotStyles() {
  return StyleSheet.create({
    timeSlotContainer: {
      marginHorizontal: 20,
      marginVertical: 10,
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontFamily: "Sans",
    },
    slotText: {
      color: "#767676",
      backgroundColor: "rgb(222, 222, 222)",
      borderWidth: 1,
      borderColor: "rgba(83, 11, 107, 0.3)",
      borderRadius: 10,
      padding: 5,
      paddingHorizontal: 20,
      fontSize: 15,
      lineHeight: 15,
      marginTop: 20,
    },
  });
}
