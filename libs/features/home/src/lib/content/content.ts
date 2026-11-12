const buildEnglishContent = () => ({
  homeContent: {
    welcome: {
      text1: "Find Experienced,",
      text2: "DOCTORS",
      text3: "Ready to care for you.",
    },
    search: {
      placeHolder: {
        searchDoctorOrSpecialization: "Search Doctor or Specialization",
      },
    },
    contentHolder: {
      title: {
        specialization: "Specialization",
        availableDoctors: "Available Doctors",
      },
    },
  },
});

export type HomeContent = ReturnType<typeof buildEnglishContent>;
export type HomeLanguage = "en";

export const defaultContent: Record<HomeLanguage, () => HomeContent> = {
  en: buildEnglishContent,
};
