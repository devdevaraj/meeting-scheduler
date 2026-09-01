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

export interface CreateMeetingDTO {
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
