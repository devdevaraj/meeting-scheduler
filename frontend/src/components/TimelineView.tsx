import React from 'react';
import { TimelineViewProps } from '../types';
import { Layers } from 'lucide-react';

export const TimelineView: React.FC<TimelineViewProps> = ({ rooms, meetings }) => {
  const DAY_START_HOUR = 8;
  const DAY_END_HOUR = 18;
  const TOTAL_MINUTES = (DAY_END_HOUR - DAY_START_HOUR) * 60;

  const hoursArray = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR + 1 }, (_, i) => DAY_START_HOUR + i);

  return (
    <div className="card-panel timeline-card">
      <div className="card-header-row">
        <h2 className="card-title">
          <Layers size={20} />
          <span>Daily Occupancy Timeline (08:00 - 18:00)</span>
        </h2>
      </div>

      <div style={{ display: 'flex', marginLeft: '140px', marginBottom: '0.65rem', justifyContent: 'space-between' }}>
        {hoursArray.map((h) => (
          <span key={h} style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
            {String(h).padStart(2, '0')}:00
          </span>
        ))}
      </div>

      <div className="timeline-track-container">
        {rooms.map((room) => {
          const roomMeetings = meetings.filter((m) => m.roomId === room.id);

          return (
            <div key={room.id} className="timeline-row">
              <div className="timeline-room-label">
                <span>{room.name.split(' ')[0]} {room.name.split(' ')[1]}</span>
              </div>

              <div className="timeline-track">
                {roomMeetings.map((m) => {
                  const start = new Date(m.startTime);
                  const end = new Date(m.endTime);

                  const startMins = start.getHours() * 60 + start.getMinutes();
                  const endMins = end.getHours() * 60 + end.getMinutes();

                  const offsetMins = Math.max(0, startMins - DAY_START_HOUR * 60);
                  const durationMins = Math.min(TOTAL_MINUTES - offsetMins, endMins - startMins);

                  const leftPercent = (offsetMins / TOTAL_MINUTES) * 100;
                  const widthPercent = (durationMins / TOTAL_MINUTES) * 100;

                  if (widthPercent <= 0 || leftPercent >= 100) return null;

                  return (
                    <div
                      key={m.id}
                      className="timeline-block"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${Math.max(widthPercent, 2)}%`,
                      }}
                      title={`${m.title} (${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`}
                    >
                      {m.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
