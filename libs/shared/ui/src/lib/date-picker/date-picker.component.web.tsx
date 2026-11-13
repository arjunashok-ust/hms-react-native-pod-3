import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import {
  parseDateInputValue,
  toDateInputValue,
} from "@hms/shared-util";
import type { DatePickerProps } from "./date-picker.types";
import {
  DATE_FONT_SIZE,
  DATE_TEXT_COLOR,
  ICON_COLOR,
  styles,
} from "./date-picker.styles";

// Web implementation: the browser's own date input. It brings the calendar popup, keyboard entry
// and screen-reader support, so no extra dependency is needed.
export function DatePicker({
  value,
  onChange,
  placeholder = "Date",
  minimumDate,
  maximumDate,
  iconName,
  style,
}: DatePickerProps) {
  return (
    <View style={[styles.field, style]}>
      <View style={styles.content}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={22}
            color={ICON_COLOR}
            style={styles.icon}
          />
        )}
        <input
          type="date"
          aria-label={placeholder}
          value={value ? toDateInputValue(value) : ""}
          min={minimumDate ? toDateInputValue(minimumDate) : undefined}
          max={maximumDate ? toDateInputValue(maximumDate) : undefined}
          onChange={(event) => {
            const next = parseDateInputValue(event.target.value);
            if (next) onChange(next);
          }}
          // Chrome only opens the calendar from its small icon; open it on any click in the field.
          onClick={(event) => event.currentTarget.showPicker?.()}
          style={{
            flex: 1,
            minWidth: 0,
            padding: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            color: DATE_TEXT_COLOR,
            fontFamily: "Sans",
            fontSize: DATE_FONT_SIZE,
            cursor: "pointer",
          }}
        />
      </View>
    </View>
  );
}
