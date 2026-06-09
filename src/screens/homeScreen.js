import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { getPatient, clearStorage } from "../storage/authStorage";
import { getAllDoctors } from "../api/patientApi";
import { getPatientAppointments } from "../api/patientApi";
import { getToken } from "../storage/authStorage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const HomeScreen = ({ navigation }) => {
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useFocusEffect(
  useCallback(() => {
    loadPatient();
    loadDoctors();
    loadAppointments();
  }, [])
);

  const loadPatient = async () => {
    const patientData = await getPatient();
    setPatient(patientData);
  };
  const loadDoctors = async () => {
    const response = await getAllDoctors();
    setDoctors(response.doctors);
  };
  const handleLogout = async () => {
    await clearStorage();
    navigation.navigate("Login");
  };
  const loadAppointments = async () => {
  try {
    const token = await getToken();
    const response = await getPatientAppointments(token);
    console.log("APPOINTMENTS RESPONSE:", response);
    setAppointments(response.data || []);
  } catch (error) {
    console.log("APPOINTMENT ERROR:", error.response?.data);
    setAppointments([]);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome Back</Text>
        <Text style={styles.name}>{patient?.name || "Patient"}</Text>
        <Text style={styles.uhid}> {patient?.UHID || "N/A"}</Text>
      </View>

      {/* Health Summary */}

      <View style={styles.glassCard}>
        <Text style={styles.sectionTitle}>🩺 Health Summary</Text>

        <Text style={styles.info}>
          Blood Group : {patient?.bloodGroup || "N/A"}
        </Text>

        <Text style={styles.info}>
          Allergies :{" "}
          {patient?.allergies?.length ? patient.allergies.join(", ") : "None"}
        </Text>

        <Text style={styles.info}>
          Emergency Contact : {patient?.emergencyContact || "N/A"}
        </Text>
      </View>

      {/* Upcoming Appointment */}

      <Text style={styles.sectionHeading}>📅 My Appointments</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <View
              key={appointment._id}
              style={[styles.glassCard, { width: 280, marginRight: 15 }]}
            >
              <Text style={styles.specialization}>
                {appointment.appointmentId}
              </Text>
              <Text style={styles.doctorName}>
                Dr. {appointment.doctorName}
              </Text>

              <Text style={styles.specialization}>
                {appointment.specialization}
              </Text>

              <Text style={styles.appointmentDate}>
                {new Date(appointment.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                {" | "}
                {appointment.timeSlot}
              </Text>
            </View>
          ))
        ) : (
          <View style={[styles.glassCard, { width: 280 }]}>
            <Text style={styles.info}>No appointments found.</Text>
          </View>
        )}
      </ScrollView>

      {/* Top Doctors */}

      <Text style={styles.sectionHeading}>👨‍⚕️ Our Top Doctors</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        {doctors.map((doctor) => (
          <View key={doctor._id} style={styles.doctorCard}>
            <Text style={styles.doctorCardName}>Dr. {doctor.name}</Text>
            <Text style={styles.doctorCardSpec}>{doctor.specialization}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Logout */}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#121826",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 30,
  },

  welcome: {
    color: "#FFFFFF",
    fontSize: 18,
    opacity: 0.8,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 5,
  },

  uhid: {
    color: "#FF6B6B",
    marginTop: 5,
    fontWeight: "600",
  },

  glassCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  info: {
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 10,
  },

  doctorName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  specialization: {
    color: "#FF6B6B",
    marginTop: 5,
    fontSize: 15,
  },

  appointmentDate: {
    color: "#FFFFFF",
    marginTop: 15,
    fontSize: 15,
  },

  sectionHeading: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    marginTop: 10,
  },

  doctorCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    width: 220,
    padding: 20,
    borderRadius: 20,
    marginRight: 15,
    minHeight: 120,
  },

  doctorCardName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  doctorCardSpec: {
    color: "#FF6B6B",
    marginTop: 8,
  },

  logoutButton: {
    backgroundColor: "#FF6B6B",
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
