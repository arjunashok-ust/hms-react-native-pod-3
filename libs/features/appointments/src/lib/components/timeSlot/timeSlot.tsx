import { View, Text, StyleSheet } from "react-native";
import { TimeSlotHolder } from "@hms/shared-ui";
import { useAppointmentContext } from "../../hooks/useAppointmentContext";

type TimeSlotPropsType = Readonly<{
  availableSlots: string[];
  setTimeSlot: (value: string) => void;
  timeSlot: string;
}>;

export function TimeSlotComponent({
  availableSlots,
  setTimeSlot,
  timeSlot,
}: TimeSlotPropsType) {
  const { styles } = useAppointmentContext("timeSlotContent");
  return (
    <View style={styles.timeSlotContainer}>
      {availableSlots.length === 0 ? (
        <Text style={[styles.text, styles.slotText]}>
          No slot available at this moment
        </Text>
      ) : (
        availableSlots.map((slot) => {
          return (
            <TimeSlotHolder
              slot={slot}
              onAction={setTimeSlot}
              id={slot}
              key={slot}
              isSelected={timeSlot === slot}
            />
          );
        })
      )}
    </View>
  );
}
