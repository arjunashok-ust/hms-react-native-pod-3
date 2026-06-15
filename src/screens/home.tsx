const BgImage = require("../../assets/img/cover.jpg");
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  ListRenderItem,
  FlatList,
} from "react-native";
import { WelcomeTextContainer } from "../components/auth/welcome-text-container";
import { DoctorCard } from "../components/home/doctor-card.component";
import { useCallback, useEffect, useState } from "react";
import { UserModel } from "../types/user.types";
import { getDoctors } from "../services/user.service";
import SearchBox from "../components/home/search-box.component";
import SelectHolder from "../components/home/select-holder.component";
import { getSpecializations } from "../services/ui.service";
import { SpecializationModel } from "../types/ui.types";

export default function HomeScreen() {
  const [doctors, setDoctors] = useState<UserModel[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<UserModel[]>([]);

  const [specializations, setSpecializations] = useState<SpecializationModel[]>(
    [],
  );
  const [selectedSpecialization, setSelectedSpecialization] = useState<
    UserModel[]
  >([]);

  const [searchText, setSearchText] = useState("");

  const renderItem: ListRenderItem<UserModel> = useCallback(
    ({ item }) => (
      <DoctorCard
        prefix={item.name.slice(0, 2).toUpperCase()}
        name={item.name}
        designation={item.designation}
        specialization={item.specialization}
      />
    ),
    [],
  );

  const renderSpecialization: ListRenderItem<SpecializationModel> = useCallback(
    ({ item }) => (
      <SelectHolder
        name={item.specialization_name}
        onPress={() => {
          filterData(item.specialization_name);
        }}
      />
    ),
    [],
  );

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
  }, []);

  const fetchDoctors = async () => {
    const data = await getDoctors();
    setDoctors(data);
    setFilteredDoctors(data);
  };

  const fetchSpecializations = async () => {
    const data = await getSpecializations();
    setSpecializations(data);
  };

  const filterData = async (value: string) => {
    setSearchText(value);

    if (!value.trim()) {
      setFilteredDoctors(doctors);
      return;
    }

    const data = doctors.filter((doctor) => {
      const doctor_search = doctor.name
        .toLowerCase()
        .includes(value.toLowerCase());
      const specialization_search = doctor.specialization
        .toLowerCase()
        .includes(value.toLowerCase());
      return doctor_search || specialization_search;
    });

    setFilteredDoctors(data);
  };

  return (
    <ImageBackground source={BgImage} resizeMode="cover" style={styles.wrapper}>
      <View style={styles.overlay}>
        <WelcomeTextContainer
          text1="Find Experienced,"
          text2="DOCTORS"
          text3="Ready to care for you."
          isHome={true}
        />
        <SearchBox
          placeholder="Search Doctor or Specialization"
          onChangeText={filterData}
        />
        <View style={styles.contentHolder}>
          <Text style={[styles.text, styles.contentTitle]}>Specialization</Text>
          <FlatList
            horizontal
            data={specializations}
            keyExtractor={(item) => item.specialization_id.toString()}
            renderItem={renderSpecialization}
            showsHorizontalScrollIndicator={false}
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
  contentHolder: {
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: "rgb(255, 255, 255)",
    borderColor: "rgba(61, 11, 105, 0.3)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  contentTitle: {
    fontSize: 12,
    color: "rgb(91, 91, 91)",
  },
});
