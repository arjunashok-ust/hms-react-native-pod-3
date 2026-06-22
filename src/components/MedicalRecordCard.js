import React, { memo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const MedicalRecordCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.recordCard}
      activeOpacity={0.85}
      onPress={() => setExpanded((prev) => !prev)}
    >
      <View style={styles.headerRow}>
        <Text style={styles.recordCode}>{item.recordCode}</Text>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.doctorName}>Dr. {item.doctorName}</Text>

      <Text style={styles.specialization}>{item.specialization}</Text>

      <Text style={styles.detail}>
        Visit Date: {new Date(item.visitDate).toLocaleDateString()}
      </Text>

      {item.diagnosis ? (
        <Text style={styles.detail}>Diagnosis: {item.diagnosis}</Text>
      ) : null}

      {expanded && (
        <View style={styles.expandedSection}>
          {item.complaint ? (
            <Text style={styles.detail}>Complaint: {item.complaint}</Text>
          ) : null}

          {item.symptoms ? (
            <Text style={styles.detail}>Symptoms: {item.symptoms}</Text>
          ) : null}

          {item.medications?.length > 0 && (
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Medications</Text>

              {item.medications.map((med, index) => (
                <Text key={index} style={styles.detail}>
                  • {med.name} — {med.dosage}, {med.frequency} ({med.duration})
                </Text>
              ))}
            </View>
          )}

          {item.medicalObservations?.length > 0 && (
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Observations</Text>

              {item.medicalObservations.map((obs, index) => (
                <Text key={index} style={styles.detail}>
                  • {obs.metricName}: {obs.metricValue}
                </Text>
              ))}
            </View>
          )}

          {item.notes ? (
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Notes</Text>
              <Text style={styles.detail}>{item.notes}</Text>
            </View>
          ) : null}
        </View>
      )}

      <Text style={styles.toggleText}>
        {expanded ? "Show Less ▲" : "View Details ▼"}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(MedicalRecordCard);

const styles = StyleSheet.create({
  recordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  recordCode: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B46C1",
  },

  statusBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  doctorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C2143",
    marginTop: 10,
  },

  specialization: {
    color: "#6B46C1",
    marginBottom: 10,
  },

  detail: {
    color: "#374151",
    marginBottom: 4,
  },

  expandedSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
  },

  subSection: {
    marginTop: 10,
  },

  subSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1C2143",
    marginBottom: 4,
    textTransform: "uppercase",
  },

  toggleText: {
    marginTop: 12,
    color: "#6B46C1",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },
});
