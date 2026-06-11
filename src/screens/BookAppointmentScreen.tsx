import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  NavigationProp,
  CompositeNavigationProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import {
  RootStackParamList,
  AppointmentStackParamList,
} from "../types/navigation";

// Import extracted form component
import AppointmentForm from "../components/AppointmentForm";

export default function BookAppointmentScreen() {
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        NativeStackNavigationProp<AppointmentStackParamList, "BookAppointment">,
        NativeStackNavigationProp<RootStackParamList>
      >
    >();

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadProfileContext();
  }, []);

  const loadProfileContext = async () => {
    const profileStr = await SecureStore.getItemAsync("patient_profile");
    if (profileStr) setProfile(JSON.parse(profileStr));
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
          <Text style={styles.mainTitle}>Create your,</Text>
          <Text style={styles.boldTitle}>APPOINTMENT</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>here.</Text>
          </View>

          {/* Render the reusable form with clear success callback transitions */}
          <AppointmentForm
            patientUHID={profile?.UHID}
            isEditMode={false}
            onSuccess={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "ViewAppointments" }], // Makes the list view the new root of this stack
              })
            }
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#E6F0F2" },
  safe: { flex: 1 },
  container: { flex: 1, padding: 24, justifyContent: "center" },
  mainTitle: { fontSize: 40, fontWeight: "300", color: "#1E1E3F" },
  boldTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#4B1D76",
    marginBottom: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#4B1D76",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  tagText: { color: "#1E1E3F", fontWeight: "600" },
});
