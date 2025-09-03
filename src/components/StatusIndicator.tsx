import React from 'react';

interface StatusIndicatorProps {
  status: 'success' | 'error';
  error?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, error }) => {
  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full mr-2 ${
        status === 'success' 
          ? 'bg-green-500 animate-pulse' 
          : 'bg-red-500'
      }`} />
      <span className={`text-sm font-medium ${
        status === 'success'
          ? 'text-green-600 dark:text-green-400'
          : 'text-red-600 dark:text-red-400'
      }`}>
        {status === 'success' ? 'Online' : 'Offline'}
      </span>
      {error && (
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400" title={error}>
          ({error})
        </span>
      )}
    </div>
  );
};