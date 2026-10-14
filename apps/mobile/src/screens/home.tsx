import { coverImage } from "@hms/shared-ui";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  ListRenderItem,
  FlatList,
} from "react-native";
import { WelcomeTextContainer } from "@hms/shared-ui";
import { DoctorCard } from "../components/home/doctor-card.component";
import { useCallback, useMemo, useState } from "react";
import { Doctor, Specialization, trpc } from "@hms/trpc-client";
import SearchBox from "../components/home/search-box.component";
import SelectHolder from "../components/home/select-holder.component";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { NavigationModel } from "@hms/models";

const NO_DOCTORS: Doctor[] = [];
const NO_SPECIALIZATIONS: Specialization[] = [];

const normalize = (text: string) => text.toLowerCase().trim();

export default function HomeScreen() {
  const navigator = useNavigation<NativeStackNavigationProp<NavigationModel>>();

  const { data: doctors = NO_DOCTORS } = trpc.appointment.getDoctors.useQuery();
  const { data: specializations = NO_SPECIALIZATIONS } =
    trpc.ui.getSpecializations.useQuery();

  // Free-text search and the specialization chips share one filter, last input wins.
  const [filterText, setFilterText] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const filteredDoctors = useMemo(() => {
    const query = normalize(filterText);
    if (!query) return doctors;
    return doctors.filter(
      (doctor) =>
        normalize(doctor.name).includes(query) ||
        normalize(doctor.specialization ?? "").includes(query),
    );
  }, [doctors, filterText]);

  const renderItem: ListRenderItem<Doctor> = useCallback(
    ({ item }) => (
      <DoctorCard
        prefix={item.name.slice(0, 2).toUpperCase()}
        name={item.name}
        designation={item.designation ?? ""}
        specialization={item.specialization ?? ""}
        onPress={() => {
          navigator.navigate("tabs", {
            screen: "appointment",
            params: {
              doctorId: item.employeeCode,
            },
          });
        }}
      />
    ),
    [],
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
          setSelectedSpecialization(newValue);
          setFilterText(newValue);
        }}
        isSelected={selectedSpecialization === item.specialization_name}
      />
    ),
    [selectedSpecialization],
  );

  return (
    <ImageBackground source={coverImage} resizeMode="cover" style={styles.wrapper}>
      <View style={styles.overlay}>
        <WelcomeTextContainer
          text1="Find Experienced,"
          text2="DOCTORS"
          text3="Ready to care for you."
          isHome={true}
        />
        <SearchBox
          placeholder="Search Doctor or Specialization"
          onChangeText={setFilterText}
        />
        <View style={styles.container}>
          <View style={styles.contentHolder}>
            <Text style={[styles.text, styles.contentTitle]}>
              Specialization
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
              Available Doctors
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

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  text: {
    fontFamily: "Sans",
  },
  container: {
    backgroundColor: "rgb(255, 255, 255)",
    flex: 1,
    marginTop: 10,
    paddingVertical: 50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contentHolder: {
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
  },
  contentTitle: {
    fontSize: 16,
    color: "rgb(109, 109, 109)",
  },
});
