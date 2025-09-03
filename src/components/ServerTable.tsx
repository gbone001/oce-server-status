import React from 'react';
import { ServerStatus } from '../types';

interface ServerTableProps {
  serverStatuses: Map<string, ServerStatus>;
}

export const ServerTable: React.FC<ServerTableProps> = ({ serverStatuses }) => {
  const statuses = Array.from(serverStatuses.values());

  const ScoreDisplay: React.FC<{ allies: number; axis: number }> = ({ allies, axis }) => (
    <div className="inline-flex items-center gap-3">
      <span className="inline-flex items-center gap-1">
        <span className="text-blue-600 dark:text-blue-400 font-semibold tabular-nums">{allies}</span>
        <span className="text-[11px] text-gray-500">Allies</span>
      </span>
      <span className="text-gray-300 dark:text-gray-500">|</span>
      <span className="inline-flex items-center gap-1">
        <span className="text-red-600 dark:text-red-400 font-semibold tabular-nums">{axis}</span>
        <span className="text-[11px] text-gray-500">Axis</span>
      </span>
    </div>
  );

  if (statuses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No servers configured
      </div>
    );
  }

  const formatRemaining = (secs?: number) => {
    if (typeof secs !== 'number' || !isFinite(secs) || secs < 0) return '--:--';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border-collapse text-sm md:text-base">
          <colgroup>
            <col style={{ width: '24%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
          </colgroup>
          <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-10">
            <tr>
              {['Server','Short Name','Players','Score','Time Remaining','Current Map','Next Map'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {statuses.map((server) => (
              <tr
                key={server.id}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-4 py-3 border border-gray-200 dark:border-gray-700 align-middle">
                  <span className="font-medium text-gray-900 dark:text-white">{server.name}</span>
                </td>
                <td className="px-4 py-3 border border-gray-200 dark:border-gray-700 align-middle">
                  <span className="text-gray-900 dark:text-white">{server.shortName ?? '-'}</span>
                </td>
                <td className="px-4 py-3 border border-gray-200 dark:border-gray-700 align-middle text-right">
                  <div className="inline-flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold tabular-nums">{server.alliesPlayers}</span>
                      <span className="text-[11px] text-gray-500">Allies</span>
                    </span>
                    <span className="text-gray-300 dark:text-gray-500">|</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="text-red-600 dark:text-red-400 font-semibold tabular-nums">{server.axisPlayers}</span>
                      <span className="text-[11px] text-gray-500">Axis</span>
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 border border-gray-200 dark:border-gray-700 align-middle text-center">
                  <ScoreDisplay allies={server.alliesScore} axis={server.axisScore} />
                </td>
                <td className="px-4 py-3 border border-gray-200 dark:border-gray-700 align-middle text-center">
                  <span className="font-mono tabular-nums text-gray-900 dark:text-white">{formatRemaining(server.timeRemainingSeconds)}</span>
                </td>
                <td className="px-4 py-3 border border-gray-200 dark:border-gray-700 align-middle">
                  <span className="text-gray-900 dark:text-white">{server.currentMap}</span>
                </td>
                <td className="px-4 py-3 border border-gray-200 dark:border-gray-700 align-middle">
                  <span className="text-gray-900 dark:text-white">{server.nextMap}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
