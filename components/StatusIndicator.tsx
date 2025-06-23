
import React from 'react';
import { SystemStatus } from '../types';
import { STATUS_COLORS, STATUS_TEXT_COLORS } from '../constants';

interface StatusIndicatorProps {
  status: SystemStatus;
  showText?: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, showText = true }) => {
  const colorClass = STATUS_COLORS[status] || 'bg-gray-500 border-gray-400';
  const textColorClass = STATUS_TEXT_COLORS[status] || 'text-gray-200';

  return (
    <div className="flex items-center space-x-2">
      <span className={`w-3 h-3 rounded-full border-2 ${colorClass} ${status === SystemStatus.Alarm ? 'animate-ping-slow' : ''}`}></span>
      {showText && <span className={`text-xs font-medium ${textColorClass}`}>{status}</span>}
    </div>
  );
};

// Add a custom animation for a slower ping if needed in tailwind.config.js, or use existing animate-pulse
// For now, using animate-pulse from constants.ts for Alarm status.

export default StatusIndicator;
