import { Ionicons } from "@expo/vector-icons";
import { TextInput, View, Text, StyleSheet } from "react-native";

export const AppointmentInputCard = (props: any) => {
  return (
    <View style={styles.appointmentContainer}>
      <Text style={[styles.text, styles.appointmentTitle]}>{props.title}</Text>
      <View style={styles.appointmentHolder}>
        <Ionicons
          name={props.iconName}
          size={22}
          color={"white"}
          style={styles.appointmentIcon}
        />
        <TextInput
          value={props.value}
          style={styles.appointmentTextField}
          placeholderTextColor={"rgba(111, 111, 111, 0.8)"}
          onChange={props.getData}
          editable={props.isDisabled}
        ></TextInput>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appointmentContainer: {
    padding: 20,
    flexDirection: "column",
  },
  appointmentHolder: {
    flexDirection: "row",
    backgroundColor: "rgba(62, 62, 62, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: 8,
  },
  appointmentTitle: {
    color: "rgb(218, 218, 218)",
    fontSize: 12,
    lineHeight: 12,
    marginBottom: 6,
  },
  appointmentIcon: {
    backgroundColor: "rgb(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: 10,
  },
  appointmentTextField: {
    color: "white",
    fontFamily: "Sans",
    fontSize: 14,
    lineHeight: 14,
    marginLeft: 10,
  },
  text: {
    fontFamily: "Sans",
  },
});
