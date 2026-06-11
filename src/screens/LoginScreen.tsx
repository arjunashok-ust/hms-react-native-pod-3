import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { RootStackParamList } from "../types/navigation";
import { LoginResponse } from "../features/auth/types";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLoginPress = async () => {
    if (email.trim() === "" || password === "") {
      Alert.alert("Validation Error", "Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`,
        {
          email: email.trim(),
          password: password,
        },
      );
      const token = response.data.token;
      const profile = response.data.user.profile;

      if (!token) throw new Error("Server did not return a token.");

      await SecureStore.setItemAsync("patient_jwt", token);
      await SecureStore.setItemAsync(
        "patient_profile",
        JSON.stringify(profile),
      );

      navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage =
          error.response?.data?.message ||
          "Invalid credentials or server error.";
        Alert.alert("Authentication Failed", serverMessage);
      } else {
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
        <View style={styles.container}>
          {/* Top Branding Section */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitleLine1}>Welcome Back,</Text>
            <Text style={styles.headerTitleLine2}>Sign In.</Text>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitleText}>
                Access your health portal securely.
              </Text>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={true}
            />

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLoginPress}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={styles.linkButton}
            >
              <Text style={styles.linkTextRegular}>
                Don't have an account?{" "}
                <Text style={styles.linkTextPurple}>Register</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: "#E6F0F2",
  },
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  headerSection: {
    marginBottom: 40,
    marginTop: -40, // Pulls it up slightly to balance the vertical space
  },
  headerTitleLine1: {
    fontSize: 40,
    fontWeight: "300",
    color: "#1E1E3F",
  },
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
  subtitleText: {
    color: "#1E1E3F",
    fontSize: 14,
    fontWeight: "500",
  },
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
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#1E1E3F",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  button: {
    backgroundColor: "#4B1D76",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#4B1D76",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: { backgroundColor: "#8b5cf6" },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  linkButton: { marginTop: 24, alignItems: "center" },
  linkTextRegular: { color: "#1E1E3F", fontSize: 15, fontWeight: "500" },
  linkTextPurple: { color: "#4B1D76", fontWeight: "bold" },
});
