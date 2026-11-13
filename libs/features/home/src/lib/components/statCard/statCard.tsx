import { View, Text, StyleSheet } from "react-native";
import { useHomeContext } from "../../hooks/useHomeContext";

const StatCard = (props: any) => {
  const { styles } = useHomeContext("statCardContent");
  return (
    <View style={styles.statHolder}>
      <Text style={[styles.statTitle, styles.text]}>{props.value}</Text>
      <Text style={[styles.statValue, styles.text]}>{props.title}</Text>
    </View>
  );
};

export default StatCard;