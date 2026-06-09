import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { loginPatient } from "../api/patientApi";
import { saveLoginData } from "../storage/authStorage";
import { validateEmail, validatePassword } from "../utils/validation";

const LoginScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const validators = {
    email: validateEmail,
    password: validatePassword,
  };

  const validate = () => {
    let newErrors = {};

    Object.keys(validators).forEach((key) => {
      newErrors[key] = validators[key](form[key]);
    });

    setErrors(newErrors);

    return Object.values(newErrors).every((e) => !e);
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);

    const requestBody = {
      email: form.email,
      password: form.password,
    };

    try {
      const response = await loginPatient(requestBody);
      alert(response.message);
      await saveLoginData(response.token, response.user, response.patient);
      navigation.navigate("Main");
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome</Text>

      <Text style={styles.headingHighlight}>Back!</Text>

      <Text style={styles.subHeading}>Login to access your HMS account.</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Patient Login</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={form.email}
          onChangeText={(value) => handleChange("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <TextInput
          placeholder="Password"
          placeholderTextColor="rgba(255,255,255,0.6)"
          secureTextEntry
          value={form.password}
          onChangeText={(value) => handleChange("password", value)}
          style={styles.input}
        />
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging In..." : "Login"}
          </Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={{ color: "#FFFFFF" }}>Don't have an account?</Text>

          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupText}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121826",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "700",
  },

  headingHighlight: {
    color: "#FF6B6B",
    fontSize: 50,
    fontWeight: "800",
    marginBottom: 8,
  },

  subHeading: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 30,
    padding: 25,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
  },

  input: {
    height: 55,
    color: "#FFFFFF",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.4)",
    marginBottom: 20,
  },

  error: {
    color: "#FF8A8A",
    fontSize: 12,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#FF6B6B",
    height: 58,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  signupText: {
    color: "#FF6B6B",
    fontWeight: "700",
  },
});
