import React from 'react';
import { HARDWARE_COMPONENTS } from '../data/hardware';

export const HardwareHealth: React.FC = () => {
  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-estuary-950">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-estuary-700/80 gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-microchip text-estuary-400"></i>
              10-Part Off-Grid Buoy Hardware Inventory
            </h2>
            <p className="text-xs text-estuary-300 mt-1">
              Active telemetry & physical diagnostic health of IoT components across deployed buoy nodes.
            </p>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            ALL READINGS SIMULATED (DEMO MODE)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HARDWARE_COMPONENTS.map((item) => {
            const isAlert = item.status === 'DIRT ALERT';
            return (
              <div
                key={item.id}
                className="bg-estuary-900/80 p-4 rounded-xl border border-estuary-700/60 shadow-lg hover:border-estuary-400/40 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <i className="fa-solid fa-hard-drive text-estuary-400"></i> {item.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      isAlert
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 min-h-[32px]">{item.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono bg-estuary-950/60 p-2.5 rounded-lg border border-estuary-800">
                  {Object.entries(item.metrics).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-slate-400 text-[10px] block">{key}:</span>
                      <span
                        className={`font-bold ${
                          val.includes('OK') || val.includes('Clean') || val.includes('-68')
                            ? 'text-emerald-400'
                            : val.includes('Moderate') || val.includes('62%')
                            ? 'text-amber-300'
                            : 'text-white'
                        }`}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
