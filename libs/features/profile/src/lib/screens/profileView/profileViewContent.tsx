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
    testId,
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
      testID={testId`screen`}
    >
      <View style={styles.overlay}>
        <ProfileCard
          testId={testId`profileCard`}
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
              testId={testId`name`}
              iconName="person-outline"
              title={content.infoCard.title.name}
              value={patientData?.name}
            />
            <InfoCard
              testId={testId`gender`}
              iconName="male-outline"
              title={content.infoCard.title.gender}
              value={patientData?.gender ?? ""}
            />
            <InfoCard
              testId={testId`dob`}
              iconName="calendar-outline"
              title={content.infoCard.title.dateOfBirth}
              value={formattedDob}
            />
            <SectionDivider
              iconName="call-outline"
              title={content.sectionDivider.contactInfo}
            />
            <InfoCard
              testId={testId`phone`}
              iconName="call-outline"
              title={content.infoCard.title.phone}
              value={patientData?.phone ?? ""}
            />
            <InfoCard
              testId={testId`email`}
              iconName="mail-outline"
              title={content.infoCard.title.email}
              value={patientData?.email}
            />
            <InfoCard
              testId={testId`address`}
              iconName="location-outline"
              title={content.infoCard.title.address}
              value={patientData?.address ?? ""}
            />
            <InfoCard
              testId={testId`emergencyContact`}
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
              testID={testId`editProfile`}
            />
            <ProfileButton
              iconName="exit-outline"
              title={content.profileButton.logout}
              onAction={signOut}
              testID={testId`logout`}
            />
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}
