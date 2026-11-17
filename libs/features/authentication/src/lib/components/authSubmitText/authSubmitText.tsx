import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuthenticationContext } from "../../hooks/useAuthenticationContext";

export const AuthSubmitButton = (props: any) => {
  const { styles } = useAuthenticationContext("authSubmitTextContent");
  return (
    <TouchableOpacity style={styles.submitButton} onPress={props.onSubmit} testID={props.testId}>
      <Text style={styles.buttonText}>{props.titleText}</Text>
    </TouchableOpacity>
  );
};