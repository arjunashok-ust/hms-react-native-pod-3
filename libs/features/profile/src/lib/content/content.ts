import { WelcomeTextContainer } from "@hms/shared-ui";

const buildEnglishContent = () => ({
  profileEditContent: {
    welcome: {
      text1: "Edit your,",
      text2: "PROFILE",
      text3: "here.",
    },
    profileButton: {
      goBack: "GO BACK",
      updating: "UPDATING...",
      updateProfile: "UPDATE PROFILE",
      cancel: "CANCEL",
    },
    formHeaderTextHolder: {
      formHeaderTitle: "UPDATE ENTRY",
      formHeaderValue: "Edit Profile",
    },
    fieldLabels: {
      name: "Name",
      email: "Email",
      address: "Address",
      phone: "Phone",
      emergencyContact: "Emergency Contact",
    },
    placeHolderText: {
      gender: "Gender",
      dateOfBirth: "DOB",
    },
    sectionDivider: {
      contactInfo: "CONTACT INFO",
      personalInfo: "PERSONAL INFO",
    },
  },

  profileViewContent: {
    sectionDivider: {
      name: "NAME",
      accountSettings: "ACCOUNT SETTINGS",
      personalInfo: "PERSONAL INFO",
      contactInfo: "CONTACT INFO"
    },
    infoCard: {
      title: {
        name: "NAME",
        gender: "GENDER",
        dateOfBirth: "DOB",
        phone: "PHONE",
        email: "EMAIL",
        address: "ADDRESS",
        emergencyContact: "EMERGENCY CONTACT",
      },
      value: {
        noEmergencyContact: "No Emergency Contact",
      },
    },
    profileButton: {
      editProfile: "EDIT PROFILE",
      logout: "LOGOUT",
    },
  },
});

export type ProfileContent = ReturnType<typeof buildEnglishContent>;
export type ProfileLanguage = "en";

export const defaultContent: Record<ProfileLanguage, () => ProfileContent> = {
  en: buildEnglishContent,
};
