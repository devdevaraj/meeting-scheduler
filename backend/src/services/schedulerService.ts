import { MeetingRoom, Meeting, CreateMeetingDTO } from '../models/types';
import { MeetingModel } from '../models/Meeting';

export class SchedulerService {
  private rooms: MeetingRoom[] = [
    { id: 1, name: 'Room 1', capacity: 4, location: 'Floor 1, East Wing' },
    { id: 2, name: 'Room 2', capacity: 6, location: 'Floor 1, West Wing' },
    { id: 3, name: 'Room 3', capacity: 8, location: 'Floor 2, Central' },
    { id: 4, name: 'Room 4', capacity: 10, location: 'Floor 2, Executive' },
    { id: 5, name: 'Room 5', capacity: 12, location: 'Floor 3, Innovation' }
  ];

  public isOverlapping(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
    return startA.getTime() < endB.getTime() && startB.getTime() < endA.getTime();
  }

  public getRooms(): MeetingRoom[] {
    return [...this.rooms];
  }

  public async getAllMeetings(): Promise<Meeting[]> {
    const docs = await MeetingModel.find().lean();
    const meetings: Meeting[] = docs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      roomId: doc.roomId,
      roomName: doc.roomName,
      startTime: doc.startTime,
      endTime: doc.endTime,
      createdAt: doc.createdAt
    }));

    return meetings.sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }

  public async getMeetingById(id: string): Promise<Meeting | undefined> {
    const doc = await MeetingModel.findOne({ id }).lean();
    if (!doc) return undefined;
    return {
      id: doc.id,
      title: doc.title,
      roomId: doc.roomId,
      roomName: doc.roomName,
      startTime: doc.startTime,
      endTime: doc.endTime,
      createdAt: doc.createdAt
    };
  }

  public async scheduleMeeting(dto: CreateMeetingDTO): Promise<{
    success: boolean;
    meeting?: Meeting;
    message: string;
  }> {
    const reqStart = new Date(dto.startTime);
    const reqEnd = new Date(dto.endTime);

    if (isNaN(reqStart.getTime()) || isNaN(reqEnd.getTime())) {
      return {
        success: false,
        message: 'Invalid start time or end time format provided.'
      };
    }

    if (reqStart.getTime() >= reqEnd.getTime()) {
      return {
        success: false,
        message: 'Meeting end time must be strictly after start time.'
      };
    }

    const allMeetings = await this.getAllMeetings();
    const sortedRooms = [...this.rooms].sort((a, b) => a.id - b.id);
    let assignedRoom: MeetingRoom | null = null;

    for (const room of sortedRooms) {
      const roomMeetings = allMeetings.filter((m) => m.roomId === room.id);

      const hasConflict = roomMeetings.some((m) =>
        this.isOverlapping(reqStart, reqEnd, new Date(m.startTime), new Date(m.endTime))
      );

      if (!hasConflict) {
        assignedRoom = room;
        break;
      }
    }

    if (!assignedRoom) {
      return {
        success: false,
        message: `No meeting room available for the time slot from ${reqStart.toLocaleTimeString()} to ${reqEnd.toLocaleTimeString()}. All 5 rooms are occupied.`
      };
    }

    const newMeeting: Meeting = {
      id: `mtg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title: dto.title.trim(),
      roomId: assignedRoom.id,
      roomName: assignedRoom.name,
      startTime: reqStart.toISOString(),
      endTime: reqEnd.toISOString(),
      createdAt: new Date().toISOString()
    };

    await MeetingModel.create(newMeeting);

    return {
      success: true,
      meeting: newMeeting,
      message: `Meeting successfully scheduled in ${assignedRoom.name}!`
    };
  }

  public async cancelMeeting(id: string): Promise<{ success: boolean; message: string }> {
    const doc = await MeetingModel.findOneAndDelete({ id }).lean();
    if (!doc) {
      return {
        success: false,
        message: `Meeting with ID '${id}' was not found.`
      };
    }

    return {
      success: true,
      message: `Meeting '${doc.title}' in ${doc.roomName} has been canceled.`
    };
  }

  public async clearAllMeetings(): Promise<void> {
    await MeetingModel.deleteMany({});
  }
}

export const schedulerService = new SchedulerService();
