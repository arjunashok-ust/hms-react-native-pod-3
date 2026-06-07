import { AppointmentModel } from "../types/appointment.types";
import { UserModel } from "../types/user.types";
import api from "./interceptor.service";

// create appointment
export const createAppointment = async (payload: AppointmentModel) => {
  try {
    await api.post("/appointment/createAppointment", payload);

    return true;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

// get appointment by patient id
export const getAppointmentsByPatientId = async (patientId: string) => {
  try {
    const response = await api.get("/appointment/getAppointmentsByPatientId", {
      params: {
        patientId,
      },
    });
    return response.data as AppointmentModel[];
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

// get doctor by employee id
export const getDoctorByEmployeeId = async (employeeId: string) => {
  try {
    const response = await api.get("/appointment/getDoctorByEmployeeId", {
      params: {
        employeeId,
      },
    });

    return response.data as UserModel;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

// edit appointment
export const editAppointmentData = async (payload: any) => {
  try {
    await api.post("/appointment/editAppointment", payload);
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

// edit appointment status
export const editAppointmentStatus = async (payload: any) => {
  try {
    await api.post("/appointment/editAppointmentStatus", payload);
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}

// delete appointment
export const deleteAppointment = async (appointmentId: string) => {
  try {
    await api.get("/appointment/deleteAppointment",{
      params: {appointmentId},
    });
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}
