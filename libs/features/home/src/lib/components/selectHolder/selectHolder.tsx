import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useHomeContext } from "../../hooks/useHomeContext";

const SelectHolder = (props: any) => {
  const {styles} = useHomeContext("selectHolderContent");
  return (
    <TouchableOpacity style={[styles.selectHolder,props.isSelected && styles.selectedStyle]} onPress={props.onPress}>
      <Text style={[styles.text, styles.selectHolderText]}>{props.name}</Text>
    </TouchableOpacity>
  );
};

export default SelectHolder;