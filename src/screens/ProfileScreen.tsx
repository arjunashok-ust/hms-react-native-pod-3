import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { PatientProfile } from "../features/auth/types";
import ProfileField from "../components/ProfileField";
import PatientForm from "../components/PatientForm";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileString = await SecureStore.getItemAsync("patient_profile");
      if (profileString) {
        setProfile(JSON.parse(profileString));
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data: any) => {
    setIsSaving(true);
    try {
      const token = await SecureStore.getItemAsync("patient_jwt");

      // Map the form data back to the schema the backend expects
      const payload = {
        phone: data.phone.trim(),
        gender: data.gender,
        dob: data.dob.toISOString().split("T")[0],
        bloodGroup: data.bloodGroup,
        allergies: data.allergies
          ? data.allergies.split(",").map((a: string) => a.trim())
          : [],
        emergencyContact: data.emergencyContact.trim(),
        address: {
          line1: data.line1.trim(),
          line2: data.line2.trim(),
          state: data.state.trim(),
          pincode: Number.parseInt(data.pincode, 10),
        },
      };

      const targetUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/patients/${profile?.UHID}`;
      console.log("🚨 OUTBOUND PUT URL:", targetUrl);
      console.log("🚨 AUTH TOKEN PRESENT:", !!token);

      const response = await axios.put(targetUrl, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state and SecureStore with new data
      const updatedProfile = { ...profile, ...payload };
      setProfile(updatedProfile as PatientProfile);
      await SecureStore.setItemAsync(
        "patient_profile",
        JSON.stringify(updatedProfile),
      );

      Alert.alert("Success", "Profile updated successfully.");
      setIsEditing(false); // Switch back to view mode
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Convert raw string array to a single string for the form
  const getInitialEditValues = () => {
    if (!profile) return {};
    return {
      ...profile,
      dob: profile.dob ? new Date(profile.dob) : undefined,
      allergies: profile.allergies ? profile.allergies.join(", ") : "",
      line1: profile.address?.line1 || "",
      line2: profile.address?.line2 || "",
      state: profile.address?.state || "",
      pincode: profile.address?.pincode?.toString() || "",
    };
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#6C4EDB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section (Matches Screenshot) */}
        <View style={styles.header}>
          {/* Settings Icon mapping */}
          <TouchableOpacity style={styles.settingsIcon}>
            <Text style={{ fontSize: 20 }}>⚙️</Text>
          </TouchableOpacity>

          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <Text style={styles.nameText}>{profile?.name}</Text>

          <TouchableOpacity
            style={[styles.editButton, isEditing && styles.cancelButton]}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* View / Edit Mode Toggle */}
        {isEditing ? (
          <PatientForm
            initialValues={getInitialEditValues()}
            onSubmit={handleUpdateProfile}
            isLoading={isSaving}
            buttonText="Save Changes"
            isEditMode={true} // Triggers the disabled name/email logic
          />
        ) : (
          <View style={styles.card}>
            <ProfileField label="UHID" value={profile?.UHID} />
            <ProfileField label="Email" value={profile?.email} />
            <ProfileField label="Name" value={profile?.name} />
            <ProfileField label="Phone" value={profile?.phone} />
            <ProfileField label="Gender" value={profile?.gender} />
            <ProfileField
              label="Date of Birth"
              value={
                profile?.dob ? new Date(profile.dob).toLocaleDateString() : ""
              }
            />
            <ProfileField label="Blood Group" value={profile?.bloodGroup} />
            <ProfileField
              label="Emergency Contact"
              value={profile?.emergencyContact}
            />
            <ProfileField
              label="Allergies"
              value={profile?.allergies?.join(", ")}
            />
            <ProfileField label="Address" value={profile?.address?.line1} />
            <ProfileField
              label="State / City"
              value={profile?.address?.state}
            />
            <ProfileField
              label="Postcode"
              value={profile?.address?.pincode?.toString()}
              hideBorder
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 24, position: "relative" },
  settingsIcon: {
    position: "absolute",
    right: 0,
    top: 20,
    backgroundColor: "#E5E7EB",
    padding: 8,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#6C4EDB", // Deep purple
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 10,
  },
  avatarIcon: { fontSize: 40, color: "#FFFFFF" },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E1E3F",
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: "#6C4EDB",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "#EF4444" }, // Red for cancel
  editButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
});
