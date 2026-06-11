import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { RootStackParamList } from "../types/navigation";

// Import the extracted component
import PatientForm from "../components/PatientForm";

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);

  // Default empty values for Signup
  const initialSignupValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: undefined,
    dob: undefined,
    bloodGroup: "",
    allergies: "",
    emergencyContact: "",
    line1: "",
    line2: "",
    state: "",
    pincode: "",
  };

 const handleRegisterSubmit = async (data: any) => {
   setIsLoading(true);
   try {
     // 1. Safe Date Parsing (Handles both raw string timestamps and Date Objects)
     let formattedDob = "";
     if (data.dob) {
       const dateObj = new Date(data.dob);
       formattedDob = !isNaN(dateObj.getTime())
         ? dateObj.toISOString().split("T")[0]
         : String(data.dob).split("T")[0];
     }

     // 2. Clear out empty string values to prevent Picker fallbacks from saving blank strings
     const formattedBloodGroup =
       data.bloodGroup && data.bloodGroup.trim() !== ""
         ? data.bloodGroup
         : null;

     // 3. String Array conversion wrapper for Allergies
     const formattedAllergies =
       data.allergies && data.allergies.trim() !== ""
         ? data.allergies
             .split(",")
             .map((a: string) => a.trim())
             .filter((a: string) => a.length > 0)
         : [];

     const payload = {
       name: data.name.trim(),
       email: data.email.trim().toLowerCase(),
       phone: data.phone.trim(),
       password: data.password,
       gender: data.gender,
       dob: formattedDob,
       bloodGroup: formattedBloodGroup,
       allergies: formattedAllergies,
       emergencyContact: data.emergencyContact.trim(),
       address: {
         line1: data.line1.trim(),
         line2: data.line2?.trim() || "",
         state: data.state.trim(),
         pincode: Number.parseInt(data.pincode, 10),
       },
     };

     // 4. Trace outbound shape right before network execution
     console.log(
       "🚀 FINAL SANITIZED AXIOS PAYLOAD:",
       JSON.stringify(payload, null, 2),
     );

     await axios.post(
       `${process.env.EXPO_PUBLIC_API_URL}/api/patients/mobile-register`,
       payload,
     );

     Alert.alert("Success", "Account created successfully.");
     navigation.navigate("Login");
   } catch (error) {
     if (axios.isAxiosError(error)) {
       console.error("❌ BACKEND ERROR RESPONSE:", error.response?.data);
       const serverMessage =
         error.response?.data?.message || "Registration failed.";
       Alert.alert("Error", serverMessage);
     } else {
       console.error("❌ NATIVE SYSTEM CRASH:", error);
       Alert.alert("System Error", "An unexpected error occurred.");
     }
   } finally {
     setIsLoading(false);
   }
 };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1551076805-e18690c5e53b?q=80&w=2000&auto=format&fit=crop",
      }}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.3 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerSection}>
            <Text style={styles.headerTitleLine1}>New To,</Text>
            <Text style={styles.headerTitleLine2}>HMS?</Text>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitleText}>
                Create your account to get started.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            {/* The Reusable Form */}
            <PatientForm
              initialValues={initialSignupValues}
              onSubmit={handleRegisterSubmit}
              isLoading={isLoading}
              buttonText="Signup"
              isEditMode={false} // Enforces password validation
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.linkButton}
            >
              <Text style={styles.linkTextRegular}>
                Already have an account?{" "}
                <Text style={styles.linkTextPurple}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, backgroundColor: "#E6F0F2" },
  safeArea: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 20 },
  headerSection: { marginBottom: 40, marginTop: 20 },
  headerTitleLine1: { fontSize: 40, fontWeight: "300", color: "#1E1E3F" },
  headerTitleLine2: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#4B1D76",
    marginBottom: 10,
  },
  subtitleContainer: {
    borderWidth: 1,
    borderColor: "#4B1D76",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  subtitleText: { color: "#1E1E3F", fontSize: 14, fontWeight: "500" },
  card: {
    backgroundColor: "#F8F9FA",
    padding: 24,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  linkButton: { marginTop: 24, alignItems: "center" },
  linkTextRegular: { color: "#1E1E3F", fontSize: 15, fontWeight: "500" },
  linkTextPurple: { color: "#4B1D76", fontWeight: "bold" },
});
