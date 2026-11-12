import React, { useState } from 'react';
import { LakeItem, DiagnosisResult } from '../types/lake';
import { requestLakeDiagnosis } from '../services/n8nService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SidePanelProps {
  lake: LakeItem;
  isOpen: boolean;
  onClose: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({ lake, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const statusColor = getStatusColor(lake);
  const isPwd = lake.source === 'pwd';

  const handleRunDiagnosis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestLakeDiagnosis(lake);
      setDiagnosis(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to n8n AI workflow');
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
    datasets: [
      {
        label: 'Dissolved O2 (mg/L)',
        data: [
          Math.max(0.5, +(lake.readings.do_mgl + 0.6).toFixed(1)),
          Math.max(0.5, +(lake.readings.do_mgl + 0.4).toFixed(1)),
          Math.max(0.5, +(lake.readings.do_mgl + 0.2).toFixed(1)),
          lake.readings.do_mgl,
          Math.max(0.5, +(lake.readings.do_mgl - 0.2).toFixed(1)),
          Math.max(0.5, +(lake.readings.do_mgl - 0.1).toFixed(1)),
          lake.readings.do_mgl
        ],
        borderColor: '#2DD4BF',
        backgroundColor: 'rgba(45, 212, 191, 0.12)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(20, 184, 166, 0.1)' },
        ticks: { color: '#99F6DE', font: { family: 'JetBrains Mono', size: 9 } }
      },
      y: {
        grid: { color: 'rgba(20, 184, 166, 0.1)' },
        ticks: { color: '#99F6DE', font: { family: 'JetBrains Mono', size: 9 } },
        min: 0,
        max: 12
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div
      className={`absolute top-0 right-0 bottom-0 w-full sm:w-[460px] glass-panel z-20 border-l border-estuary-700/80 flex flex-col shadow-2xl transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-estuary-700/80 flex items-start justify-between bg-estuary-900/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wider"
              style={{
                backgroundColor: `${statusColor}25`,
                color: statusColor,
                border: `1px solid ${statusColor}60`
              }}
            >
              {(lake.qualityClass || lake.status).toUpperCase()}
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                isPwd
                  ? 'text-cyan-300 bg-cyan-900/60 border-cyan-500/50'
                  : 'text-estuary-300 bg-estuary-900/60 border-estuary-500/50'
              }`}
            >
              {isPwd ? "People's Water Data" : 'IoT Buoy Fleet'}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">{lake.name}</h2>
          <p className="text-xs text-estuary-300 flex items-center gap-1.5 mt-0.5">
            <i className="fa-solid fa-location-dot text-estuary-400"></i> {lake.location}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={onClose}
            className="sm:hidden text-slate-400 hover:text-white p-1"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-estuary-300">Water Index</div>
            <div
              className="text-2xl font-black font-mono"
              style={{ color: statusColor }}
            >
              {diagnosis ? diagnosis.score : lake.score}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Details Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Source Metadata */}
        <div className="bg-estuary-900/80 p-2.5 rounded-lg border border-estuary-700/60 text-xs font-mono space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Source Type:</span>
            <span className="text-cyan-300 font-bold">
              {isPwd ? 'Citizen Observation (peopleswaterdata.org)' : 'Physical Solar IoT Buoy'}
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Sampling / Station ID:</span>
            <span className="text-white">{lake.sampleId}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Telemetry Date:</span>
            <span className="text-slate-300">{lake.date}</span>
          </div>
        </div>

        {/* Live Sensor Readings Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-estuary-200 flex items-center gap-1.5">
              <i className="fa-solid fa-flask-vial text-estuary-400"></i> Water Chemistry Parameters
            </span>
            <span className="text-[10px] font-mono text-amber-400">SIMULATED STREAM</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {/* DO */}
            <div className="bg-estuary-900/80 p-2.5 rounded-lg border border-estuary-700/60">
              <div className="text-[10px] text-estuary-400 flex justify-between">
                <span>Dissolved O2 (DO)</span>
                <span className="text-slate-400">&ge;5.0 mg/L</span>
              </div>
              <div
                className={`text-base font-bold mt-1 ${
                  lake.readings.do_mgl < 3.0 ? 'text-rose-400' : (lake.readings.do_mgl < 5.0 ? 'text-amber-300' : 'text-emerald-400')
                }`}
              >
                {lake.readings.do_mgl} mg/L
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">
                {lake.readings.do_mgl < 3.0 ? 'Critical hypoxia' : (lake.readings.do_mgl < 5.0 ? 'Marginal oxygen' : 'Healthy oxygen')}
              </div>
            </div>

            {/* pH */}
            <div className="bg-estuary-900/80 p-2.5 rounded-lg border border-estuary-700/60">
              <div className="text-[10px] text-estuary-400 flex justify-between">
                <span>pH Level</span>
                <span className="text-slate-400">6.5–8.5</span>
              </div>
              <div
                className={`text-base font-bold mt-1 ${
                  lake.readings.ph < 6.5 || lake.readings.ph > 8.5 ? 'text-amber-300' : 'text-emerald-400'
                }`}
              >
                {lake.readings.ph}
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">
                {lake.readings.ph < 6.5 || lake.readings.ph > 8.5 ? 'Outside CPCB safe band' : 'Neutral & compliant'}
              </div>
            </div>

            {/* TDS */}
            <div className="bg-estuary-900/80 p-2.5 rounded-lg border border-estuary-700/60">
              <div className="text-[10px] text-estuary-400 flex justify-between">
                <span>TDS</span>
                <span className="text-slate-400">&le;500 ppm</span>
              </div>
              <div
                className={`text-base font-bold mt-1 ${
                  lake.readings.tds > 1000 ? 'text-rose-400' : (lake.readings.tds > 500 ? 'text-amber-300' : 'text-emerald-400')
                }`}
              >
                {lake.readings.tds} ppm
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">
                {lake.readings.tds > 1000 ? 'Severe dissolved salts' : (lake.readings.tds > 500 ? 'Elevated minerals' : 'Low mineral load')}
              </div>
            </div>

            {/* Turbidity */}
            <div className="bg-estuary-900/80 p-2.5 rounded-lg border border-estuary-700/60">
              <div className="text-[10px] text-estuary-400 flex justify-between">
                <span>Turbidity</span>
                <span className="text-slate-400">&le;10 NTU</span>
              </div>
              <div
                className={`text-base font-bold mt-1 ${
                  lake.readings.turbidity > 25 ? 'text-rose-400' : (lake.readings.turbidity > 10 ? 'text-amber-300' : 'text-emerald-400')
                }`}
              >
                {lake.readings.turbidity} NTU
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">
                {lake.readings.turbidity > 25 ? 'High suspended silt' : (lake.readings.turbidity > 10 ? 'Moderate cloudiness' : 'Clear water column')}
              </div>
            </div>
          </div>

          <div className="mt-2 bg-estuary-900/40 px-3 py-1.5 rounded-lg border border-estuary-700/40 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Water Temperature:</span>
            <span className="text-estuary-200 font-bold">{lake.readings.temperature} °C</span>
          </div>
        </div>

        {/* History Trend Sparkline/Chart */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-estuary-200 flex items-center gap-1.5">
              <i className="fa-solid fa-chart-line text-estuary-400"></i> 7-Day Trend (Dissolved O2 mg/L)
            </span>
            <span className="text-[10px] font-mono text-estuary-400">Historical Tracking</span>
          </div>
          <div className="bg-estuary-900/80 p-3 rounded-lg border border-estuary-700/60 h-36">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* DIAGNOSTIC ENGINE ACTION BUTTON */}
        <div>
          <button
            onClick={handleRunDiagnosis}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl font-bold bg-gradient-to-r from-estuary-500 to-teal-600 hover:from-estuary-400 hover:to-teal-500 text-white shadow-lg shadow-estuary-600/30 transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>Querying n8n Groq AI Engine...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-bolt"></i>
                <span>Trigger n8n Groq AI Diagnosis</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-estuary-300/70 mt-1.5">
            Pushes live payload to n8n webhook &rarr; Rule Engine &rarr; Tavily News &rarr; Groq LLM
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-xs text-rose-200">
            <div className="font-bold mb-0.5">Diagnostic Request Failed:</div>
            <div>{error}</div>
          </div>
        )}

        {/* AI DIAGNOSTIC REPORT RESULTS */}
        <div className="bg-estuary-900/90 rounded-xl p-4 border border-estuary-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-estuary-700/60 pb-2">
            <span className="text-xs font-bold text-estuary-200 uppercase tracking-wide flex items-center gap-1.5">
              <i className="fa-solid fa-brain text-estuary-400"></i> Groq AI Diagnosis (Latest Run)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {diagnosis ? new Date(diagnosis.generated_at).toLocaleTimeString() : 'Ready'}
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {diagnosis?.ai_analysis?.summary ||
              `Telemetry from ${lake.name}. Click the button above to run real-time inference via your published n8n cloud workflow.`}
          </p>

          {/* Causes */}
          <div>
            <div className="text-[11px] font-semibold text-estuary-300 uppercase tracking-wider mb-1">
              Identified Pollution Drivers:
            </div>
            <ul className="text-xs space-y-1 text-slate-300 font-sans">
              {(diagnosis?.ai_analysis?.likely_causes || lake.causes).map((c, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-estuary-400">•</span> {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Roadmap */}
          <div>
            <div className="text-[11px] font-semibold text-estuary-300 uppercase tracking-wider mb-1.5">
              Action Roadmap (CPCB Norms):
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <div className="bg-estuary-950/70 p-2 rounded border border-estuary-700">
                <div className="font-bold text-rose-400 uppercase">Immediate</div>
                <div className="text-slate-300 mt-1">
                  {diagnosis?.ai_analysis?.recovery_actions?.immediate?.[0] || 'Deploy emergency aeration cascades'}
                </div>
              </div>
              <div className="bg-estuary-950/70 p-2 rounded border border-estuary-700">
                <div className="font-bold text-amber-400 uppercase">Short Term</div>
                <div className="text-slate-300 mt-1">
                  {diagnosis?.ai_analysis?.recovery_actions?.short_term?.[0] || 'Plug untreated storm sewer inlets'}
                </div>
              </div>
              <div className="bg-estuary-950/70 p-2 rounded border border-estuary-700">
                <div className="font-bold text-emerald-400 uppercase">Long Term</div>
                <div className="text-slate-300 mt-1">
                  {diagnosis?.ai_analysis?.recovery_actions?.long_term?.[0] || 'Construct wetland buffer tracks'}
                </div>
              </div>
            </div>
          </div>

          {/* Regulatory Authorities */}
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200">
            <span className="font-semibold text-rose-300">Regulatory Authorities to Notify:</span>
            <div className="mt-0.5 text-[11px]">
              {diagnosis?.ai_analysis?.notify?.join(', ') ||
                'State Pollution Control Board & Local Municipal Corporation'}
            </div>
          </div>

          {/* Local News Source from Tavily (if present in n8n response) */}
          {diagnosis?.ai_analysis?.source_notes && diagnosis.ai_analysis.source_notes.length > 0 && (
            <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-700/40 text-xs">
              <span className="font-semibold text-cyan-300 flex items-center gap-1.5 mb-1">
                <i className="fa-solid fa-newspaper text-cyan-400"></i> Local News & Evidence (Tavily Scraper):
              </span>
              <ul className="text-[11px] text-slate-300 space-y-1">
                {diagnosis.ai_analysis.source_notes.map((note, idx) => (
                  <li key={idx} className="truncate">
                    • {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
