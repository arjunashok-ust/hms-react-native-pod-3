import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  ActivityIndicator, // 🟢 Added missing import
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { PatientProfile } from "../features/auth/types";
import AppointmentCard, { Appointment } from "../components/AppointmentCard";
import TopDoctors, { Doctor } from "../components/TopDoctors";
import HealthSummaryCard from "../components/HealthSummaryCard";
import { appointmentService } from "../services/appointmentService";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const backgroundImage = require("../../assets/images/hospital3.jpg");
  const navigation = useNavigation<NavigationProp<any>>();
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

      const [appointmentsData, doctorsData] = await Promise.all([
        appointmentService.getMyAppointments(),
        appointmentService.getDoctors(),
      ]);

      setAppointments(appointmentsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      Alert.alert("Error", "Could not load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.3 }}
    >
      <SafeAreaView style={styles.container}>
        {/* 🟢 FIXED: Actively using isLoading to show a loading screen */}
        {isLoading ? (
          <View style={[styles.container, styles.center]}>
            <ActivityIndicator size="large" color="#6C4EDB" />
            <Text style={styles.loadingText}>Loading your dashboard...</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.patientName}>{profile?.name}</Text>
                <Text style={styles.uhid}>{profile?.UHID}</Text>
              </View>
            </View>

            <HealthSummaryCard profile={profile} />

            <View style={styles.sectionHeader}>
              <Ionicons
                name="calendar-clear-outline"
                size={20}
                color="#6C4EDB"
              />
              <Text style={styles.sectionTitle}>My Appointments</Text>
            </View>

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

            <TopDoctors doctors={doctors} />
          </ScrollView>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent", // 🟢 Fixed so background image shows through correctly
  },
  backgroundImage: {
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
    fontWeight: "500",
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
    fontSize: 45,
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
    backgroundColor: "#e6e6fb",
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
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 8,
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
