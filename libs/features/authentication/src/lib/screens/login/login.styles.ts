import { StyleSheet } from "react-native";
export function loginStyles() {
  return StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: "#e1e1e1",
    },
    overlay: {
      flex: 1,
      justifyContent: "space-between",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    },

    welcomeTextContainer: {
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginVertical: 100,
      marginHorizontal: 20,
      padding: 10,
      height: "20%",
    },
    container: {
      height: "50%",
      backgroundColor: "#f2f2f2",
      borderRadius: 30,
      margin: 20,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
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
    loginFooter: {
      marginTop: 40,
      flexDirection: "row",
    },
    loginFooterText: {
      color: "black",
      fontFamily: "Sans",
      fontSize: 14,
    },
    signUp: {
      color: "#4c1c77",
    },
  });
}
