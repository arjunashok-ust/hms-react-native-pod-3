import { Ionicons } from "@expo/vector-icons";
import { TextInput, StyleSheet, View } from "react-native";
import { useAuthenticationContext } from "../../hooks/useAuthenticationContext";

export const AuthInputText = (props: any) => {
  const { styles } = useAuthenticationContext("authInputTextContent");
  return (
    <View style={styles.container}>
      <Ionicons name={props.iconName} size={20} color="#828282" />
      <TextInput
        placeholder={props.innerText}
        placeholderTextColor="#828282"
        style={styles.textInput}
        onChangeText={props.getData}
        secureTextEntry={props.isPassword ?? false}
        numberOfLines={1}
      ></TextInput>
    </View>
  );
};
