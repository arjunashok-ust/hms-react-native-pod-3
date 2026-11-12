import { TouchableOpacity, Text, StyleSheet } from "react-native";

const SelectHolder = (props: any) => {
  return (
    <TouchableOpacity style={[styles.selectHolder,props.isSelected && styles.selectedStyle]} onPress={props.onPress}>
      <Text style={[styles.text, styles.selectHolderText]}>{props.name}</Text>
    </TouchableOpacity>
  );
};

export default SelectHolder;