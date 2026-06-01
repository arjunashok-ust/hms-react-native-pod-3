import { Ionicons } from "@expo/vector-icons";
import { View, Text,StyleSheet } from "react-native";

export const InfoCard = (props: any) => {
  return (
    <View style={styles.infoCard}>
      <Ionicons
        name={props.iconName}
        color="rgb(207, 75, 255)"
        size={20}
        style={styles.infoIcon}
      />
      <View style={styles.infoData}>
        <Text style={[styles.text, styles.infoText]}>{props.title}</Text>
        <Text style={[styles.text, styles.infoValue]}>{props.value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  infoIcon: {
    backgroundColor: "rgb(207, 75, 255,0.2)",
    padding: 10,
    borderRadius: 12,
    marginLeft: 10,
  },
  infoData: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 10,
  },
  infoText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    lineHeight: 10,
  },
  infoValue: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
  },
  text:{
    fontFamily:"Sans",
  }
});
