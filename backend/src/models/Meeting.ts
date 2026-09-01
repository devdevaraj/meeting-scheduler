import mongoose, { Schema, Document } from 'mongoose';

export interface IMeetingDocument extends Document {
  id: string;
  title: string;
  roomId: number;
  roomName: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

const meetingSchema = new Schema<IMeetingDocument>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    roomId: { type: Number, required: true },
    roomName: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    createdAt: { type: String, required: true }
  },
  {
    timestamps: false,
    versionKey: false
  }
);

export const MeetingModel = mongoose.model<IMeetingDocument>('Meeting', meetingSchema);
