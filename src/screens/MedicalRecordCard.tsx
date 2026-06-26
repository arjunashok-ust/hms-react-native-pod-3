import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { MedicalRecord } from "../features/auth/types";

interface MedicalRecordCardProps {
  record: MedicalRecord;
}

const MedicalRecordCard: React.FC<MedicalRecordCardProps> = ({ record }) => {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();

  const navigateToDetails = () => {
    console.log("Navigate to record:", record.recordCode);
  };

  const visitDate = new Date(record.visitDate || record.createdAt);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={navigateToDetails}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.doctorName}>{record.doctorName || "N/A"}</Text>
        <Text style={styles.date}>
          {visitDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.diagnosisLabel}>Diagnosis</Text>
        <Text style={styles.diagnosisText} numberOfLines={2}>
          {record.diagnosis || "No diagnosis provided."}
        </Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.statusText}>Status: {record.status}</Text>
        <Ionicons name="chevron-forward" size={20} color="#6C4EDB" />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(MedicalRecordCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    fontFamily: "Lexend",
    color: "#1E1E3F",
    fontWeight: "600",
  },
  date: {
    fontSize: 13,
    fontFamily: "Lexend",
    color: "#6B7280",
  },
  cardBody: {
    marginBottom: 12,
  },
  diagnosisLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Lexend",
    marginBottom: 4,
  },
  diagnosisText: {
    fontSize: 14,
    fontFamily: "Lexend",
    color: "#4B5563",
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Lexend",
    color: "#10B981",
    fontWeight: "500",
  },
});
