import { Ionicons } from "@expo/vector-icons";
import { MedicalRecord } from "@hms/trpc-client";
import { View, Text } from "react-native";
import { ClinicalRow } from "../clinicalRows/clinicalRow";
import { useMedicalRecordContext } from "../../hooks/useMedicalRecordContext";
import { formatDateAndTime } from "../../utils/formatDate";

export const RecordDetails = ({ record }: { record: MedicalRecord }) => {
  const { styles, content, testId } = useMedicalRecordContext(
    "recordDetailsContent",
  );
  const { formatDate, formatDateTime } = formatDateAndTime();

  return (
    <View testID={testId`details`}>
      <View style={styles.divider} />
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons
            name="barcode-outline"
            size={18}
            style={styles.appointmentIcon}
          />
          <Text
            style={[styles.text, styles.footerText]}
            numberOfLines={1}
            testID={testId`recordId`}
          >
            {record.medicalRecordId}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons
            name="calendar-outline"
            size={18}
            style={styles.appointmentIcon}
          />
          <Text
            style={[styles.text, styles.footerText]}
            testID={testId`createdAt`}
          >
            {formatDate(record.created_at)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />
      <View style={styles.peopleRow}>
        <View style={styles.personBlock}>
          <Text style={[styles.text, styles.sectionLabel]}>
            {content.peopleRow.sectionLabel.doctor}
          </Text>
          <View style={styles.personInner}>
            <View style={[styles.avatarIcon, styles.avatarCyan]}>
              <Text style={[styles.text, styles.avatarText]}>
                {record.doctorId.slice(0, 3).toUpperCase()}
              </Text>
            </View>
            <View style={styles.personTextHolder}>
              <Text
                style={[styles.text, styles.doctorText]}
                numberOfLines={1}
                testID={testId`doctor`}
              >
                {record.doctorId}
              </Text>
              <Text
                style={[styles.text, styles.doctorSubTitle]}
                numberOfLines={1}
              >
                {record.doctorId}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.clinicalSection}>
        <ClinicalRow
          icon="chatbubble-outline"
          label={content.clinicalData.label.complaint}
          value={record.complaint}
        />
        <ClinicalRow
          icon="pulse-outline"
          label={content.clinicalData.label.symptoms}
          value={record.symptoms}
        />
        <ClinicalRow
          icon="document-text-outline"
          label={content.clinicalData.label.diagnosis}
          value={record.diagnosis}
        />
      </View>

      {record.medications.length > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.tableLabelRow}>
            <Ionicons
              name="medkit-outline"
              size={13}
              style={styles.appointmentIcon}
            />
            <Text style={[styles.text, styles.sectionLabel]}>
              {content.sectionLabel.medications} ({record.medications.length})
            </Text>
          </View>
          <View style={styles.tableHeader}>
            <Text style={[styles.text, styles.tableHeaderCell, { flex: 2 }]}>
              {content.medicationsData.title.name}
            </Text>
            <Text style={[styles.text, styles.tableHeaderCell, { flex: 1 }]}>
              {content.medicationsData.title.dosage}
            </Text>
            <Text style={[styles.text, styles.tableHeaderCell, { flex: 1.5 }]}>
              {content.medicationsData.title.frequency}
            </Text>
            <Text style={[styles.text, styles.tableHeaderCell, { flex: 1 }]}>
              {content.medicationsData.title.duration}
            </Text>
          </View>
          {record.medications.map((med, i) => (
            <View
              key={`${i} ${med.name} ${med.dosage}`}
              style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}
              testID={testId`medication.${i}`}
            >
              <View style={{ flex: 2 }}>
                <Text style={styles.pillPurple}>{med.name}</Text>
              </View>
              <Text style={[styles.text, styles.tableCell, { flex: 1 }]}>
                {med.dosage}
              </Text>
              <Text style={[styles.text, styles.tableCell, { flex: 1.5 }]}>
                {med.frequency}
              </Text>
              <Text style={[styles.text, styles.tableCell, { flex: 1 }]}>
                {med.duration}
              </Text>
            </View>
          ))}
        </>
      )}

      {record.medicalObservations.length > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.tableLabelRow}>
            <Ionicons
              name="stats-chart-outline"
              size={13}
              style={styles.appointmentIcon}
            />
            <Text style={[styles.text, styles.sectionLabel]}>
              {content.sectionLabel.observations} (
              {record.medicalObservations.length})
            </Text>
          </View>
          <View style={styles.tableHeader}>
            <Text style={[styles.text, styles.tableHeaderCell, { flex: 2 }]}>
              {content.observationsData.title.metric}
            </Text>
            <Text style={[styles.text, styles.tableHeaderCell, { flex: 1.5 }]}>
              {content.observationsData.title.value}
            </Text>
            <Text style={[styles.text, styles.tableHeaderCell, { flex: 2 }]}>
              {content.observationsData.title.recordedAt}
            </Text>
          </View>
          {record.medicalObservations.map((obs, i) => (
            <View
              key={`${obs.metricName} ${obs.recordedTime}`}
              style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}
              testID={testId`observation.${i}`}
            >
              <Text style={[styles.text, styles.tableCell, { flex: 2 }]}>
                {obs.metricName}
              </Text>
              <View style={{ flex: 1.5 }}>
                <Text style={styles.pillBlue}>{obs.metricValue}</Text>
              </View>
              <Text style={[styles.text, styles.tableCell, { flex: 2 }]}>
                {formatDateTime(obs.recordedTime)}
              </Text>
            </View>
          ))}
        </>
      )}

      {!!record.notes && (
        <>
          <View style={styles.divider} />
          <View style={styles.tableLabelRow}>
            <Ionicons
              name="document-outline"
              size={13}
              style={styles.appointmentIcon}
            />
            <Text style={[styles.text, styles.sectionLabel]}>
              {content.sectionLabel.notes}
            </Text>
          </View>
          <Text style={[styles.text, styles.notesText]} testID={testId`notes`}>
            {record.notes}
          </Text>
        </>
      )}

      <View style={styles.divider} />
      <View style={styles.createdBar} testID={testId`createdBy`}>
        <Ionicons
          name="person-outline"
          size={13}
          style={styles.appointmentIcon}
        />
        <Text style={[styles.text, styles.footerText]}>
          {content.footerText.createdBy}{" "}
          <Text style={styles.createdByName}>{record.createdBy}</Text>
        </Text>
      </View>
    </View>
  );
};
