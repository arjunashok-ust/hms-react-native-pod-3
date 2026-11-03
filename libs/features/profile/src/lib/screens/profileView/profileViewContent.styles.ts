import { StyleSheet } from "react-native";

export const profileViewContentStyles = () =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    container: {
      flex: 1,
      borderRadius: 19,
      marginTop: 13,
      marginHorizontal: 20,
      backgroundColor: "#f2f2f2",
      borderColor: "rgba(207, 75, 255, 0.2)",
      borderWidth: 1,
      marginBottom: 30,
      padding: 20,
    },
  });
