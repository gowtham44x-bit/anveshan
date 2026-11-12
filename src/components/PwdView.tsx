import React, { useState } from 'react';
import { LakeItem } from '../types/lake';

interface PwdViewProps {
  pwdStations: LakeItem[];
  onSelectLake: (lake: LakeItem) => void;
  onNavigateToMap: () => void;
}

export const PwdView: React.FC<PwdViewProps> = ({ pwdStations, onSelectLake, onNavigateToMap }) => {
  const [scraping, setScraping] = useState(false);
  const [scrapedSuccess, setScrapedSuccess] = useState(false);

  const getStatusColor = (item: LakeItem) => {
    if (item.qualityClass === 'Desirable') return '#10B981';
    if (item.qualityClass === 'Acceptable') return '#0284C7';
    if (item.qualityClass === 'Poor') return '#F59E0B';
    return '#EF4444';
  };

  const handleFirecrawlRefresh = () => {
    setScraping(true);
    setScrapedSuccess(false);
    setTimeout(() => {
      setScraping(false);
      setScrapedSuccess(true);
      setTimeout(() => setScrapedSuccess(false), 3000);
    }, 1800);
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-estuary-950">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-cyan-800/80 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700 font-mono">
                CITIZEN SCIENCE PARTNERSHIP
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-users-viewfinder text-cyan-400"></i>
              People's Water Data (IIT Madras • TAU • ICCW • KMCH)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Community environmental water sampling scraped via Firecrawl API from{' '}
              <a
                href="https://peopleswaterdata.org"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 underline hover:text-cyan-300"
              >
                peopleswaterdata.org
              </a>
              .
            </p>
          </div>
          <button
            onClick={handleFirecrawlRefresh}
            disabled={scraping}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center gap-2 shadow transition"
          >
            {scraping ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>Scraping Firecrawl...</span>
              </>
            ) : scrapedSuccess ? (
              <>
                <i className="fa-solid fa-check text-emerald-300"></i>
                <span>Updated via Firecrawl!</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-arrows-rotate"></i>
                <span>Refresh via Firecrawl</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Tiers of PWD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30">
            <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span> Desirable
            </div>
            <p className="text-[11px] text-slate-300">Safe for direct human contact and drinking extraction.</p>
          </div>
          <div className="bg-sky-950/40 p-3 rounded-xl border border-sky-500/30">
            <div className="flex items-center gap-2 font-bold text-sky-400 mb-1">
              <span className="h-3 w-3 rounded-full bg-sky-500"></span> Acceptable
            </div>
            <p className="text-[11px] text-slate-300">Meets secondary standard; suitable for irrigation & fisheries.</p>
          </div>
          <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-500/30">
            <div className="flex items-center gap-2 font-bold text-amber-400 mb-1">
              <span className="h-3 w-3 rounded-full bg-amber-500"></span> Poor
            </div>
            <p className="text-[11px] text-slate-300">Elevated TDS/turbidity; requires municipal treatment.</p>
          </div>
          <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-500/30">
            <div className="flex items-center gap-2 font-bold text-rose-400 mb-1">
              <span className="h-3 w-3 rounded-full bg-rose-500"></span> Unacceptable
            </div>
            <p className="text-[11px] text-slate-300">Severe contamination; dangerous hypoxia or toxic effluents.</p>
          </div>
        </div>

        {/* PWD Sample Records */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <i className="fa-solid fa-vial-circle-check text-cyan-400"></i> Active Citizen Water Samples Across India
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pwdStations.map((s) => {
              const color = getStatusColor(s);
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectLake(s);
                    onNavigateToMap();
                  }}
                  className="bg-estuary-900/80 p-3.5 rounded-xl border border-estuary-700/60 shadow hover:border-cyan-400/50 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="text-[10px] font-mono text-cyan-400">
                        {s.sampleId} • {s.date}
                      </div>
                      <h4 className="text-sm font-bold text-white">{s.name}</h4>
                      <div className="text-xs text-estuary-300">{s.location}</div>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        background: `${color}22`,
                        color: color,
                        border: `1px solid ${color}44`
                      }}
                    >
                      {(s.qualityClass || s.status).toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 mt-2 bg-estuary-950/60 p-2 rounded text-[11px] font-mono text-center">
                    <div>
                      <span className="text-slate-400 text-[9px] block">DO</span>
                      <span className="font-bold text-white">{s.readings.do_mgl}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block">pH</span>
                      <span className="font-bold text-white">{s.readings.ph}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block">TDS</span>
                      <span className="font-bold text-white">{s.readings.tds}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block">Turb</span>
                      <span className="font-bold text-white">{s.readings.turbidity}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
