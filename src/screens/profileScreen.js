import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  getPatient,
  getToken,
  getUser,
  saveLoginData,
} from "../storage/authStorage";

import { updatePatientProfile } from "../api/patientApi";

const ProfileScreen = () => {
  const [patient, setPatient] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    allergies: "",
    emergencyContact: "",
    line1: "",
    city: "",
    postcode: "",
  });

  useEffect(() => {
    loadPatient();
  }, []);

  const loadPatient = async () => {
    const data = await getPatient();

    if (data) {
      setPatient(data);
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        bloodGroup: data.bloodGroup || "",
        allergies: data.allergies?.join(", ") || "",
        emergencyContact: data.emergencyContact || "",
        line1: data.address?.line1 || "",
        city: data.address?.city || "",
        postcode: data.address?.postcode || "",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const requestBody = {
        name: form.name,
        phone: form.phone,
        bloodGroup: form.bloodGroup,
        allergies: form.allergies
          ? form.allergies.split(",").map((a) => a.trim())
          : [],
        emergencyContact: form.emergencyContact,
        address: {
          line1: form.line1,
          city: form.city,
          postcode: form.postcode,
        },
      };

      const response = await updatePatientProfile(requestBody, token);

      const user = await getUser();

      await saveLoginData(token, user, response.patient);

      setPatient(response.patient);

      setIsEditing(false);

      Alert.alert("Success", "Profile Updated Successfully");
    } catch (error) {
      console.log(error);

      Alert.alert("Error", error.response?.data?.message || "Update Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!patient) {
    return (
      <View style={styles.center}>
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  const renderField = (label, value, fieldName) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      {isEditing && fieldName ? (
        <TextInput
          style={styles.input}
          value={form[fieldName]}
          onChangeText={(text) =>
            setForm({
              ...form,
              [fieldName]: text,
            })
          }
        />
      ) : (
        <Text style={styles.value}>{value || "-"}</Text>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={120} color="#FF6B6B" />
      </View>

      <Text style={styles.name}>{patient.name}</Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          if (isEditing) {
            handleUpdate();
          } else {
            setIsEditing(true);
          }
        }}
      >
        <Text style={styles.editButtonText}>
          {loading ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
        </Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setIsEditing(false);
            loadPatient();
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        {renderField("UHID", patient.UHID)}

        {renderField("Email", patient.email)}

        {renderField("Name", patient.name, "name")}

        {renderField("Phone", patient.phone, "phone")}

        {renderField("Gender", patient.gender)}

        {renderField(
          "Date of Birth",
          patient.date_of_birth ? patient.date_of_birth.split("T")[0] : "-",
        )}

        {renderField("Blood Group", patient.bloodGroup, "bloodGroup")}

        {renderField(
          "Emergency Contact",
          patient.emergencyContact,
          "emergencyContact",
        )}

        {renderField(
          "Allergies",
          patient.allergies?.length ? patient.allergies.join(", ") : "None",
          "allergies",
        )}

        {renderField("Address", patient.address?.line1, "line1")}

        {renderField("City", patient.address?.city, "city")}

        {renderField("Postcode", patient.address?.postcode, "postcode")}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#121826",
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    backgroundColor: "#121826",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 15,
  },

  name: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 20,
  },

  editButton: {
    backgroundColor: "#FF6B6B",
    height: 58,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  cancelButton: {
    backgroundColor: "#374151",
    height: 58,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 30,
    padding: 25,
  },

  row: {
    marginBottom: 20,
  },

  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginBottom: 6,
  },

  value: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    height: 55,
    color: "#FFFFFF",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.4)",
    paddingHorizontal: 0,
  },
});