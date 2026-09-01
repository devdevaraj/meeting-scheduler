import React from 'react';
import { RoomGridProps } from '../types';
import { Users, MapPin, Clock } from 'lucide-react';

export const RoomGrid: React.FC<RoomGridProps> = ({ rooms, meetings }) => {
  const now = new Date();

  return (
    <div className="rooms-grid">
      {rooms.map((room) => {
        const currentMeeting = meetings.find((m) => {
          if (m.roomId !== room.id) return false;
          const start = new Date(m.startTime);
          const end = new Date(m.endTime);
          return now >= start && now < end;
        });

        const isBusy = !!currentMeeting;
        const totalRoomMeetings = meetings.filter((m) => m.roomId === room.id).length;

        return (
          <div key={room.id} className="room-card">
            <div className="room-card-top">
              <span className="room-title">{room.name}</span>
              <span className={`status-badge ${isBusy ? 'busy' : 'available'}`}>
                <span className="status-dot"></span>
                {isBusy ? 'Occupied' : 'Available'}
              </span>
            </div>

            <div className="room-info-item">
              <Users size={13} />
              <span>Cap: {room.capacity} seats</span>
            </div>
            <div className="room-info-item">
              <MapPin size={13} />
              <span>{room.location}</span>
            </div>
            <div className="room-info-item" style={{ color: 'var(--brand-cyan)', fontWeight: 600 }}>
              <Clock size={13} />
              <span>{totalRoomMeetings} meeting{totalRoomMeetings === 1 ? '' : 's'} booked</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
