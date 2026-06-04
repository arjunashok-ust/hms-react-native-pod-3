import api from "./interceptor.service";
import { PatientModel, UserModel } from "../types/user.types";

export const getDoctors = async () => {
  try {
    const response = await api.get("appointment/getDoctors");
    return response.data.map((user: UserModel) => ({
      name: user.name,
      email: user.email,
      employeeCode: user.employeeCode,
      department: user.department,
      designation: user.designation,
      role: user.role,
      status: user.status,
      consultationFee: user.consultationFee,
      qualification: user.qualification,
      specialization: user.specialization,
      medicalRegistrationNo: user.medicalRegistrationNo,
      joiningDate: user.joiningDate,
      availabilitySlots: user.availabilitySlots || [],
    }));
  } catch (err) {
    console.error(err);
  }
};

export const getPatientProfile = async (email: string) => {
  try {
    const response = await api.get("user/getPatientProfile", {
      params: {
        email: email,
      },
    });
    const user = response.data;
    return {
      name: user.name,
      uhid: user.uhid,
      dob: user.dob,
      gender: user.gender,
      email: user.email,
      address: user.address,
      phone: user.phone,
      emergencyContact: user.emergencyContact,
      status: user.status,
      role: user.role,
      isVerified: user.isVerified,
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getPatientId = async (email:string) => {
  try{
    const response = await api.get('user/getPatientId',{
      params: {
        email: email,
      }
    })
    return response.data.patientId;
  } catch(err){
    console.error(err);
    throw err;
  }
}

export const getAvailableTimeSlots = async (employeeId:string,date:Date) => {
  try{
    const response = await api.get('user/getAvailableTimeSlots',{
      params: {
        employeeId: employeeId,
        date: date,
      }
    });
    return response.data.slots;
  } catch(err){
    console.error(err);
    throw err;
  }
}
