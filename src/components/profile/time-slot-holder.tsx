import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

export const TimeSlotHolder = (props:any) => {
  return (
    <View style={styles.slotHolder}>
      <Ionicons name="alarm-outline" color={"rgb(207, 75, 255)"} size={20} />
      <Text style={[styles.text, styles.timeSlot]}>{props.slot}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  slotHolder: {
    flexDirection: "row",
    padding: 10,
    margin: 5,
    width: "30.4%",
    borderRadius: 8,
    backgroundColor: "rgba(207, 75, 255,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  timeSlot: {
    color: "white",
    fontSize: 10,
    lineHeight: 12,
    marginLeft: 3,
  },
  text:{
    fontFamily: "Sans",
  }
});
