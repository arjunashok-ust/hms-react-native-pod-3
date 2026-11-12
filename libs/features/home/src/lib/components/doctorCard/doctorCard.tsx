import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

const DoctorCardComponent = (props: any) => {
  return (
    <TouchableOpacity style={styles.doctorContainer} onPress={props.onPress}>
      <View
        style={styles.doctorAvatar}
      >
        <Text style={[styles.text, styles.doctorPrefix]}>{props.prefix}</Text>
      </View>
      <View style={styles.doctorDetails}>
        <Text style={[styles.text, styles.doctorName]}>{props.name}</Text>
        <Text style={[styles.text, styles.doctorDesignation]}>
          {props.designation}
        </Text>
      </View>
      <View style={styles.doctorFooter}>
        <Text style={[styles.text, styles.doctorSpecialization]}>
          {props.specialization}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const DoctorCard = React.memo(DoctorCardComponent);

