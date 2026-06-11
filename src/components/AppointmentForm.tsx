import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MaterialIcons, Fontisto } from "@expo/vector-icons";

import { appointmentService } from "../services/appointmentService";
import { useAppointmentData } from "../hooks/useAppointmentData"; // 🟢 Our new Hook
import SelectablePill from "./SelectablePill"; // 🟢 Our new Component

interface AppointmentFormProps {
  patientUHID: string | undefined;
  isEditMode?: boolean;
  appointmentData?: any;
  onSuccess: () => void;
}

export default function AppointmentForm({
  patientUHID,
  isEditMode = false,
  appointmentData,
  onSuccess,
}: Readonly<AppointmentFormProps>) {
  const navigation = useNavigation<NavigationProp<any>>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🟢 One line pulls in all the complex data logic!
  const {
    doctors,
    slots,
    selectedDoctor,
    setSelectedDoctor,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    tomorrow,
    doctorListRef,
    slotListRef,
  } = useAppointmentData(isEditMode, appointmentData);

  const sixMonthsFromNow = new Date(tomorrow);
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  const handleScrollFailed = (
    info: any,
    ref: React.RefObject<FlatList | null>,
  ) => {
    setTimeout(
      () =>
        ref.current?.scrollToIndex({
          index: info.index,
          animated: true,
          viewPosition: 0.5,
        }),
      500,
    );
  };

  const handleFormSubmit = async () => {
    if (!selectedDoctor || !selectedSlot) {
      return Alert.alert(
        "Validation Error",
        "Please select a doctor and an available time slot.",
      );
    }
    setIsLoading(true);
    try {
      const payload = {
        patientID: patientUHID,
        doctorEmployeeID: selectedDoctor,
        date: selectedDate.toISOString().split("T")[0],
        timeSlot: selectedSlot,
        status: "Pending",
      };
      if (isEditMode) {
        await appointmentService.updateAppointment(
          appointmentData.appointmentCode,
          payload,
        );
        Alert.alert("Success", "Appointment modifications requested.");
      } else {
        await appointmentService.createAppointment(payload);
        Alert.alert("Success", "Appointment requested.");
      }
      onSuccess();
    } catch (err: any) {
      Alert.alert("Transaction Failed", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="today" size={24} color="white" />
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
      <View style={styles.scrollWrapper}>
        <FlatList
          ref={doctorListRef}
          data={doctors}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.employeeCode}
          onScrollToIndexFailed={(info) =>
            handleScrollFailed(info, doctorListRef)
          }
          renderItem={({ item }) => (
            <SelectablePill
              title={item.name}
              subtitle={item.department}
              isSelected={selectedDoctor === item.employeeCode}
              onPress={() => {
                setSelectedDoctor(item.employeeCode);
                setSelectedSlot("");
              }}
            />
          )}
        />
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
          minimumDate={tomorrow}
          maximumDate={sixMonthsFromNow}
          onChange={(e, date) => {
            setShowDatePicker(false);
            if (date) {
              setSelectedDate(date);
              setSelectedSlot("");
            }
          }}
        />
      )}

      {!!selectedDoctor && (
        <>
          <Text style={styles.label}>AVAILABLE SLOTS</Text>
          <View style={styles.scrollWrapper}>
            {slots.length === 0 ? (
              <Text style={styles.noSlotsText}>
                No slots available for this date.
              </Text>
            ) : (
              <FlatList
                ref={slotListRef}
                data={slots}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                onScrollToIndexFailed={(info) =>
                  handleScrollFailed(info, slotListRef)
                }
                renderItem={({ item }) => (
                  <SelectablePill
                    title={item}
                    isSelected={selectedSlot === item}
                    onPress={() => setSelectedSlot(item)}
                  />
                )}
              />
            )}
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

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() =>
          navigation.reset({ index: 0, routes: [{ name: "ViewAppointments" }] })
        }
      >
        <View style={styles.backBtnContainer}>
          <Fontisto name="close" size={24} color="#4B5563" />
          <Text style={styles.backText}>CANCEL</Text>
        </View>
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
    marginBottom: 8,
    marginTop: 16,
  },
  disabledInput: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderColor: "#4B1D76",
  },
  disabledInputText: { color: "#1E1E3F", fontWeight: "bold" },
  scrollWrapper: { marginHorizontal: -4 },
  noSlotsText: {
    color: "#EF4444",
    fontSize: 14,
    fontStyle: "italic",
    paddingHorizontal: 4,
    marginTop: 4,
  },
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
    marginTop: 24,
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  backBtn: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 12,
  },
  backBtnContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  backText: { color: "#4B5563", fontWeight: "bold", fontSize: 14 },
});
