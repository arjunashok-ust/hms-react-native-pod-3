import { Ionicons } from "@expo/vector-icons";
import { MedicalRecord } from "@hms/trpc-client";
import { TouchableOpacity, View, Text } from "react-native";
import { RecordDetails } from "../recordDetails/recordDetails";
import { useMedicalRecordContext } from "../../hooks/useMedicalRecordContext";
import { formatDateAndTime } from "../../utils/formatDate";

export const MedicalRecordCardComponent = ({
  record,
  isExpanded,
  onToggle,
}: {
  record: MedicalRecord;
  isExpanded: boolean;
  onToggle: () => void;
}) => {

  const { styles } = useMedicalRecordContext("medicalRecordCardContent");
  const { formatDate } = formatDateAndTime();
  
  return (
    <View style={styles.appointmentContainer}>
      <TouchableOpacity
        style={styles.appointmentHeader}
        onPress={onToggle}
        activeOpacity={0.75}
      >
        <View style={styles.appointmentIconAndText}>
          <View style={styles.avatarIcon}>
            <Text style={[styles.avatarText, styles.text]}>
              {(record.diagnosis ?? "").slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.appointmentTextHolder}>
            <Text
              style={[styles.text, styles.doctorText]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {record.diagnosis}
            </Text>
            <Text
              style={[styles.text, styles.doctorSubTitle]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {formatDate(record.created_at)}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Ionicons
            name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
            size={18}
            color="rgb(101, 26, 114)"
            style={{ marginTop: 6, alignSelf: "center" }}
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View>
          <RecordDetails record={record} />
        </View>
      )}
    </View>
  );
};
