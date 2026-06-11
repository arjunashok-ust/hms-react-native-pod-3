import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

export interface Doctor {
  _id: string;
  employeeCode: string;
  name: string;
  department: string;
  status: string;
}

interface Props {
  doctors: Doctor[];
}

export default function TopDoctors({ doctors }: Props) {
  const formatDepartment = (dept: string) => {
    if (!dept) return "General";
    return dept; // Returning raw string to match UI "Open Heart Surgery" style
  };

  const renderDoctorCard = ({ item }: { item: Doctor }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      <Text style={styles.doctorName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.department} numberOfLines={1}>
        {formatDepartment(item.department)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>👨‍⚕️ Our Top Doctors</Text>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item._id}
        renderItem={renderDoctorCard}
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
  sectionTitle: {
    color: "#1E1E3F", // Navy Blue
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    width: 160,
    height: 110,
    justifyContent: "space-between", // Spaces name at top, dept at bottom
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  doctorName: {
    color: "#1E1E3F", // Navy Blue
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 22,
  },
  department: {
    color: "#6C4EDB", // Purple accent
    fontSize: 13,
    fontWeight: "600",
  },
});
