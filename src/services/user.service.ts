import api from "./interceptor.service";
import { PatientModel, UserModel } from "../types/user.types";

export const getDoctors = async () => {
  try {
    const response = await api.get("appointment/getDoctors");
    return response.data as UserModel[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPatientProfile = async (email: string) => {
  try {
    const response = await api.get("user/getPatientProfile", {
      params: {
        email,
      },
    });
    return response.data as PatientModel;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPatientId = async (email: string) => {
  try {
    const response = await api.get("user/getPatientId", {
      params: {
        email,
      },
    });
    return response.data.patientId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAvailableTimeSlots = async (employeeId: string, date: Date) => {
  try {
    const response = await api.get("user/getAvailableTimeSlots", {
      params: {
        employeeId: employeeId,
        date: date,
      },
    });
    return response.data.slots;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePatientProfile = async (payload: any) => {
  try {
    const response = await api.post("user/updatePatientProfile",payload);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
