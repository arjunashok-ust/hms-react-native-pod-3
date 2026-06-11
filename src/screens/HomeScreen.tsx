import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { PatientProfile } from "../features/auth/types";
import AppointmentCard, { Appointment } from "../components/AppointmentCard";
import TopDoctors, { Doctor } from "../components/TopDoctors";
import HealthSummaryCard from "../components/HealthSummaryCard";
import { RootStackParamList } from "../types/navigation";

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<any>>(); // Using any to handle nested tab navigation targets
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<PatientProfile | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = await SecureStore.getItemAsync("patient_jwt");
      const profileString = await SecureStore.getItemAsync("patient_profile");

      if (!token || !profileString) {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        return;
      }

      setProfile(JSON.parse(profileString));

      const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const [appointmentsRes, doctorsRes] = await Promise.all([
        axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/api/appointment/my-appointments`,
          axiosConfig,
        ),
        axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/api/appointment/doctors`,
          axiosConfig,
        ),
      ]);

      setAppointments(appointmentsRes.data);
      setDoctors(doctorsRes.data);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      Alert.alert("Error", "Could not load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back 👋</Text>
            <Text style={styles.patientName}>{profile?.name}</Text>
            <Text style={styles.uhid}>{profile?.UHID}</Text>
          </View>

          {/* Settings Icon routes to Profile Tab */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate("ProfileTab")}
          >
            <Text style={styles.settingsText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Health Summary Card */}
        <HealthSummaryCard profile={profile} />

        {/* My Appointments Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📅 My Appointments</Text>
        </View>

        {/* Wrap appointment blocks in touchable highlights to open the management stack */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate("AppointmentsTab", {
              screen: "ViewAppointments",
            })
          }
        >
          {appointments.length > 0 ? (
            <AppointmentCard appointment={appointments[0]} />
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No upcoming appointments. Tap to schedule.
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Top Doctors Horizontal Carousel */}
        <TopDoctors doctors={doctors} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#6B7280",
    marginTop: 12,
    fontSize: 16,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  welcomeText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "500",
  },
  patientName: {
    color: "#1E1E3F",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 4,
  },
  uhid: {
    color: "#6C4EDB",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  settingsButton: {
    backgroundColor: "#E5E7EB",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  settingsText: {
    fontSize: 20,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#1E1E3F",
    fontSize: 20,
    fontWeight: "bold",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  emptyText: {
    color: "#9CA3AF",
    fontStyle: "italic",
    fontWeight: "500",
  },
});
