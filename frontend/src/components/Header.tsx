import React from 'react';
import { Calendar, Building, CheckCircle, RefreshCw, Sun, Moon } from 'lucide-react';
import { HeaderProps } from '../types';

export const Header: React.FC<HeaderProps> = ({
  rooms,
  meetings,
  onRefresh,
  isLoading,
  scheduleForm,
  theme,
  onToggleTheme,
}) => {
  const activeRoomsCount = rooms.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeetingsCount = meetings.filter((m) => m.startTime.startsWith(todayStr)).length;

  return (
    <header className="header-bar">
      <div className="brand-container">
        <div className="brand-logo-icon">
          <Calendar size={22} />
        </div>
        <div className="brand-text">
          <h1>Difinity Digital</h1>
          <span>Smart Room Auto-Assigner</span>
        </div>
      </div>

      <div className="header-actions">
        <div className="header-stats">
          <div className="stat-badge">
            <Building size={15} color={theme === 'dark' ? '#06b6d4' : '#0284c7'} />
            <span>Total Rooms:</span>
            <span className="stat-value">{activeRoomsCount}</span>
          </div>

          <div className="stat-badge">
            <CheckCircle size={15} color={theme === 'dark' ? '#10b981' : '#059669'} />
            <span>Today's Meetings:</span>
            <span className="stat-value">{todayMeetingsCount}</span>
          </div>

          <button
            onClick={onRefresh}
            className="btn-secondary"
            title="Refresh Data"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
        </div>

        <button
          onClick={onToggleTheme}
          className="theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={15} color="#f59e0b" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon size={15} color="#6366f1" />
              <span>Dark</span>
            </>
          )}
        </button>

        {scheduleForm}
      </div>
    </header>
  );
};
