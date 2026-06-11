import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export interface Doctor {
  _id: string;
  employeeCode: string;
  name: string;
  department: string;
  status: string;
  designation?: string;
  specialization?: string;
}

interface Props {
  doctors: Doctor[];
}

const formatDepartment = (dept: string) => {
  if (!dept) return "General";
  return dept;
};

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  // 🟢 Console log the exact object React is receiving for each card
  console.log(`Data for ${doctor.name}:`, {
    designation: doctor.designation,
    specialization: doctor.specialization,
  });

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      <View>
        <Text style={styles.doctorName} numberOfLines={2}>
          {doctor.name}
        </Text>
        {/* 🟢 Removed the hiding logic. If it's missing, it will clearly say so on screen. */}
        <Text style={styles.designation} numberOfLines={1}>
          {doctor.designation ? doctor.designation : "⚠️ No Designation Data"}
        </Text>
      </View>

      <View>
        <Text style={styles.department} numberOfLines={1}>
          {formatDepartment(doctor.department)}
        </Text>
        <Text style={styles.specialization} numberOfLines={1}>
          {doctor.specialization
            ? doctor.specialization
            : "⚠️ No Specialization Data"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function TopDoctors({ doctors }: Readonly<Props>) {
  return (
    <View style={styles.container}>
      <View style={styles.doctorHeader}>
        <FontAwesome6 name="user-doctor" size={20} color="#6C4EDB" />
        <Text style={styles.sectionTitle}>Our Top Doctors</Text>
      </View>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <DoctorCard doctor={item} />}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  doctorHeader: {
    paddingHorizontal: 20, // Aligned with the sectionTitle padding
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#1E1E3F",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10, // Adds space between the icon and the title
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    width: 170,  // Increased slightly to fit longer text
    height: 130, // Increased height to accommodate the 2 new rows
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  doctorName: {
    color: "#1E1E3F",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 22,
  },
  designation: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  department: {
    color: "#6C4EDB",
    fontSize: 13,
    fontWeight: "bold",
  },
  specialization: {
    color: "#4B5563",
    fontSize: 11,
    marginTop: 2,
  },
});