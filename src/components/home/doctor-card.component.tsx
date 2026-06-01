import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export const DoctorCard = (props: any) => {
  return (
    <TouchableOpacity style={styles.doctorContainer}>
      <LinearGradient
         colors={["rgba(206, 11, 131, 0.9)", "rgb(255, 0, 68)"]}
        style={styles.doctorAvatar}
      >
        <Text style={[styles.text,styles.doctorPrefix]}>{props.prefix}</Text>
      </LinearGradient>
      <View style={styles.doctorDetails}>
        <Text style={[styles.text,styles.doctorName]}>{props.name}</Text>
        <Text style={[styles.text,styles.doctorDesignation]}>{props.designation}</Text>
      </View>
      <View style={styles.doctorFooter}>
        <Text style={[styles.text,styles.doctorDepartment]}>{props.department}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  doctorContainer: {
    height: 100,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderWidth:1,
    borderColor:"rgba(229, 57, 255, 0.2)",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginTop:10,
  },
  doctorAvatar: {
    flex: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    padding:8,
  },
  text: {
    fontFamily: 'Sans',
  },
  doctorPrefix: {
    fontSize: 13,
    color: "white",
  },
  doctorDetails: {
    flex: 4,
    marginHorizontal: 10,
  },
  doctorName: {
    color: "white",
    fontSize: 16,
    lineHeight: 28,
  },
  doctorDesignation: {
    color: "white",
    fontSize: 12,
    lineHeight: 12,
  },
  doctorFooter: {
    flex: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    elevation: 8,
  },
  doctorDepartment: {
    fontSize: 12,
    lineHeight: 12,
    color: "white",
  },
});
