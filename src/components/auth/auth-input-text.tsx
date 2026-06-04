import { Ionicons } from "@expo/vector-icons";
import { TextInput, StyleSheet, View } from "react-native";

export const AuthInputText = (props: any) => {
  return (
    <View style={styles.container}>
      <Ionicons name={props.iconName} size={20} color="black" />
      <TextInput
        placeholder={props.innerText}
        placeholderTextColor="black"
        style={styles.textInput}
        onChangeText={props.getData}
        secureTextEntry={props.isPassword ?? false}
      ></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width:"80%",
    flexDirection:"row",
    alignItems:"center",
    borderBottomWidth:1,
    borderColor:"black",
  },
  textInput: {
    fontFamily: "Sans",
    fontSize: 16,
    width: "80%",
    height: 58,
    borderRadius: 16,
    color: "black",
    marginVertical: 10,
    marginLeft:10,
  },
});
