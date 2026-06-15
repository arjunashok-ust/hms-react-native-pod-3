import { TouchableOpacity, Text, StyleSheet } from "react-native";

const SelectHolder = (props: any) => {
  return (
    <TouchableOpacity style={styles.selectHolder} onPress={props.onPress}>
      <Text style={[styles.text, styles.selectHolderText]}>{props.name}</Text>
    </TouchableOpacity>
  );
};

export default SelectHolder;

const styles = StyleSheet.create({
  selectHolder: {
    backgroundColor: "rgb(232, 232, 232)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal:3,
    borderColor: "rgba(61, 11, 105, 0.3)",
    borderWidth: 1,
    borderRadius: 5,
  },
  selectHolderText: {
    fontSize: 12,
    lineHeight: 12,
  },
  text: {
    fontFamily: "Sans",
  }
});
