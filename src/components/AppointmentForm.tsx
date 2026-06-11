import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useNavigation, NavigationProp } from "@react-navigation/native"; // 🟢 Added for redirect button

interface AppointmentFormProps {
  patientUHID: string | undefined;
  isEditMode?: boolean;
  appointmentData?: {
    appointmentCode: string;
    doctorEmployeeID: string;
    date: string;
    timeSlot: string;
  };
  onSuccess: () => void;
}

export default function AppointmentForm({
  patientUHID,
  isEditMode = false,
  appointmentData,
  onSuccess,
}: Readonly<AppointmentFormProps>) {
  const navigation = useNavigation<NavigationProp<any>>();

  // 🟢 Define Date Boundaries
  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const sixMonthsFromNow = new Date(today);
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  const [doctors, setDoctors] = useState<any[]>([]);
  const [slots, setSlots] = useState<string[]>([]);

  const [selectedDoctor, setSelectedDoctor] = useState("");

  // 🟢 Default new appointments to tomorrow
  const [selectedDate, setSelectedDate] = useState<Date>(tomorrow);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load baseline doctors list and check for existing edit data states
  useEffect(() => {
    fetchDoctors();
    if (isEditMode && appointmentData) {
      setSelectedDoctor(appointmentData.doctorEmployeeID);
      setSelectedDate(new Date(appointmentData.date));
      setSelectedSlot(appointmentData.timeSlot);
    }
  }, [isEditMode, appointmentData]);

  // Refetch slots dynamically whenever doctor or date selections shift
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    } else {
      setSlots([]);
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    try {
      const token = await SecureStore.getItemAsync("patient_jwt");
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/appointment/doctors`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setDoctors(res.data);
    } catch (err) {
      console.error("Failed to load doctor dataset context:", err);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const token = await SecureStore.getItemAsync("patient_jwt");
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/appointment/slots?doctorId=${selectedDoctor}&date=${formattedDate}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Special logic for Edit Mode: append the currently booked slot to the available slots list
      if (
        isEditMode &&
        appointmentData &&
        selectedSlot === appointmentData.timeSlot
      ) {
        if (!res.data.includes(appointmentData.timeSlot)) {
          res.data.unshift(appointmentData.timeSlot);
        }
      }
      setSlots(res.data);
    } catch (err) {
      console.error("Failed to compile slots:", err);
    }
  };

  const handleFormSubmit = async () => {
    if (!selectedDoctor || !selectedSlot) {
      Alert.alert(
        "Validation Error",
        "Please verify all scheduling configurations.",
      );
      return;
    }

    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync("patient_jwt");
      const payload = {
        patientID: patientUHID,
        doctorEmployeeID: selectedDoctor,
        date: selectedDate.toISOString().split("T")[0],
        timeSlot: selectedSlot,
        status: "Pending", // Forces status modification re-evaluation down the wire
      };

      if (isEditMode && appointmentData) {
        // Execute PUT update transaction routing logic
        await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/api/appointment/${appointmentData.appointmentCode}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        Alert.alert(
          "Success",
          "Appointment modifications requested successfully.",
        );
      } else {
        // Execute typical POST creation routing rules
        await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/api/appointment/create`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        Alert.alert(
          "Success",
          "Appointment requested. Awaiting confirmation status.",
        );
      }

      onSuccess();
    } catch (err: any) {
      Alert.alert(
        "Transaction Failed",
        err.response?.data?.message ||
          "An error occurred with the network transaction subsystem.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.iconCircle}>
          <Text style={{ color: "#FFF" }}>📅</Text>
        </View>
        <View>
          <Text style={styles.subText}>
            {isEditMode ? "MODIFY ENTRY" : "NEW ENTRY"}
          </Text>
          <Text style={styles.cardTitle}>
            {isEditMode ? "Edit Appointment Details" : "Book Appointment"}
          </Text>
        </View>
      </View>

      <Text style={styles.label}>PATIENT ID</Text>
      <View style={styles.disabledInput}>
        <Text style={styles.disabledInputText}>
          {patientUHID || "Fetching..."}
        </Text>
      </View>

      <Text style={styles.label}>SELECT DOCTOR</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedDoctor}
          onValueChange={(item) => setSelectedDoctor(item)}
        >
          <Picker.Item label="Choose Doctor" value="" color="#9CA3AF" />
          {doctors.map((doc) => (
            <Picker.Item
              key={doc.employeeCode}
              label={`${doc.name} (${doc.department})`}
              value={doc.employeeCode}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>SCHEDULE DATE</Text>
      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          minimumDate={tomorrow} // 🟢 Locked to tomorrow minimum
          maximumDate={sixMonthsFromNow} // 🟢 Locked to 6 months max
          onChange={(e, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      {selectedDoctor && (
        <>
          <Text style={styles.label}>AVAILABLE SLOTS</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedSlot}
              onValueChange={(item) => setSelectedSlot(item)}
            >
              <Picker.Item label="Select Time Slot" value="" color="#9CA3AF" />
              {slots.map((s) => (
                <Picker.Item key={s} label={s} value={s} />
              ))}
            </Picker>
          </View>
        </>
      )}

      <TouchableOpacity
        style={styles.btn}
        onPress={handleFormSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.btnText}>
            {isEditMode ? "Confirm Modifications" : "Request Appointment"}
          </Text>
        )}
      </TouchableOpacity>

      {/* 🟢 Secondary Redirect Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "MainTabs" }], // Wipes the stack and defaults to HomeTab
          })
        }
      >
        <Text style={styles.backText}>⬅️ GO BACK TO DASHBOARD</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4B1D76",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  subText: { fontSize: 11, color: "#9CA3AF", fontWeight: "bold" },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#1E1E3F" },
  label: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 12,
  },
  disabledInput: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderColor: "#4B1D76",
  },
  disabledInputText: { color: "#1E1E3F", fontWeight: "bold" },
  pickerContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8,
    justifyContent: "center",
    height: 55,
    paddingHorizontal: 8,
  },
  dateText: { fontSize: 16, color: "#1E1E3F", paddingLeft: 8 },
  btn: {
    backgroundColor: "#4B1D76",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },

  // 🟢 New secondary button styling
  backBtn: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 12,
  },
  backText: {
    color: "#4B5563",
    fontWeight: "bold",
    fontSize: 14,
  },
});
