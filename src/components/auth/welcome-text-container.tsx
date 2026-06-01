import { View, Text, StyleSheet } from "react-native";

export const WelcomeTextContainer = (props: any) => {
  return (
    <View style={props.isHome?styles.HomeTextContainer:styles.welcomeTextContainer}>
      <Text style={[styles.loginText, styles.loginTextWelcome]}>
        {props.text1}
      </Text>
      <Text style={[styles.loginText, styles.loginTextMain]}>
        {props.text2}
      </Text>
      <Text style={[styles.loginText, styles.loginTextSub]}>{props.text3}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeTextContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginVertical: 100,
    marginHorizontal: 20,
    padding: 10,
    height: "10%",
  },
   HomeTextContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginVertical:60,
    marginHorizontal:20,
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
    color: "rgb(255, 27, 110)",
  },
  loginTextSub: {
    fontSize: 12,
    lineHeight: 10,
    marginVertical: 10,
    backgroundColor: "rgb(255, 255, 255,0.1)",
    borderWidth:1,
    borderColor:"rgba(255, 20, 224, 0.2)",
    padding: 10,
    borderRadius: 8,
  },
});
