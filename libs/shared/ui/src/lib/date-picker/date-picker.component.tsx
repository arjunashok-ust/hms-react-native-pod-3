import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { DatePickerProps } from "./date-picker.types";
import { CHEVRON_COLOR, ICON_COLOR, styles } from "./date-picker.styles";

// Native implementation. The web build resolves date-picker.component.web.tsx instead, because
// @react-native-community/datetimepicker has no web support.
export function DatePicker({
  value,
  onChange,
  placeholder = "Date",
  minimumDate,
  maximumDate,
  iconName,
  style,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    setIsOpen(false);
    if (event.type === "set" && selected) onChange(selected);
  };

  return (
    <>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={placeholder}
        onPress={() => setIsOpen(true)}
        style={[styles.field, style]}
      >
        <View style={styles.content}>
          {iconName && (
            <Ionicons
              name={iconName}
              size={22}
              color={ICON_COLOR}
              style={styles.icon}
            />
          )}
          <Text style={styles.text}>
            {value ? value.toDateString() : placeholder}
          </Text>
        </View>
        <Ionicons name="chevron-down-outline" size={22} color={CHEVRON_COLOR} />
      </TouchableOpacity>

      {isOpen && (
        <DateTimePicker
          value={value ?? maximumDate ?? new Date()}
          mode="date"
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={handleChange}
        />
      )}
    </>
  );
}
