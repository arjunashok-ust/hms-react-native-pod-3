import { coverImage, ProfileButton, SectionDivider } from "@hms/shared-ui";
import { StyleSheet, View, ImageBackground, ScrollView } from "react-native";
import { useHost } from "@hms/shared-util";
import { InfoCard } from "../../components/infoCard/infoCard";
import { ProfileCard } from "../../components/profileCard/profileCard";
import { usePatientProfile } from "../../hooks/usePatientProfile";
import type { ProfileScreenProps } from "../../navigation/navigationTypes";
import { useProfileContext } from "../../hooks/useProfileContext";

const formatDate = (date?: Date | string | null) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ProfileViewScreen({
  navigation,
}: ProfileScreenProps<"profileView">) {
  const { styles, content } = useProfileContext("profileViewContent");

  const { actions } = useHost();
  const { data: patientData } = usePatientProfile();

  const goToEditProfile = () => navigation.navigate("profileEdit");

  return (
    <ImageBackground
      source={coverImage}
      style={styles.wrapper}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ProfileCard
          prefix={patientData?.name.slice(0, 2).toUpperCase()}
          name={patientData?.name}
          designation={patientData?.role}
          id={patientData?.uhid}
        />
        <View style={styles.container}>
          <ScrollView>
            <SectionDivider
              iconName="person-outline"
              title={content.sectionDivider.personalInfo}
            />
            <InfoCard
              iconName="person-outline"
              title={content.infoCard.title.name}
              value={patientData?.name}
            />
            <InfoCard
              iconName="male-outline"
              title={content.infoCard.title.gender}
              value={patientData?.gender ?? ""}
            />
            <InfoCard
              iconName="calendar-outline"
              title={content.infoCard.title.dateOfBirth}
              value={formatDate(patientData?.dob)}
            />
            <SectionDivider
              iconName="call-outline"
              title={content.sectionDivider.contactInfo}
            />
            <InfoCard
              iconName="call-outline"
              title={content.infoCard.title.phone}
              value={patientData?.phone ?? ""}
            />
            <InfoCard
              iconName="mail-outline"
              title={content.infoCard.title.email}
              value={patientData?.email}
            />
            <InfoCard
              iconName="location-outline"
              title={content.infoCard.title.address}
              value={patientData?.address ?? ""}
            />
            <InfoCard
              iconName="alert-circle-outline"
              title={content.infoCard.title.emergencyContact}
              value={
                patientData?.emergencyContact ||
                content.infoCard.value.noEmergencyContact
              }
            />
            <SectionDivider
              iconName="settings-outline"
              title={content.sectionDivider.accountSettings}
            />
            <ProfileButton
              iconName="pencil-outline"
              title={content.profileButton.editProfile}
              onAction={goToEditProfile}
            />
            <ProfileButton
              iconName="exit-outline"
              title={content.profileButton.logout}
              onAction={actions.signOut}
            />
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}
