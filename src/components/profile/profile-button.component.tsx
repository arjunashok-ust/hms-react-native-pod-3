import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text,StyleSheet } from "react-native";

export default function ProfileButton(props:any) {
  return (
    <TouchableOpacity style={styles.buttonHolder} onPress={props.onAction}>
      <Ionicons
        name={props.iconName}
        color={"rgba(255, 0, 242, 0.6)"}
        size={20}
        style={styles.iconStyle}
      />
      <Text style={[styles.text, styles.buttonText]}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonHolder: {
    flexDirection: "row",
    backgroundColor: "rgba(52, 6, 6, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 20,
    marginVertical:10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    lineHeight: 12,
    marginLeft: 10,
  },
  iconStyle: {
    backgroundColor: "rgba(230, 0, 255, 0.2)",
    borderRadius: 8,
    padding: 5,
  },
  text: {
    fontFamily: "Sans",
  }
});
