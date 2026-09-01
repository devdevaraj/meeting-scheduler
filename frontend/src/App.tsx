import React, { useEffect, useState, useCallback } from 'react';
import { api } from './services/api';
import { MeetingRoom, Meeting, CreateMeetingPayload, ToastMessage } from './types';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { ScheduleForm } from './components/ScheduleForm';
import { TimelineView } from './components/TimelineView';
import { MeetingList } from './components/MeetingList';
import { ToastNotification } from './components/ToastNotification';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    const newToast: ToastMessage = { id, type, title, description };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const [roomsRes, meetingsRes] = await Promise.all([api.getRooms(), api.getMeetings()]);

    if (roomsRes.success && roomsRes.data) {
      setRooms(roomsRes.data);
    }

    if (meetingsRes.success && meetingsRes.data) {
      setMeetings(meetingsRes.data);
    } else if (!meetingsRes.success) {
      addToast('error', 'Connection Error', meetingsRes.message || 'Failed to connect to backend server');
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSchedule = async (payload: CreateMeetingPayload): Promise<boolean> => {
    setIsSubmitting(true);
    const response = await api.createMeeting(payload);
    setIsSubmitting(false);

    if (response.success && response.data) {
      addToast(
        'success',
        'Meeting Scheduled Successfully',
        `Assigned to ${response.data.roomName}`
      );
      fetchData();
      return true;
    } else {
      addToast(
        'error',
        'Scheduling Rejected',
        response.message || 'No room available for requested slot.'
      );
      return false;
    }
  };

  const handleCancel = async (id: string) => {
    setCancelingId(id);
    const response = await api.deleteMeeting(id);
    setCancelingId(null);

    if (response.success) {
      addToast('info', 'Meeting Canceled', response.message);
      fetchData();
    } else {
      addToast('error', 'Cancel Failed', response.message);
    }
  };

  return (
    <div className="app-container">
      <Header
        rooms={rooms}
        meetings={meetings}
        onRefresh={fetchData}
        isLoading={isLoading}
        theme={theme}
        onToggleTheme={toggleTheme}
        scheduleForm={<ScheduleForm onSchedule={handleSchedule} isSubmitting={isSubmitting} />}
      />

      <TimelineView rooms={rooms} meetings={meetings} />

      <MeetingList
        meetings={meetings}
        rooms={rooms}
        onCancel={handleCancel}
        cancelingId={cancelingId}
        scheduleForm={<ScheduleForm onSchedule={handleSchedule} isSubmitting={isSubmitting} />}
      />

      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
