import { TextInput,StyleSheet } from "react-native";

export const AuthInputText = (props:any) => {
  return (
    <TextInput
      placeholder={props.innerText}
      placeholderTextColor="white"
      style={styles.textInput}
      onChangeText={props.getData}
      secureTextEntry={props.isPassword ?? false}
    ></TextInput>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontFamily: 'Sans',
    fontSize:16,
    width: "85%",
    height: 58,
    borderBottomWidth:1,
    borderColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 18,
    color: "#fbfbfb",
    marginVertical: 10,
  },
});