export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
};

// Add EditAppointment and its expected payload to the stack types
export type AppointmentStackParamList = {
    ViewAppointments: undefined;
    BookAppointment: undefined;
    EditAppointment: {
        appointmentData: {
            appointmentCode: string;
            doctorEmployeeID: string;
            date: string;
            timeSlot: string;
        }
    };
};