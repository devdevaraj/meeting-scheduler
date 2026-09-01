import React, { useState } from 'react';
import { MeetingListProps } from '../types';
import { Calendar, Trash2, Search, Filter, Clock } from 'lucide-react';

export const MeetingList: React.FC<MeetingListProps> = ({ meetings, rooms, onCancel, cancelingId, scheduleForm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<number | 'ALL'>('ALL');

  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.roomName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoom = selectedRoomFilter === 'ALL' || m.roomId === selectedRoomFilter;
    return matchesSearch && matchesRoom;
  });

  const formatDateTime = (isoStr: string) => {
    const d = new Date(isoStr);
    return {
      date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="card-panel">
      <div className="card-header-row">
        <h2 className="card-title">
          <Calendar size={20} />
          <span>Scheduled Meetings ({filteredMeetings.length})</span>
        </h2>

        {scheduleForm}
      </div>

      <div className="controls-row">
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            className="form-input search-input"
            style={{ paddingLeft: '2.25rem', width: '100%' }}
            placeholder="Search meetings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--brand-cyan)" />
          <select
            className="form-input"
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            value={selectedRoomFilter}
            onChange={(e) => setSelectedRoomFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
          >
            <option value="ALL">All Rooms (1-5)</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredMeetings.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} strokeWidth={1} />
          <h3>No Meetings Found</h3>
          <p>There are no scheduled meetings matching your search filter.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="meetings-table">
            <thead>
              <tr>
                <th>Meeting Title</th>
                <th>Assigned Room</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeetings.map((mtg) => {
                const startInfo = formatDateTime(mtg.startTime);
                const endInfo = formatDateTime(mtg.endTime);
                const isCanceling = cancelingId === mtg.id;

                return (
                  <tr key={mtg.id}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.925rem' }}>{mtg.title}</strong>
                    </td>
                    <td>
                      <span className="room-pill">
                        {mtg.roomName}
                      </span>
                    </td>
                    <td>{startInfo.date}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                        <Clock size={14} color="var(--brand-blue)" />
                        <span>{startInfo.time} - {endInfo.time}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn-cancel"
                        onClick={() => onCancel(mtg.id)}
                        disabled={isCanceling}
                        title="Cancel this meeting and release room"
                      >
                        <Trash2 size={13} />
                        <span>{isCanceling ? 'Canceling...' : 'Cancel'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
