import { Ionicons } from "@expo/vector-icons";
import { TextInput, View, StyleSheet } from "react-native";

const SearchBox = (props: any) => {
  return (
    <View style={styles.searchBox}>
      <Ionicons name="search-outline" style={styles.searchIcon} size={18} />
      <TextInput
        style={styles.searchInput}
        placeholder={props.placeholder}
        onChangeText={props.onChangeText}
      />
    </View>
  );
};

export default SearchBox;

const styles = StyleSheet.create({
  text: {
    fontFamily: "Sans",
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "rgb(255, 255, 255)",
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "rgba(61, 11, 105, 0.3)",
    borderWidth: 1,
  },
  searchIcon: {
    padding: 5,
    backgroundColor: "rgb(232, 232, 232)",
    marginLeft: 10,
    borderRadius: 5,
    borderColor: "rgba(61, 11, 105, 0.3)",
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    lineHeight: 30,
  },
});
