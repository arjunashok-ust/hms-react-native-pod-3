import { AppointmentModel } from "../types/appointment.types";
import { UserModel } from "../types/user.types";
import api from "./interceptor.service";

export const createAppointment = async (payload: AppointmentModel) => {
  try {
    await api.post("/appointment/createAppointment", payload);

    return true;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

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
