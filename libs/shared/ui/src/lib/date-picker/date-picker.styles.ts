import { StyleSheet } from "react-native";

export const DATE_TEXT_COLOR = "rgb(39, 39, 39)";
export const DATE_FONT_SIZE = 14;
export const CHEVRON_COLOR = "#4f0d68";
export const ICON_COLOR = "#cfcfcf";

// Used by both the native and the web date picker so the field looks the same on every platform.
export const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgb(222, 222, 222)",
    borderWidth: 1,
    borderColor: "rgba(83, 11, 107, 0.3)",
    borderRadius: 10,
    padding: 8,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    backgroundColor: "rgb(108, 19, 109)",
    borderWidth: 1,
    borderColor: "rgba(198, 53, 255, 0.2)",
    borderRadius: 10,
    padding: 10,
    marginRight: 13,
  },
  text: {
    color: DATE_TEXT_COLOR,
    fontFamily: "Sans",
    fontSize: DATE_FONT_SIZE,
    lineHeight: DATE_FONT_SIZE,
  },
});
