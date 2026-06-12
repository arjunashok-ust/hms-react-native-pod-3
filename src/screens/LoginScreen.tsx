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
import * as SecureStore from "expo-secure-store";
import { RootStackParamList } from "../types/navigation";
import { authService } from "../services/authService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const backgroundImage = require("../../assets/images/hospital3.jpg");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>(""); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLoginPress = async () => {
    const trimmedEmail = email.trim();

    if (trimmedEmail === "" || password === "") {
      Alert.alert("Validation Error", "Please enter both email and password");
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const data = await authService.login(trimmedEmail, password);

      const token = data.token;
      const profile = data.user.profile;

      if (!token) throw new Error("Server did not return a token.");

      await SecureStore.setItemAsync("patient_jwt", token);
      await SecureStore.setItemAsync(
        "patient_profile",
        JSON.stringify(profile),
      );

      navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
    } catch (error: any) {
      Alert.alert("Authentication Failed", error.message);
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.headerSection}>
            <Text style={styles.headerTitleLine1}>Welcome Back,</Text>
            <Text style={styles.headerTitleLine2}>Sign In.</Text>
          </View>

          <View style={styles.card}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError("");
              }}
              style={[styles.input, emailError ? styles.inputError : null]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}

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
    marginTop: -40,
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
  inputError: {
    borderColor: "#ef4444",
    borderWidth: 1,
    marginBottom: 8, 
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 8,
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
