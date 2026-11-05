import { coverImage } from "@hms/shared-ui";
import {
  ImageBackground,
  View,
  Text,
  FlatList,
  ListRenderItem,
} from "react-native";
import { WelcomeTextContainer } from "@hms/shared-ui";
import { FormHeader } from "@hms/shared-ui";
import { useCallback, memo } from "react";
import { MedicalRecord } from "@hms/trpc-client";
import { useViewMedicalRecord } from "./useViewMedicalRecord";
import { MedicalRecordCardComponent } from "../../components/medicalRecordCard/medicalRecordCard";

const MedicalRecordCard = memo(MedicalRecordCardComponent);

export function ViewMedicalRecordContent() {
  const {
    styles,
    content,
    handleToggle,
    expandedId,
    records,
    loadMore,
    isFetching,
  } = useViewMedicalRecord();

  const renderItem: ListRenderItem<MedicalRecord> = useCallback(
    ({ item }) => (
      <MedicalRecordCard
        record={item}
        isExpanded={expandedId === item.medicalRecordId}
        onToggle={() => handleToggle(item.medicalRecordId)}
      />
    ),
    [expandedId, handleToggle],
  );

  return (
    <ImageBackground
      source={coverImage}
      resizeMode="cover"
      style={styles.wrapper}
    >
      <View style={styles.overlay}>
        <WelcomeTextContainer
          text1={content.welcome.text1}
          text2={content.welcome.text2}
          text3={content.welcome.text3}
          isHome={true}
        />
        <View style={styles.container}>
          <FormHeader title={content.header.title} value={content.header.value} />
          {records.length === 0 && !isFetching && (
            <Text style={[styles.noRecordsText, styles.text]}>
              {content.errors.noRecordsFound}
            </Text>
          )}
          <FlatList
            data={records}
            keyExtractor={(item) => item.medicalRecordId}
            renderItem={renderItem}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            windowSize={5}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetching ? (
                <Text style={{ textAlign: "center" }}>{content.loaders.loading}</Text>
              ) : null
            }
          />
        </View>
      </View>
    </ImageBackground>
  );
}
