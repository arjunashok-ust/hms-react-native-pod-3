import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet } from "react-native";
import { Doctor } from "@hms/trpc-client";
import { useAppointmentContext } from "../../hooks/useAppointmentContext";

type DoctorHolderProps = Readonly<{
  doctors: Doctor[];
  selectedDoctor: string;
  setDoctor: (value: string) => void;
}>;

export function DoctorHolder({
  doctors,
  selectedDoctor,
  setDoctor,
}: DoctorHolderProps) {
  const { styles } = useAppointmentContext("doctorHolderContent");
  return (
    <View style={styles.dropdownHolder}>
      <Ionicons
        name="medkit-outline"
        color="#cfcfcf"
        size={22}
        style={styles.dropDownIcon}
      />
      <Picker
        style={styles.picker}
        dropdownIconColor="white"
        onValueChange={(value: string) => setDoctor(value)}
        selectedValue={selectedDoctor}
      >
        <Picker.Item label="Doctor" value="" />
        {doctors.map((doctor) => (
          <Picker.Item
            key={doctor.employeeCode}
            label={`${doctor.name} (${doctor.specialization ?? ""})`}
            value={doctor.employeeCode}
          />
        ))}
      </Picker>
    </View>
  );
}
