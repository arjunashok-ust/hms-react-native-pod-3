import { coverImage, ProfileButton, SectionDivider } from "@hms/shared-ui";
import { View, ImageBackground, ScrollView } from "react-native";
import { InfoCard } from "../../components/infoCard/infoCard";
import { ProfileCard } from "../../components/profileCard/profileCard";
import type { ProfileScreenProps } from "../../navigation/navigationTypes";
import { useProfileViewContent } from "./useProfileViewContent";

type Props = Pick<ProfileScreenProps<"profileView">, "navigation">;

export default function ProfileViewContent({ navigation }: Props) {
  const {
    styles,
    content,
    patientData,
    formattedDob,
    goToEditProfile,
    signOut,
  } = useProfileViewContent(navigation);

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
              value={formattedDob}
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
              onAction={signOut}
            />
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}
