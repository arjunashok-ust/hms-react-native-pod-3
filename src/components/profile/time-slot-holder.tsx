import { Ionicons } from "@expo/vector-icons";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

export const TimeSlotHolder = (props:any) => {
  return (
    <TouchableOpacity style={[styles.slotHolder,props.isSelected && styles.slotHolderSelected]} onPress={()=>props.onAction(props.slot)}>
      <Ionicons name="alarm-outline" color={"rgb(207, 75, 255)"} size={22} />
      <Text style={[styles.text, styles.timeSlot]}>{props.slot}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  slotHolder: {
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    padding:10,
    backgroundColor: "rgba(106, 106, 106, 0.5)",
    borderRadius:10,
    margin:5,
  },
  slotHolderSelected:{
    backgroundColor: "rgba(229, 35, 255, 0.5)",
  },
  timeSlot: {
    color: "white",
    fontSize: 14,
    lineHeight: 14,
    marginLeft: 3,
  },
  text:{
    fontFamily: "Sans",
  }
});
