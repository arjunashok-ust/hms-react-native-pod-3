import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PatientProfile } from "../features/auth/types";

interface Props {
  profile: PatientProfile | null;
}

export default function HealthSummaryCard({ profile }: Props) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.cardTitle}>🩺 Health Summary</Text>
      <Text style={styles.summaryText}>
        Blood Group :{" "}
        <Text style={styles.summaryValue}>{profile?.bloodGroup || "N/A"}</Text>
      </Text>
      <Text style={styles.summaryText}>
        Allergies :{" "}
        <Text style={styles.summaryValue}>
          {profile?.allergies && profile.allergies.length > 0
            ? profile.allergies.join(", ")
            : "None"}
        </Text>
      </Text>
      <Text style={styles.summaryText}>
        Emergency Contact :{" "}
        <Text style={styles.summaryValue}>
          {profile?.emergencyContact || "Not set"}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20, // Increased border radius for softer look
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, // Very soft shadow
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    color: "#1E1E3F", // Navy Blue
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  summaryText: {
    color: "#6B7280", // Gray text for labels
    fontSize: 15,
    marginBottom: 12,
  },
  summaryValue: {
    color: "#4B5563", // Slightly darker gray for values
    fontWeight: "500",
  },
});
