import React from "react";
import { View, Text, StyleSheet } from "react-native";

const getStatusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "#F59E0B";

    case "BOOKED":
      return "#10B981";

    case "CANCELLED":
      return "#EF4444";

    case "COMPLETED":
      return "#6B46C1";

    default:
      return "#1c5cde";
  }
};

const AppointmentStatusCard = ({ appointment }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.doctorName}>Dr. {appointment.doctorName}</Text>

      <Text style={styles.specialization}>{appointment.specialization}</Text>

      <Text style={styles.appointmentDate}>
        {new Date(appointment.date).toLocaleDateString()} • {appointment.timeSlot}
      </Text>

      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(appointment.status) },
        ]}
      >
        <Text style={styles.statusText}>{appointment.status}</Text>
      </View>
    </View>
  );
};

export default React.memo(AppointmentStatusCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    width: 220,
    padding: 20,
    borderRadius: 25,
    marginRight: 15,
    elevation: 3,
  },

  doctorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C2143",
  },

  specialization: {
    fontSize: 14,
    color: "#6B46C1",
    marginTop: 6,
    fontWeight: "600",
  },

  appointmentDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 15,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
  },

  statusText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
});
