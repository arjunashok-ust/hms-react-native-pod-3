import { Ionicons } from "@expo/vector-icons";
import { View,Text } from "react-native";
import { useMedicalRecordContext } from "../../hooks/useMedicalRecordContext";

export const ClinicalRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string | null;
}) => {
  const { styles, testId } = useMedicalRecordContext("clinicalRowContent");
  return (
    <View style={styles.clinicalRow} testID={testId`row.${label}`}>
      <View style={styles.clinicalLabelRow}>
        <Ionicons name={icon} size={13} style={styles.appointmentIcon} />
        <Text style={[styles.text, styles.clinicalLabel]}>{label}</Text>
      </View>
      <Text
        style={[styles.text, styles.clinicalValue]}
        testID={testId`value.${label}`}
      >
        {value || "—"}
      </Text>
    </View>
  );
};