import apiClient from "./apiClient"; // Adjust import path if needed
import { MedicalRecord } from "../features/auth/types";

export const recordService = {
    getMyRecords: async (page = 1, limit = 20): Promise<MedicalRecord[]> => {
        const response = await apiClient.get(`/api/records/getPatientRecords?page=${page}&limit=${limit}`);
        // The backend returns { success: true, data: [...records], pagination: {...} }
        return response.data.data;
    },

    getRecordById: async (id: string): Promise<MedicalRecord> => {
        const response = await apiClient.get(`/api/records/getPatientRecords/${id}`);
        return response.data.data;
    }
};