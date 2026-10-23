import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type DatePickerProps = Readonly<{
  /** The chosen date, or null while nothing has been chosen yet. */
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  iconName?: ComponentProps<typeof Ionicons>["name"];
  /** Merged over the default field style, so a screen can restyle the field. */
  style?: StyleProp<ViewStyle>;
}>;
