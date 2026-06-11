import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  NavigationProp,
  useIsFocused,
} from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

// 🟢 Import the extracted component
import ManageAppointmentCard from "../components/ManageAppointmentCard";

export default function ViewAppointmentsScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const isFocused = useIsFocused();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      fetchAppointments();
    }
  }, [isFocused]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync("patient_jwt");
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/appointment/my-appointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAppointments(res.data);
    } catch (err) {
      console.error("Fetch Appointments Failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (appointment: any) => {
    navigation.navigate("EditAppointment", {
      appointmentData: {
        appointmentCode: appointment.appointmentCode,
        doctorEmployeeID: appointment.doctorEmployeeID,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
      },
    });
  };

  // Safe Deletion framework
  const handleDelete = (appointment: any) => {
    Alert.alert(
      "Cancel Appointment",
      `Are you sure you want to cancel your appointment with ${appointment.doctorName}?`,
      [
        { text: "No, keep it", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              // 1. Retrieve the secure token
              const token = await SecureStore.getItemAsync("patient_jwt");

              // 2. Execute the DELETE network transaction
              await axios.delete(
                `${process.env.EXPO_PUBLIC_API_URL}/api/appointment/${appointment.appointmentCode}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              );

              // 3. Notify the user and refresh the local list state
              Alert.alert("Success", "Appointment cancelled successfully.");
              fetchAppointments();
            } catch (err: any) {
              console.error("Delete Appointment Failed:", err);
              Alert.alert(
                "Cancellation Failed",
                err.response?.data?.message ||
                  "Could not connect to the server to cancel the appointment.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1551076805-e18690c5e53b?q=80&w=2000",
      }}
      style={styles.bg}
      imageStyle={{ opacity: 0.15 }}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.mainTitle}>View your,</Text>
          <Text style={styles.boldTitle}>APPOINTMENTS</Text>

          <TouchableOpacity
            style={styles.bookTriggerBtn}
            onPress={() => navigation.navigate("BookAppointment")}
          >
            <Text style={styles.bookTriggerText}>➕ Book New Appointment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate("HomeTab")}
          >
            <Text style={styles.backText}>⬅️ GO BACK TO DASHBOARD</Text>
          </TouchableOpacity>

          {isLoading ? (
            <ActivityIndicator size="large" color="#4B1D76" />
          ) : (
            <FlatList
              data={appointments}
              keyExtractor={(item) => item.appointmentCode || item._id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <ManageAppointmentCard
                  appointment={item}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item)}
                />
              )}
              ListEmptyComponent={
                <View style={styles.emptyListCard}>
                  <Text style={styles.emptyListText}>
                    No appointment logs found.
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#E6F0F2" },
  safe: { flex: 1 },
  container: { flex: 1, padding: 24 },
  mainTitle: { fontSize: 36, fontWeight: "300", color: "#1E1E3F" },
  boldTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4B1D76",
    marginBottom: 16,
  },
  bookTriggerBtn: {
    backgroundColor: "#6C4EDB",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#6C4EDB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  bookTriggerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  backBtn: {
    backgroundColor: "#E5E7EB",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  backText: { color: "#1E1E3F", fontWeight: "bold", fontSize: 13 },
  emptyListCard: {
    padding: 40,
    alignItems: "center",
  },
  emptyListText: {
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});
