import { useState, useCallback } from "react";
import {
  Text,
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MedicalRecordCard from "../components/MedicalRecordCard";
import Header from "../components/Header";
import { getMyMedicalRecords } from "../services/patientApi";

const PAGE_SIZE = 10;

const MedicalRecordScreen = () => {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [loading, setLoading] = useState(true); // first load
  const [loadingMore, setLoadingMore] = useState(false); // appending next page
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh

  
  const loadFirstPage = async () => {
    try {
      const res = await getMyMedicalRecords(1, PAGE_SIZE);
      setRecords(res.data || []);
      setHasNextPage(res.meta?.hasNextPage || false);
      setPage(1);
    } catch (error) {
      console.log(error);
      setRecords([]);
      setHasNextPage(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadFirstPage().finally(() => setLoading(false));
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFirstPage();
    setRefreshing(false);
  }, []);

  /* Append the next page when the user scrolls near the bottom. */
  const loadMore = async () => {
    if (loadingMore || !hasNextPage) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getMyMedicalRecords(nextPage, PAGE_SIZE);
      setRecords((prev) => [...prev, ...(res.data || [])]);
      setHasNextPage(res.meta?.hasNextPage || false);
      setPage(nextPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const renderRecord = useCallback(
    ({ item }) => <MedicalRecordCard item={item} />,
    [],
  );

  const ListHeader = (
    <>
      <Text style={styles.heading}>My</Text>
      <Text style={styles.headingHighlight}>Medical Records</Text>
      <Text style={styles.subHeading}>
        Finalized records from your visits, shared by your doctor.
      </Text>
    </>
  );

  const ListEmpty = loading ? (
    <Text style={styles.info}>Loading records...</Text>
  ) : (
    <View style={styles.card}>
      <Text style={styles.info}>No medical records available yet.</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title="Medical Records" />

      <FlatList
        data={records}
        keyExtractor={(item) => item._id}
        renderItem={renderRecord}
        contentContainerStyle={styles.container}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color="#6B46C1"
              style={{ marginVertical: 16 }}
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6B46C1"]}
            tintColor="#6B46C1"
          />
        }
      />
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
