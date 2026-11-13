import { StyleSheet } from "react-native";
export function signUpStyles() {
  return StyleSheet.create({
    wrapper: {
      flex: 1,
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
      height: "10%",
    },
    loginText: {
      fontFamily: "Sans",
      color: "white",
    },
    loginTextWelcome: {
      fontSize: 38,
      lineHeight: 38,
    },
    loginTextMain: {
      fontSize: 48,
      lineHeight: 48,
      color: "#4c1c77",
    },
    loginTextSub: {
      fontSize: 12,
      lineHeight: 12,
      marginVertical: 10,
      backgroundColor: "rgb(255, 255, 255,0.1)",
      padding: 10,
      borderRadius: 8,
    },
    container: {
      height: "60%",
      backgroundColor: "#f2f2f2",
      borderRadius: 30,
      margin: 20,
      paddingVertical: 40,
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
    dropdownHolder: {
      backgroundColor: "#ffffff",
      paddingHorizontal: 20,
      borderRadius: 15,
      borderColor: "rgba(0,0,0,0.2)",
      borderWidth: 1,
      width: "80%",
      height: 50,
      marginVertical: 10,
    },
    picker: {
      color: "#828282",
      fontFamily: "Sans",
      fontSize: 14,
    },
    dobField: {
      backgroundColor: "#ffffff",
      paddingHorizontal: 20,
      borderRadius: 15,
      borderColor: "rgba(0,0,0,0.2)",
      width: "80%",
      height: 50,
      marginHorizontal: 0,
    },
    signUpFooter: {
      marginTop: 40,
      marginBottom: 20,
      flexDirection: "row",
    },
    signUpFooterText: {
      color: "black",
      fontFamily: "Sans",
      fontSize: 14,
    },
    login: {
      color: "#4c1c77",
    },
  });
}
