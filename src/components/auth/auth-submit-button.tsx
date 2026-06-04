import { Text, StyleSheet, TouchableOpacity } from "react-native";

export const AuthSubmitButton = (props: any) => {
  return (
    <TouchableOpacity style={styles.submitButton} onPress={props.onSubmit}>
      <Text style={styles.buttonText}>{props.titleText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    width: "80%",
    height:40,
    marginTop: 30,
    borderColor:'black',
    borderWidth:1,
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Sans',
    color: 'black',
    fontSize: 16,
  }
});
