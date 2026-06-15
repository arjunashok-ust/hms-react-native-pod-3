import React, { memo } from "react";
import { View, Text } from "react-native";

const DoctorCard = ({ doctor }) => {
  return (
    <View>
      <Text>Dr. {doctor.name}</Text>

      <Text>{doctor.specialization}</Text>
    </View>
  );
};

export default memo(DoctorCard);
