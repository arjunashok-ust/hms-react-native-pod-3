import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather, FontAwesome6 } from "@expo/vector-icons";

interface ManageAppointmentCardProps {
  appointment: any;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ManageAppointmentCard({
  appointment,
  onEdit,
  onDelete,
}: Readonly<ManageAppointmentCardProps>) {
  const isScheduled = appointment.status === "Scheduled";

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {appointment.doctorName
              ? appointment.doctorName.substring(4, 6).toUpperCase()
              : "DR"}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.docName}>
            {appointment.doctorName || "Unknown Doctor"}
          </Text>
          <Text style={styles.deptText}>
            {appointment.doctorSpecialization ||
              appointment.doctorDept ||
              "General Medicine"}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            { backgroundColor: isScheduled ? "#c5ead5" : "#f7d7a6" },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isScheduled ? "green" : "#9e6002" },
            ]}
          >
            {isScheduled ? "Booked" : "Pending"}
          </Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            {appointment.date ? new Date(appointment.date).toDateString() : ""}
          </Text>
        </View>

        <View style={styles.pill}>
          <Text style={styles.pillText}>{appointment.timeSlot}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
          <View style={styles.actionButton}>
            <Feather name="edit-3" size={18} color="blue" />
            <Text style={[styles.actionText, { color: "blue" }]}> Edit</Text>
          </View>
        </TouchableOpacity>

        {/* We use a slight red tint for the delete text to indicate a destructive action */}
        <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
          <View style={styles.actionButton}>
            <FontAwesome6 name="trash-can" size={18} color="red" />
            <Text style={[styles.actionText, { color: "#EF4444" }]}>
              Delete
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4B1D76",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#FFF", fontWeight: "bold" },
  detailsContainer: { flex: 1 },
  docName: { fontSize: 18, fontWeight: "bold", color: "#1E1E3F" },
  deptText: { fontSize: 14, color: "#9CA3AF" },
  badge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  badgeText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
  timeText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  actionBtn: {
    flex: 0.48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  actionText: { fontWeight: "600", color: "#4B5563" },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeContainer: {
    flexDirection: "row",
    gap: 8, // spacing between pills (use marginRight if older RN)
    alignItems: "center",
  },

  pill: {
    backgroundColor: "#E0E7FF", // light blue (you can change)
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20, // makes it pill-shaped
  },

  pillText: {
    color: "#1E1E3F",
    fontSize: 12,
    fontWeight: "600",
  },
});
