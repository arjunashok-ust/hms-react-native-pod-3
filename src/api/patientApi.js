import axiosInstance from "./axiosInstance";

export const registerPatient = async (data) => {
  const response = await axiosInstance.post(
    "/api/patientApp/signup",
    data
  );
  return response.data;
};

export const loginPatient = async (data) => {
  const response = await axiosInstance.post(
    "/api/patientApp/login",
    data
  );
  return response.data;
};

export const updatePatientProfile = async (data, token) => {
  const response = await axiosInstance.put(
    "/api/patientApp/updateProfile",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getAllDoctors = async () => {
  const response = await axiosInstance.get(
    "/api/patientApp/getAllDoctors"
  );

  return response.data;
};

export const createAppointment = async (data, token) => {
  const response = await axiosInstance.post(
    "/api/patientApp/createAppointment",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getPatientAppointments = async (token) => {
  const response = await axiosInstance.get(
    "/api/patientApp/getAppointments",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};