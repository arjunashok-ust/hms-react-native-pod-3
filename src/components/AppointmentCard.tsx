import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface Appointment {
  _id: string;
  appointmentCode: string;
  date: string;
  timeSlot: string;
  status: string;
  doctorName: string;
  doctorDept: string;
  doctorSpecialization: string;
}

interface Props {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment }: Readonly<Props>) {
  const formatDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatSpecialization = (spec: string) => {
    if (!spec) return "N/A";
    return spec.charAt(0).toUpperCase() + spec.slice(1);
  };

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        <Text style={styles.code}>{appointment.appointmentCode}</Text>
        <Text style={styles.doctorName}>{appointment.doctorName}</Text>
        <Text style={styles.specialization}>
          {formatSpecialization(appointment.doctorSpecialization)}
        </Text>

        <Text style={styles.dateTime}>
          {formatDate(appointment.date)} | {appointment.timeSlot}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  code: {
    color: "#6C4EDB",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
  },
  doctorName: {
    color: "#1E1E3F",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  specialization: {
    color: "#6C4EDB",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  dateTime: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "500",
  },
});
