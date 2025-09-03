import React from 'react';
import { ServerStatus } from '../types';
import { StatusIndicator } from './StatusIndicator';

interface ServerTableProps {
  serverStatuses: Map<string, ServerStatus>;
}

export const ServerTable: React.FC<ServerTableProps> = ({ serverStatuses }) => {
  const statuses = Array.from(serverStatuses.values());

  const ScoreDisplay: React.FC<{ allies: number; axis: number }> = ({ allies, axis }) => (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <span className="text-blue-600 dark:text-blue-400 font-medium">{allies}</span>
        <span className="text-xs text-gray-500 ml-1">Allies</span>
      </div>
      <span className="text-gray-400">|</span>
      <div className="flex items-center">
        <span className="text-red-600 dark:text-red-400 font-medium">{axis}</span>
        <span className="text-xs text-gray-500 ml-1">Axis</span>
      </div>
    </div>
  );

  if (statuses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No servers configured
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Server
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Players
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Game Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Current Map
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Next Map
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {statuses.map((server) => (
              <tr key={server.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {server.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusIndicator status={server.status} error={server.error} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {server.alliesPlayers}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">Allies</span>
                    </div>
                    <span className="text-gray-400">|</span>
                    <div className="flex items-center">
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {server.axisPlayers}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">Axis</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white font-mono">
                    {server.gameTime}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ScoreDisplay allies={server.alliesScore} axis={server.axisScore} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {server.currentMap}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {server.nextMap}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};