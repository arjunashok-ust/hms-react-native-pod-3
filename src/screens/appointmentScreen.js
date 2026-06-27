import { useState, useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppointmentCard from "../components/AppointmentCard";
import Header from "../components/Header";

import {
  getAllDoctors,
  createAppointment,
  getPatientAppointments,
  cancelAppointment,
  getAvailableSlots,
} from "../services/patientApi";

import { getPatient } from "../storage/authStorage";

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
  const [appointments, setAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  /* Infinite-scroll pagination state for the appointments list. */
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadDoctors();
      loadAppointments();
    }, []),
  );

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const loadDoctors = async () => {
    try {
      const response = await getAllDoctors();
      if (response.doctors) {
        setDoctors(response.doctors);
      } else if (response.data) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadAvailableSlots = async (doctorEmployeeId, date) => {
    try {
      const response = await getAvailableSlots(doctorEmployeeId, date);

      setSlots(response.data?.slots || []);
    } catch (error) {
      console.log(error);
      setSlots([]);
    }
  };

  const PAGE_SIZE = 10;

  /* Load page 1 (focus / refresh / after book or cancel) — replaces the list. */
  const loadAppointments = async () => {
    try {
      const response = await getPatientAppointments(1, PAGE_SIZE);

      setAppointments(response.data || []);
      setHasNextPage(response.meta?.hasNextPage || false);
      setPage(1);
    } catch (error) {
      console.log(error);
    }
  };

  /* Append the next page when the user scrolls near the bottom. */
  const loadMore = async () => {
    if (loadingMore || !hasNextPage) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await getPatientAppointments(nextPage, PAGE_SIZE);

      setAppointments((prev) => [...prev, ...(response.data || [])]);
      setHasNextPage(response.meta?.hasNextPage || false);
      setPage(nextPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMore(false);
    }
  };

  /* The appointments list lives inside a ScrollView (below the booking form),
     so infinite scroll is driven by the ScrollView's scroll position rather
     than a FlatList onEndReached. */
  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const distanceFromBottom =
      contentSize.height - (contentOffset.y + layoutMeasurement.height);

    if (distanceFromBottom < 300) {
      loadMore();
    }
  };

  /* PULL-TO-REFRESH — reloads doctors + appointments so admin-side status
     changes show up without leaving the screen. */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadDoctors(), loadAppointments()]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleDoctorChange = (employeeId) => {
    setForm((prev) => ({
      ...prev,
      doctorEmployeeId: employeeId,
      timeSlot: "",
    }));

    setSlots([]);

    if (form.date) {
      loadAvailableSlots(employeeId, form.date);
    }
  };

  //Cancel Appointment
  const handleCancelAppointment = useCallback(async (appointmentId) => {
    try {
      const response = await cancelAppointment(appointmentId);
      alert(response.message);
      await loadAppointments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed To Cancel");
    }
  }, []);

  const handleBookAppointment = async () => {
    if (!form.doctorEmployeeId || !form.date || !form.timeSlot) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const patient = await getPatient();
      console.log(patient);
      console.log(patient.UHID);

      const requestBody = {
        patientId: patient.UHID,
        doctorEmployeeId: form.doctorEmployeeId,
        date: form.date,
        timeSlot: form.timeSlot,
      };

      console.log("REQUEST BODY:", requestBody);

      const response = await createAppointment(requestBody);
      alert(response.message);
      await loadAppointments();

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

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#F59E0B";

      case "BOOKED":
        return "#10B981";

      case "CANCELLED":
        return "#EF4444";

      default:
        return "#1c5cde";
    }
  };

  const renderAppointment = useCallback(
    ({ item }) => (
      <AppointmentCard
        item={item}
        getStatusColor={getStatusColor}
        onCancel={handleCancelAppointment}
      />
    ),
    [],
  );
  return (
    <View style={{ flex: 1 }}>
      <Header title="Appointments" />

      <ScrollView
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6B46C1"]}
            tintColor="#6B46C1"
          />
        }
      >
      <Text style={styles.heading}>Book</Text>

      <Text style={styles.headingHighlight}>Appointment</Text>

      <Text style={styles.subHeading}>Schedule your consultation.</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Appointment Details</Text>

        <Text
          style={{
            color: "#6B46C1",
            marginBottom: 15,
            fontWeight: "600",
            fontSize: 15,
          }}
        >
          Doctors Available: {doctors.length}
        </Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.doctorEmployeeId}
            onValueChange={handleDoctorChange}
            dropdownIconColor="#6B46C1"
            style={{
              color: "#1C2143",
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
              color: form.date ? "#1C2143" : "#9CA3AF",
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

                if (form.doctorEmployeeId) {
                  loadAvailableSlots(form.doctorEmployeeId, formattedDate);
                }
              }
            }}
          />
        )}

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.timeSlot}
            onValueChange={(value) => handleChange("timeSlot", value)}
            dropdownIconColor="#6B46C1"
            style={{
              color: "#1C2143",
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

      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: "#1C2143",
          marginTop: 25,
          marginBottom: 15,
        }}
      >
        My Appointments
      </Text>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.appointmentId}
        renderItem={renderAppointment}
        scrollEnabled={false}
      />

      {loadingMore && (
        <ActivityIndicator
          size="small"
          color="#6B46C1"
          style={{ marginVertical: 16 }}
        />
      )}

      </ScrollView>
    </View>
  );
};

export default AppointmentScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F4F7",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1C2143",
  },

  headingHighlight: {
    fontSize: 42,
    fontWeight: "800",
    color: "#6B46C1",
    marginBottom: 8,
  },

  subHeading: {
    fontSize: 15,
    color: "#7B7B93",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 25,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C2143",
    textAlign: "center",
    marginBottom: 25,
  },

  input: {
    backgroundColor: "#F7F8FC",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    justifyContent: "center",
    marginBottom: 18,

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  pickerContainer: {
    backgroundColor: "#F7F8FC",
    borderRadius: 15,
    marginBottom: 18,

    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },

  button: {
    backgroundColor: "#6B46C1",
    height: 58,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,

    shadowColor: "#6B46C1",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
