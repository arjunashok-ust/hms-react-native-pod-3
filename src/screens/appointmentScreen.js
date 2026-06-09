import { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { getAllDoctors, createAppointment } from "../api/patientApi";

import { getPatient, getToken } from "../storage/authStorage";

const AppointmentScreen = () => {
  const [form, setForm] = useState({
    doctorEmployeeId: "",
    date: "",
    timeSlot: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const loadDoctors = async () => {
    try {
      const response = await getAllDoctors();

     // console.log("DOCTOR RESPONSE:", response);

      if (response.doctors) {
        setDoctors(response.doctors);
      } else if (response.data) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDoctorChange = (employeeId) => {
    const selectedDoctor = doctors.find(
      (doctor) => doctor.employeeId === employeeId,
    );

    setForm((prev) => ({
      ...prev,
      doctorEmployeeId: employeeId,
      timeSlot: "",
    }));

    setSlots(selectedDoctor?.availabilitySlots || []);
  };

  const handleBookAppointment = async () => {
    if (!form.doctorEmployeeId || !form.date || !form.timeSlot) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const patient = await getPatient();
      const token = await getToken();

      console.log(patient);
      console.log(patient.UHID);
      
      const requestBody = {
        patientId: patient.UHID,
        doctorEmployeeId: form.doctorEmployeeId,
        date: form.date,
        timeSlot: form.timeSlot,
      };

      console.log("REQUEST BODY:", requestBody);

      const response = await createAppointment(requestBody, token);

      alert(response.message);

      setForm({
        doctorEmployeeId: "",
        date: "",
        timeSlot: "",
      });

      setSlots([]);
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      alert(error.response?.data?.message || "Failed To Book Appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Book</Text>

      <Text style={styles.headingHighlight}>Appointment</Text>

      <Text style={styles.subHeading}>Schedule your consultation.</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Appointment Details</Text>

        <Text
          style={{
            color: "#FFFFFF",
            marginBottom: 10,
          }}
        >
          Doctors Available: {doctors.length}
        </Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.doctorEmployeeId}
            onValueChange={handleDoctorChange}
            dropdownIconColor="#FFFFFF"
            style={{
              color: "#FFFFFF",
            }}
          >
            <Picker.Item label="Select Doctor" value="" />

            {doctors.map((doctor) => (
              <Picker.Item
                key={doctor._id}
                label={`${doctor.name} (${doctor.specialization})`}
                value={doctor.employeeId}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text
            style={{
              color: form.date ? "#FFFFFF" : "rgba(255,255,255,0.6)",
              fontSize: 16,
              lineHeight: 55,
            }}
          >
            {form.date || "Select Appointment Date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);

              if (selectedDate) {
                const formattedDate = selectedDate.toISOString().split("T")[0];

                handleChange("date", formattedDate);
              }
            }}
          />
        )}

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.timeSlot}
            onValueChange={(value) => handleChange("timeSlot", value)}
            dropdownIconColor="#FFFFFF"
            style={{
              color: "#FFFFFF",
            }}
          >
            <Picker.Item label="Select Time Slot" value="" />

            {slots.map((slot) => (
              <Picker.Item key={slot} label={slot} value={slot} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleBookAppointment}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Booking..." : "Book Appointment"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AppointmentScreen;

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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.4)",
    marginBottom: 20,
    justifyContent: "center",
  },

  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.4)",
    marginBottom: 20,
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
});
