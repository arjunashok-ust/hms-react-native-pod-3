import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import { registerPatient } from "../api/patientApi";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateRequired,
  validatePostcode,
} from "../utils/validation";

const SignupScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    allergies: "",
    line1: "",
    city: "",
    postcode: "",
    emergencyContact: "",
  });

  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  //  Validator map
  const validators = {
    email: validateEmail,
    password: validatePassword,
    name: validateName,
    phone: validatePhone,
    gender: (value) => validateRequired(value, "Gender"),
    dob: (value) => validateRequired(value, "Date of Birth"),
    bloodGroup: (value) => validateRequired(value, "Blood Group"),
    line1: (value) => validateRequired(value, "Address"),
    city: (value) => validateRequired(value, "City"),
    postcode: validatePostcode,
    emergencyContact: validatePhone,
  };

  // Validate full form
  const validate = () => {
    let newErrors = {};

    Object.keys(validators).forEach((key) => {
      newErrors[key] = validators[key](form[key]);
    });

    setErrors(newErrors);

    return Object.values(newErrors).every((e) => !e);
  };

  const [loading, setLoading] = useState(false);
  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);

    const requestBody = {
      email: form.email,
      password: form.password,
      name: form.name,
      phone: form.phone,
      gender: form.gender,
      date_of_birth: form.dob,
      bloodGroup: form.bloodGroup,
      allergies: form.allergies
        ? form.allergies.split(",").map((a) => a.trim())
        : [],
      address: {
        line1: form.line1,
        city: form.city,
        postcode: form.postcode,
      },
      emergencyContact: form.emergencyContact,
    };

    try {
      const response = await registerPatient(requestBody);
      alert(response.message);
      navigation.navigate("Login");
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      alert(JSON.stringify(error.response?.data));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>New To,</Text>

      <Text style={styles.headingHighlight}>HMS?</Text>

      <Text style={styles.subHeading}>Create your account to get started.</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Patient Registration</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={form.email}
          onChangeText={(value) => handleChange("email", value)}
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

        <TextInput
          placeholder="Name"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={form.name}
          onChangeText={(value) => handleChange("name", value)}
          style={styles.input}
        />
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}

        <TextInput
          placeholder="Phone"
          placeholderTextColor="rgba(255,255,255,0.6)"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(value) => handleChange("phone", value)}
          style={styles.input}
        />
        {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.gender}
            onValueChange={(value) => handleChange("gender", value)}
            dropdownIconColor="#FFFFFF"
            style={{ color: "#FFFFFF" }}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text
            style={{
              color: form.dob ? "#FFFFFF" : "rgba(255,255,255,0.6)",
              fontSize: 16,
              lineHeight: 55,
            }}
          >
            {form.dob || "Select Date of Birth"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onValueChange={(event, selectedDate) => {
              setShowDatePicker(false);

              if (selectedDate) {
                const formattedDate = selectedDate.toISOString().split("T")[0];

                handleChange("dob", formattedDate);
              }
            }}
          />
        )}
        {errors.dob && <Text style={styles.error}>{errors.dob}</Text>}

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.bloodGroup}
            onValueChange={(value) => handleChange("bloodGroup", value)}
            dropdownIconColor="#FFFFFF"
            style={{ color: "#FFFFFF" }}
          >
            <Picker.Item label="Select Blood Group" value="" />
            <Picker.Item label="A+" value="A+" />
            <Picker.Item label="A-" value="A-" />
            <Picker.Item label="B+" value="B+" />
            <Picker.Item label="B-" value="B-" />
            <Picker.Item label="AB+" value="AB+" />
            <Picker.Item label="AB-" value="AB-" />
            <Picker.Item label="O+" value="O+" />
            <Picker.Item label="O-" value="O-" />
          </Picker>
        </View>
        {errors.bloodGroup && (
          <Text style={styles.error}>{errors.bloodGroup}</Text>
        )}

        <TextInput
          placeholder="Allergies (comma separated)"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={form.allergies}
          onChangeText={(value) => handleChange("allergies", value)}
          style={styles.input}
        />

        <TextInput
          placeholder="Address Line 1"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={form.line1}
          onChangeText={(value) => handleChange("line1", value)}
          style={styles.input}
        />
        {errors.line1 && <Text style={styles.error}>{errors.line1}</Text>}

        <TextInput
          placeholder="City"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={form.city}
          onChangeText={(value) => handleChange("city", value)}
          style={styles.input}
        />
        {errors.city && <Text style={styles.error}>{errors.city}</Text>}

        <TextInput
          placeholder="Postcode"
          placeholderTextColor="rgba(255,255,255,0.6)"
          keyboardType="numeric"
          value={form.postcode}
          onChangeText={(value) => handleChange("postcode", value)}
          style={styles.input}
        />
        {errors.postcode && <Text style={styles.error}>{errors.postcode}</Text>}

        <TextInput
          placeholder="Emergency Contact"
          placeholderTextColor="rgba(255,255,255,0.6)"
          keyboardType="phone-pad"
          value={form.emergencyContact}
          onChangeText={(value) => handleChange("emergencyContact", value)}
          style={styles.input}
        />
        {errors.emergencyContact && (
          <Text style={styles.error}>{errors.emergencyContact}</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={{ color: "#FFFFFF" }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#121826",
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 40,
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

  pickerContainer: {
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

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  loginText: {
    color: "#FF6B6B",
    fontWeight: "700",
  },
});
