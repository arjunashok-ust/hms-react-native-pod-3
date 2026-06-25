import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  RefreshControl,
} from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import { recordService } from "../services/recordService";
import MedicalRecordCard from "../components/MedicalRecordCard";
import { MedicalRecord } from "../features/auth/types";

const EMPTY_ARRAY: MedicalRecord[] = [];

export default function MedicalRecordsScreen() {
  const backgroundImage = require("../../assets/images/hospital3.jpg");
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchRecords = useCallback(async () => {
    try {
      const data = await recordService.getMyRecords();
      if (isMounted.current) {
        setRecords(data);
      }
    } catch (err: any) {
      console.error("Fetch Records Failed:", err);
      Toast.show({
        type: "error",
        text1: "Fetch Failed",
        text2: err.message || "Could not load medical records.",
      });
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRecords();
    }, [fetchRecords]),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", () => {
      if (navigation.isFocused()) {
        setRefreshing(true);
        fetchRecords();
      }
    });
    return unsubscribe;
  }, [navigation, fetchRecords]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRecords();
  }, [fetchRecords]);

  const keyExtractor = useCallback(
    (item: MedicalRecord) => item._id || item.recordCode,
    [],
  );

  const renderRecordItem = useCallback(
    ({ item }: { item: MedicalRecord }) => <MedicalRecordCard record={item} />,
    [],
  );

  const renderListHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>My</Text>
        <Text style={styles.boldTitle}>Medical Records</Text>
        <Text style={styles.subtitle}>
          Records from your visits.
        </Text>
      </View>
    ),
    [],
  );

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.3 }}
    >
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        {isLoading && !refreshing ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#6C4EDB" />
            <Text style={styles.loadingText}>Loading records...</Text>
          </View>
        ) : (
          <FlatList
            data={records.length > 0 ? records : EMPTY_ARRAY}
            keyExtractor={keyExtractor}
            renderItem={renderRecordItem}
            ListHeaderComponent={renderListHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={7}
            removeClippedSubviews={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#4B1D76"]}
                tintColor="#4B1D76"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyListCard}>
                <Text style={styles.emptyListText}>
                  No medical records found.
                </Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: "#F5F6FA", 
  },
  safe: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#6B7280",
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Lexend",
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: "300",
    color: "#1E1E3F",
    fontFamily: "Montserrat",
  },
  boldTitle: {
    fontSize: 36,
    fontFamily: "Lexend",
    color: "#6C4EDB", 
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Lexend",
    color: "#6B7280",
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyListCard: {
    padding: 40,
    alignItems: "center",
  },
  emptyListText: {
    color: "#9CA3AF",
    fontStyle: "italic",
    fontFamily: "Lexend",
  },
});
