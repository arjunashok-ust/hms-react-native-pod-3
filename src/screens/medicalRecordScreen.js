import { useState, useCallback } from "react";
import {
  Text,
  ScrollView,
  FlatList,
  View,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MedicalRecordCard from "../components/MedicalRecordCard";
import Header from "../components/Header";
import { getMyMedicalRecords } from "../services/patientApi";

const MedicalRecordScreen = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, []),
  );

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await getMyMedicalRecords();
      setRecords(response.data || []);
    } catch (error) {
      console.log(error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const renderRecord = useCallback(
    ({ item }) => <MedicalRecordCard item={item} />,
    [],
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title="Medical Records" />

      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>My</Text>
      <Text style={styles.headingHighlight}>Medical Records</Text>
      <Text style={styles.subHeading}>
        Finalized records from your visits, shared by your doctor.
      </Text>

      {loading ? (
        <Text style={styles.info}>Loading records...</Text>
      ) : records.length > 0 ? (
        <FlatList
          data={records}
          keyExtractor={(item) => item._id}
          renderItem={renderRecord}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.card}>
          <Text style={styles.info}>No medical records available yet.</Text>
        </View>
      )}
      </ScrollView>
    </View>
  );
};

export default MedicalRecordScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F4F7",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1C2143",
  },

  headingHighlight: {
    fontSize: 36,
    fontWeight: "800",
    color: "#6B46C1",
    marginBottom: 8,
  },

  subHeading: {
    fontSize: 15,
    color: "#7B7B93",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 25,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  info: {
    fontSize: 15,
    color: "#666",
  },
});
