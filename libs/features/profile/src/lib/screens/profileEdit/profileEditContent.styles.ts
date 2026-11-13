import { StyleSheet } from "react-native";

export const profileEditContentStyles = () =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    scrollView: {
      height: 450,
    },
    container: {
      flex: 1,
      borderRadius: 35,
      margin: 20,
      backgroundColor: "#f2f2f2",
      borderColor: "rgba(207, 75, 255, 0.2)",
      borderWidth: 1,
      paddingBottom: 20,
    },
    formHeader: {
      padding: 20,
      flexDirection: "row",
    },
    formHeaderIcon: {
      padding: 15,
      backgroundColor: "rgb(108, 19, 109)",
      borderRadius: 100,
    },
    formHeaderTextHolder: {
      flexDirection: "column",
      marginLeft: 10,
      justifyContent: "center",
      alignItems: "flex-start",
    },
    formHeaderTitle: {
      fontSize: 10,
      lineHeight: 18,
      color: "#909090",
    },
    formHeaderValue: {
      fontSize: 18,
      lineHeight: 18,
      color: "#505050",
    },
    text: {
      fontFamily: "Sans",
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: "white",
    },
    dropdownHolder: {
      backgroundColor: "rgb(222, 222, 222)",
      borderWidth: 1,
      borderColor: "rgba(83, 11, 107, 0.3)",
      borderRadius: 10,
      marginVertical: 10,
      margin: 20,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    picker: {
      flex: 1,
      color: "rgb(39, 39, 39)",
      fontFamily: "Sans",
      fontSize: 14,
      lineHeight: 14,
      marginLeft: 3,
    },
    dropDownIcon: {
      padding: 10,
      backgroundColor: "rgba(119, 119, 119, 0.4)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
      borderRadius: 10,
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
    placeholderText: {
      color: "rgb(139, 139, 139)",
      fontSize: 12,
      lineHeight: 12,
      marginHorizontal: 20,
    },
    appointmentIcon: {
      backgroundColor: "rgb(108, 19, 109)",
      borderWidth: 1,
      borderColor: "rgba(198, 53, 255, 0.2)",
      borderRadius: 10,
      padding: 10,
      marginLeft: 5,
    },
  });
