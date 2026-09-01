import axios from 'axios';
import { MeetingRoom, Meeting, CreateMeetingPayload, APIResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  async getRooms(): Promise<APIResponse<MeetingRoom[]>> {
    try {
      const response = await apiClient.get<APIResponse<MeetingRoom[]>>('/rooms');
      return response.data;
    } catch (error: any) {
      console.error('API Error on GET /rooms:', error);
      if (error.response?.data) return error.response.data;
      return {
        success: false,
        message: 'Network error or backend service unavailable.',
        error: error.message || 'Unknown error',
      };
    }
  },

  async getMeetings(): Promise<APIResponse<Meeting[]>> {
    try {
      const response = await apiClient.get<APIResponse<Meeting[]>>('/meetings');
      return response.data;
    } catch (error: any) {
      console.error('API Error on GET /meetings:', error);
      if (error.response?.data) return error.response.data;
      return {
        success: false,
        message: 'Network error or backend service unavailable.',
        error: error.message || 'Unknown error',
      };
    }
  },

  async createMeeting(payload: CreateMeetingPayload): Promise<APIResponse<Meeting>> {
    try {
      const response = await apiClient.post<APIResponse<Meeting>>('/meetings', payload);
      return response.data;
    } catch (error: any) {
      console.error('API Error on POST /meetings:', error);
      if (error.response?.data) return error.response.data;
      return {
        success: false,
        message: 'No room available for requested slot.',
        error: error.message || 'Unknown error',
      };
    }
  },

  async deleteMeeting(id: string): Promise<APIResponse<void>> {
    try {
      const response = await apiClient.delete<APIResponse<void>>(`/meetings/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`API Error on DELETE /meetings/${id}:`, error);
      if (error.response?.data) return error.response.data;
      return {
        success: false,
        message: 'Cancel failed.',
        error: error.message || 'Unknown error',
      };
    }
  },
};
