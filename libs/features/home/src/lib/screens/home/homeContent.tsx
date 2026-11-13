import { coverImage } from "@hms/shared-ui";
import {
  ImageBackground,
  View,
  Text,
  ListRenderItem,
  FlatList,
} from "react-native";
import { WelcomeTextContainer } from "@hms/shared-ui";
import { DoctorCard } from "../../components/doctorCard/doctorCard";
import { useCallback } from "react";
import { Doctor, Specialization, trpc } from "@hms/trpc-client";
import { SearchBox } from "@hms/shared-ui";
import SelectHolder from "../../components/selectHolder/selectHolder";
import { useHome } from "./useHome";

export function HomeContent() {
  const {
    styles,
    content,
    actions,
    selectedSpecialization,
    onSelectedSpecialization,
    onSetFilterText,
    specializations,
    filteredDoctors,
  } = useHome();

  const renderItem: ListRenderItem<Doctor> = useCallback(
    ({ item }) => (
      <DoctorCard
        prefix={item.name.slice(0, 2).toUpperCase()}
        name={item.name}
        designation={item.designation ?? ""}
        specialization={item.specialization ?? ""}
        onPress={() => actions.bookAppointment(item.employeeCode)}
      />
    ),
    [actions],
  );

  const renderSpecialization: ListRenderItem<Specialization> = useCallback(
    ({ item }) => (
      <SelectHolder
        name={item.specialization_name}
        onPress={() => {
          const newValue =
            selectedSpecialization === item.specialization_name
              ? ""
              : item.specialization_name;
          onSelectedSpecialization(newValue);
          onSetFilterText(newValue);
        }}
        isSelected={selectedSpecialization === item.specialization_name}
      />
    ),
    [selectedSpecialization],
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
        <SearchBox
          placeholder={content.search.placeHolder}
          onChangeText={onSetFilterText}
        />
        <View style={styles.container}>
          <View style={styles.contentHolder}>
            <Text style={[styles.text, styles.contentTitle]}>
              {content.contentHolder.title.specialization}
            </Text>
            <FlatList
              key="3-columns"
              data={specializations}
              keyExtractor={(item) => item._id}
              renderItem={renderSpecialization}
              numColumns={3}
            ></FlatList>
          </View>
          <View style={styles.contentHolder}>
            <Text style={[styles.text, styles.contentTitle]}>
              {content.contentHolder.title.availableDoctors}
            </Text>
            <FlatList
              horizontal
              data={filteredDoctors}
              keyExtractor={(item) => item.employeeCode}
              renderItem={renderItem}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
