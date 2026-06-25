import apiClient from "./apiClient";
import { MedicalRecord } from "../features/auth/types";

interface PaginatedRecordsResponse {
    data: MedicalRecord[];
    pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
}

export const recordService = {
    getMyRecords: async (page = 1, limit = 5): Promise<PaginatedRecordsResponse> => {
        const response = await apiClient.get(`/api/records/getPatientRecords?page=${page}&limit=${limit}`);
        return response.data;
    },

    getRecordById: async (id: string): Promise<MedicalRecord> => {
        const response = await apiClient.get(`/api/records/getPatientRecords/${id}`);
        return response.data.data;
    }
};