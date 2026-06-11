import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  StatusBar,
} from "react-native";
import { validateField } from "../utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { registerPatient } from "../api/patientApi";

const PRIMARY = "#5A1E96";

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
  const [touched, setTouched] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (touched[key]) {
      validateSingleField(key, value);
    }
  };

  const validators = {
    name: (v) => validateField(v, "Name", "name"),
    email: (v) => validateField(v, "Email", "email"),
    password: (v) => validateField(v, "Password", "password"),
    phone: (v) => validateField(v, "Phone", "phone"),
    gender: (v) => validateField(v, "Gender", "required"),
    dob: (v) => validateField(v, "Date of Birth", "dob"),
    bloodGroup: (v) => validateField(v, "Blood Group", "required"),
    line1: (v) => validateField(v, "Address", "address"),
    city: (v) => validateField(v, "City", "city"),
    postcode: (v) => validateField(v, "Postcode", "postcode"),
    emergencyContact: (v) =>
      validateField(v, "Emergency Contact", "optionalPhone"),
  };

  const validateSingleField = (field, value) => {
    const error = validators[field] ? validators[field](value) : "";

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    Object.keys(validators).forEach((field) => {
      newErrors[field] = validators[field](form[field]);
    });
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const isFormValid = () => {
    return Object.keys(validators).every(
      (field) => validators[field](form[field]) === "",
    );
  };

  const handleSignup = async () => {
    setTouched({
      name: true,
      email: true,
      password: true,
      phone: true,
      gender: true,
      dob: true,
      bloodGroup: true,
      line1: true,
      city: true,
      postcode: true,
      emergencyContact: true,
    });
    if (!validateForm()) return;

    try {
      setLoading(true);

      const body = {
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
      console.log("Request Body:", body);
      await registerPatient(body);
      alert("Account created successfully");
      navigation.navigate("Login");
    } catch (error) {
  console.log("Signup Error:", error);
  console.log("Response:", error?.response?.data);

  alert(
    error?.response?.data?.message ||
    error?.message ||
    "Signup Failed"
  );
}finally {
      setLoading(false);
    }
  };

  const renderError = (field) =>
    touched[field] && errors[field] ? (
      <Text style={styles.error}>{errors[field]}</Text>
    ) : null;

  return (
    <ImageBackground
      source={require("../../assets/images/loginpng.png")}
      resizeMode="cover"
      imageStyle={{ opacity: 0.25 }}
      style={styles.background}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcome}>New To,</Text>
          <Text style={styles.hms}>HMS?</Text>

          <View style={styles.tagBox}>
            <Text style={styles.tagText}>
              Create your account to get started.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          {/* NAME */}
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={22} color="#777" />
            <TextInput
              placeholder="Full Name"
              style={styles.input}
              value={form.name}
              onChangeText={(v) => handleChange("name", v)}
              onBlur={() => {
                setTouched((p) => ({ ...p, name: true }));
                validateSingleField("name", form.name);
              }}
            />
          </View>
          {renderError("name")}

          {/* EMAIL */}
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={22} color="#777" />
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              value={form.email}
              onChangeText={(v) => handleChange("email", v)}
              onBlur={() => {
                setTouched((p) => ({ ...p, email: true }));
                validateSingleField("email", form.email);
              }}
            />
          </View>
          {renderError("email")}

          {/* PASSWORD */}
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={22} color="#777" />
            <TextInput
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
              value={form.password}
              onChangeText={(v) => handleChange("password", v)}
              onBlur={() => {
                setTouched((p) => ({ ...p, password: true }));
                validateSingleField("password", form.password);
              }}
            />
          </View>
          {renderError("password")}

          {/* PHONE */}
          <View style={styles.inputBox}>
            <Ionicons name="call-outline" size={22} color="#777" />
            <TextInput
              placeholder="Phone"
              keyboardType="phone-pad"
              maxLength={10}
              style={styles.input}
              value={form.phone}
              onChangeText={(v) =>
                handleChange("phone", v.replace(/[^0-9]/g, ""))
              }
              onBlur={() => {
                setTouched((p) => ({ ...p, phone: true }));
                validateSingleField("phone", form.phone);
              }}
            />
          </View>
          {renderError("phone")}

          {/* GENDER */}
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={form.gender}
              onValueChange={(v) => {
                handleChange("gender", v);
                setTouched((p) => ({ ...p, gender: true }));
                validateSingleField("gender", v);
              }}
            >
              <Picker.Item label="Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          {renderError("gender")}

          {/* DOB */}
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={22} color="#777" />
            <Text style={styles.dateText}>{form.dob || "Date of Birth"}</Text>
          </TouchableOpacity>
          {renderError("dob")}

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              maximumDate={new Date()}
              value={new Date()}
              onChange={(e, date) => {
                setShowDatePicker(false);
                if (date) {
                  const value = date.toISOString().split("T")[0];
                  handleChange("dob", value);
                  setTouched((p) => ({ ...p, dob: true }));
                  validateSingleField("dob", value);
                }
              }}
            />
          )}

          {/* BLOOD GROUP */}
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={form.bloodGroup}
              onValueChange={(v) => {
                handleChange("bloodGroup", v);
                setTouched((p) => ({ ...p, bloodGroup: true }));
                validateSingleField("bloodGroup", v);
              }}
            >
              <Picker.Item label="Blood Group" value="" />
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
          {renderError("bloodGroup")}

          {/* ALLERGIES */}
          <View style={styles.inputBox}>
            <Ionicons name="medkit-outline" size={22} color="#777" />
            <TextInput
              placeholder="Allergies"
              value={form.allergies}
              style={styles.input}
              onChangeText={(v) => handleChange("allergies", v)}
            />
          </View>

          {/* ADDRESS */}
          <View style={styles.inputBox}>
            <Ionicons name="location-outline" size={22} color="#777" />
            <TextInput
              placeholder="Address"
              style={styles.input}
              value={form.line1}
              onChangeText={(v) => handleChange("line1", v)}
              onBlur={() => {
                setTouched((p) => ({ ...p, line1: true }));
                validateSingleField("line1", form.line1);
              }}
            />
          </View>
          {renderError("line1")}

          <View style={styles.inputBox}>
            <TextInput
              placeholder="City"
              style={styles.input}
              value={form.city}
              onChangeText={(v) => handleChange("city", v)}
              onBlur={() => {
                setTouched((p) => ({ ...p, city: true }));
                validateSingleField("city", form.city);
              }}
            />
          </View>
          {renderError("city")}

          <View style={styles.inputBox}>
            <TextInput
              placeholder="Postcode"
              keyboardType="numeric"
              maxLength={6}
              style={styles.input}
              value={form.postcode}
              onChangeText={(v) =>
                handleChange("postcode", v.replace(/[^0-9]/g, ""))
              }
              onBlur={() => {
                setTouched((p) => ({ ...p, postcode: true }));
                validateSingleField("postcode", form.postcode);
              }}
            />
          </View>
          {renderError("postcode")}

          {/* EMERGENCY */}
          <View style={styles.inputBox}>
            <Ionicons name="call-outline" size={22} color="#777" />
            <TextInput
              placeholder="Emergency Contact"
              keyboardType="phone-pad"
              maxLength={10}
              style={styles.input}
              value={form.emergencyContact}
              onChangeText={(v) =>
                handleChange("emergencyContact", v.replace(/[^0-9]/g, ""))
              }
              onBlur={() => {
                setTouched((p) => ({
                  ...p,
                  emergencyContact: true,
                }));
                validateSingleField("emergencyContact", form.emergencyContact);
              }}
            />
          </View>
          {renderError("emergencyContact")}

          {/* BUTTON */}
          <TouchableOpacity
            style={[
              styles.button,
              (!isFormValid() || loading) && { opacity: 0.5 },
            ]}
            disabled={!isFormValid() || loading}
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating..." : "Signup"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flexGrow: 1, paddingBottom: 40 },
  header: { paddingTop: 80, paddingHorizontal: 20 },
  welcome: { fontSize: 40, fontWeight: "800", color: "#222" },
  hms: { fontSize: 52, fontWeight: "900", color: PRIMARY },

  tagBox: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },

  tagText: { fontSize: 14 },

  card: {
    marginTop: 160,
    marginHorizontal: 12,
    backgroundColor: "#EFEFEF",
    borderRadius: 40,
    padding: 25,
    elevation: 10,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 10,
    elevation: 3,
  },

  input: { flex: 1, marginLeft: 10 },

  pickerBox: {
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    marginBottom: 10,
    elevation: 3,
  },

  dateText: { marginLeft: 10, color: "#777" },

  button: {
    backgroundColor: PRIMARY,
    height: 65,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  loginText: { color: "#222" },

  loginLink: {
    color: PRIMARY,
    fontWeight: "700",
  },

  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 5,
  },
});
