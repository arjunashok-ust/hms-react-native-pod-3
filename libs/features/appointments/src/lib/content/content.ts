import { M } from "node_modules/@trpc/server/dist/unstable-core-do-not-import-B9ZnrQAU.cjs";

export const buildEnglishContent = () => ({
  // components
  appointmentCardContent: {},
  appointmentFormBodyContent: {},
  doctorHolderContent: {},
  timeSlotContent: {},
  // screens
  appointmentEditContent: {
    welcome: {
      text1: "Edit your,",
      text2: "APPOINTMENT",
      text3: "here.",
    },
    profileButton: {
      title: {
        goBack: "GO BACK",
        cancelAppointment: "CANCEL APPOINTMENT",
        canceling: "CANCELING...",
        viewAppointments: "VIEW APPOINTMENTS",
      },
    },
    appointmentFormBodyProps: {
      title: "MODIFY ENTRY",
      formSubtitle: "Edit Appointment",
      primaryLabel: {
        save: "SAVE",
        saving: "SAVING...",
      },
    },
  },
  appointmentFormContent: {
    welcome: {
      text1: "Create your,",
      text2: "APPOINTMENT",
      text3: "here.",
    },
    appointmentFormBodyProps: {
      title: "NEW ENTRY",
      formSubtitle: "Book Appointment",
      primaryLabel: {
        create: "CREATE",
        creating: "CREATING...",
      },
      secondaryLabel: {
        clear: "CLEAR",
      },
    },
    profileButton: {
      title: {
        viewAppointments: "VIEW APPOINTMENTS",
      },
    },
  },
  appointmentListContent: {
    welcome: {
      text1: "Create your,",
      text2: "APPOINTMENT",
      text3: "here.",
    },
    profileButton: {
      title: {
        goBack: "GO BACK",
      },
    },
    searchBox: {
      placeHolder: {
        searchAppointment: "Search Appointment",
      },
    },
    formHeader: {
      title: {
        schedule: "SCHEDULE",
      },
      value: {
        yourAppointments: "Your Appointments",
      },
    },
    errors: {
      noAppointmentsScheduled: "No appointments schedules.",
    },
  },
});

export type AppointmentContent = ReturnType<typeof buildEnglishContent>;
export type AppointmentLanguage = "en";

export const defaultContent: Record<
  AppointmentLanguage,
  () => AppointmentContent
> = {
  en: buildEnglishContent,
};
