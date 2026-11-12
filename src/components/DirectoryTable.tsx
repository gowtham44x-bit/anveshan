import React, { useState } from 'react';
import { LakeItem } from '../types/lake';

interface DirectoryTableProps {
  lakes: LakeItem[];
  onSelectLake: (lake: LakeItem) => void;
  onNavigateToMap: () => void;
}

export const DirectoryTable: React.FC<DirectoryTableProps> = ({ lakes, onSelectLake, onNavigateToMap }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusColor = (item: LakeItem) => {
    if (item.source === 'pwd' && item.qualityClass) {
      if (item.qualityClass === 'Desirable') return '#10B981';
      if (item.qualityClass === 'Acceptable') return '#0284C7';
      if (item.qualityClass === 'Poor') return '#F59E0B';
      return '#EF4444';
    }
    if (item.status === 'Critical') return '#EF4444';
    if (item.status === 'Warning') return '#F59E0B';
    return '#10B981';
  };

  const filteredLakes = lakes.filter((item) => {
    if (filterStatus !== 'all') {
      const currentStat = (item.qualityClass || item.status).toLowerCase();
      if (filterStatus === 'critical' && currentStat !== 'critical' && currentStat !== 'unacceptable') return false;
      if (filterStatus === 'warning' && currentStat !== 'warning' && currentStat !== 'poor') return false;
      if (filterStatus === 'good' && currentStat !== 'good' && currentStat !== 'desirable' && currentStat !== 'acceptable') return false;
    }
    if (
      searchTerm &&
      !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.type.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const criticalCount = lakes.filter(l => l.status === 'Critical' || l.qualityClass === 'Unacceptable').length;
  const warningCount = lakes.filter(l => l.status === 'Warning' || l.qualityClass === 'Poor').length;
  const goodCount = lakes.filter(l => l.status === 'Good' || l.qualityClass === 'Desirable' || l.qualityClass === 'Acceptable').length;

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-estuary-950">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-estuary-700/80 gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-table-list text-estuary-400"></i>
              All-India Lake Telemetry Directory ({lakes.length} Monitored Stations)
            </h2>
            <p className="text-xs text-estuary-300 mt-1">
              National water quality database covering all Indian states and ecological regions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus(filterStatus === 'critical' ? 'all' : 'critical')}
              className={`px-2.5 py-1 rounded border text-xs font-mono font-bold transition ${
                filterStatus === 'critical'
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}
            >
              {criticalCount} Critical
            </button>
            <button
              onClick={() => setFilterStatus(filterStatus === 'warning' ? 'all' : 'warning')}
              className={`px-2.5 py-1 rounded border text-xs font-mono font-bold transition ${
                filterStatus === 'warning'
                  ? 'bg-amber-500 text-white border-amber-400'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              {warningCount} Warning
            </button>
            <button
              onClick={() => setFilterStatus(filterStatus === 'good' ? 'all' : 'good')}
              className={`px-2.5 py-1 rounded border text-xs font-mono font-bold transition ${
                filterStatus === 'good'
                  ? 'bg-emerald-500 text-white border-emerald-400'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {goodCount} Good
            </button>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-estuary-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search by lake name, state, location, or ecological type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-estuary-900/80 border border-estuary-700 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-100 placeholder-estuary-400/60 focus:outline-none focus:border-estuary-400"
            />
          </div>
          {filterStatus !== 'all' && (
            <button
              onClick={() => setFilterStatus('all')}
              className="px-3 py-2 rounded-lg bg-estuary-800 text-xs text-estuary-300 hover:text-white border border-estuary-700"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-estuary-900/80 rounded-xl border border-estuary-700/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto max-h-[65vh]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-estuary-950/80 text-estuary-300 uppercase tracking-wider text-[10px] sticky top-0 border-b border-estuary-700">
                <tr>
                  <th className="p-3">Lake Name</th>
                  <th className="p-3">State / Location</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">DO (mg/L)</th>
                  <th className="p-3">pH</th>
                  <th className="p-3">TDS (ppm)</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-estuary-800 text-slate-200">
                {filteredLakes.map((item) => {
                  const color = getStatusColor(item);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => {
                        onSelectLake(item);
                        onNavigateToMap();
                      }}
                      className="hover:bg-estuary-800/60 transition cursor-pointer"
                    >
                      <td className="p-3 font-bold text-white flex items-center gap-1.5">
                        <span>{item.source === 'pwd' ? '💧' : '🛰️'}</span>
                        <span>{item.name}</span>
                      </td>
                      <td className="p-3 text-estuary-300">{item.location}</td>
                      <td className="p-3 text-cyan-300 text-[11px]">{item.type}</td>
                      <td className="p-3">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold"
                          style={{
                            background: `${color}22`,
                            color: color,
                            border: `1px solid ${color}44`
                          }}
                        >
                          {(item.qualityClass || item.status).toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-bold">{item.score}</td>
                      <td className="p-3">{item.readings.do_mgl}</td>
                      <td className="p-3">{item.readings.ph}</td>
                      <td className="p-3">{item.readings.tds}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLake(item);
                            onNavigateToMap();
                          }}
                          className="px-2 py-1 rounded bg-estuary-600 hover:bg-estuary-500 text-white text-[10px] transition"
                        >
                          Inspect & Diagnose
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
