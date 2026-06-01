import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  ScrollView,
  StatusBar,
} from "react-native";
import BgImage from "../../assets/img/cover.jpg";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SectionDivider } from "../components/profile/section-divider.component";
import { InfoCard } from "../components/profile/info-card.component";
import { ProfileCard } from "../components/profile/profile-card.component";
import { TimeSlotHolder } from "../components/profile/time-slot-holder";

export default function ProfileScreen() {
  return (
    <ImageBackground source={BgImage} style={styles.wrapper} resizeMode="cover">
      <View style={styles.overlay}>
        <ProfileCard
          prefix="AYU"
          name="Ayush Kumar Dash"
          designation="Head Doctor"
          id="EMP-000001"
        />
        <LinearGradient
          style={styles.container}
          colors={["rgba(255, 61, 77, 0.05)", "rgba(20, 4, 30, 0.9)"]}
        >
          <ScrollView>
            <SectionDivider
              iconName="briefcase-outline"
              title="PROFESSIONAL INFO"
            />
            <InfoCard
              iconName="mail-outline"
              title="EMAIL ADDRESS"
              value="ayush@gmail.com"
            />
            <InfoCard
              iconName="medal-outline"
              title="MEDICAL REG NO."
              value="MED-000001"
            />
            <InfoCard
              iconName="business-outline"
              title="DEPARTMENT"
              value="IPD"
            />
            <InfoCard
              iconName="school-outline"
              title="QUALIFICATION"
              value="MBBS, MD(Cardiology)"
            />
            <InfoCard
              iconName="medkit-outline"
              title="SPECIALIZATION"
              value="Cardiology"
            />
            <InfoCard
              iconName="calendar-outline"
              title="JOINING DATE"
              value="22 May, 2026"
            />
            <SectionDivider
              iconName="chatbubble-outline"
              title="CONSULTATION"
            />
            <InfoCard
              iconName="cash-outline"
              title="CONSULTATION FEE"
              value="$799"
            />
            <SectionDivider iconName="time-outline" title="TIME SLOT" />
            <View style={styles.slotContainer}>
              <TimeSlotHolder slot="10 : 00 - 10 : 30"></TimeSlotHolder>
              <TimeSlotHolder slot="10 : 00 - 10 : 30"></TimeSlotHolder>
              <TimeSlotHolder slot="10 : 00 - 10 : 30"></TimeSlotHolder>
              <TimeSlotHolder slot="10 : 00 - 10 : 30"></TimeSlotHolder>
            </View>
          </ScrollView>
        </LinearGradient>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  text: {
    fontFamily: "Sans",
  },

  subHeader: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 0,
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "rgba(121, 89, 89, 0.4)",
    borderColor: "rgba(205, 69, 255, 0.3)",
    borderWidth: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  subHeaderItem: {
    flexDirection: "row",
  },
  labelText: {
    fontSize: 16,
    lineHeight: 18,
    color: "white",
    marginHorizontal: 10,
  },
  valueText: {
    fontSize: 14,
    lineHeight: 20,
    color: "white",
    backgroundColor: "rgba(207, 75, 255, 0.6)",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },

  container: {
    flex: 1,
    borderRadius: 19,
    marginTop: 13,
    marginHorizontal: 20,
    borderColor: "rgba(207, 75, 255, 0.2)",
    borderWidth: 1,
    marginBottom: 30,
  },

  slotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin:20,
    marginBottom:50,
  },
});