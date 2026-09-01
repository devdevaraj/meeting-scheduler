import React from 'react';

export interface MeetingRoom {
  id: number;
  name: string;
  capacity: number;
  location: string;
}

export interface Meeting {
  id: string;
  title: string;
  roomId: number;
  roomName: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface CreateMeetingPayload {
  title: string;
  startTime: string;
  endTime: string;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description: string;
}

export type Theme = 'dark' | 'light';

export interface HeaderProps {
  rooms: MeetingRoom[];
  meetings: Meeting[];
  onRefresh: () => void;
  isLoading: boolean;
  scheduleForm?: React.ReactNode;
  theme: Theme;
  onToggleTheme: () => void;
}

export interface RoomGridProps {
  rooms: MeetingRoom[];
  meetings: Meeting[];
}

export interface TimelineViewProps {
  rooms: MeetingRoom[];
  meetings: Meeting[];
}

export interface MeetingListProps {
  meetings: Meeting[];
  rooms: MeetingRoom[];
  onCancel: (id: string) => void;
  cancelingId: string | null;
  scheduleForm?: React.ReactNode;
}

export interface ScheduleFormProps {
  onSchedule: (payload: CreateMeetingPayload) => Promise<boolean>;
  isSubmitting: boolean;
}

export interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}
