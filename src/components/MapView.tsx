import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LakeItem, Region } from '../types/lake';

interface MapViewProps {
  lakes: LakeItem[];
  selectedLake: LakeItem;
  onSelectLake: (lake: LakeItem) => void;
}

export const MapView: React.FC<MapViewProps> = ({ lakes, selectedLake, onSelectLake }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const iotLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const pwdLayerRef = useRef<L.LayerGroup>(L.layerGroup());

  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState<'all' | Region>('all');
  const [showIot, setShowIot] = useState(true);
  const [showPwd, setShowPwd] = useState(true);
  const [baseMap, setBaseMap] = useState<'hybrid' | 'satellite' | 'dark'>('hybrid');

  const baseLayersRef = useRef<{ [key: string]: L.TileLayer }>({
    hybrid: L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: '&copy; Google Earth Imagery'
    }),
    satellite: L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: '&copy; Google Earth Imagery'
    }),
    dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; CartoDB'
    })
  });

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

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [21.5, 78.9],
      zoom: 5,
      zoomControl: false,
      layers: [baseLayersRef.current.hybrid]
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    iotLayerRef.current.addTo(map);
    pwdLayerRef.current.addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(baseLayersRef.current).forEach((layer) => map.removeLayer(layer));
    baseLayersRef.current[baseMap].addTo(map);
  }, [baseMap]);

  // Render Markers
  useEffect(() => {
    const iotLayer = iotLayerRef.current;
    const pwdLayer = pwdLayerRef.current;
    iotLayer.clearLayers();
    pwdLayer.clearLayers();

    const filtered = lakes.filter((item) => {
      if (activeRegion !== 'all' && item.region !== activeRegion) return false;
      if (
        search &&
        !item.name.toLowerCase().includes(search.toLowerCase()) &&
        !item.location.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    filtered.forEach((item) => {
      const isPwd = item.source === 'pwd';
      if (isPwd && !showPwd) return;
      if (!isPwd && !showIot) return;

      const color = getStatusColor(item);

      const marker = L.circleMarker([item.lat, item.lng], {
        radius: isPwd ? 7 : 9,
        fillColor: color,
        color: isPwd ? '#38BDF8' : '#ffffff',
        weight: isPwd ? 2 : 1.5,
        opacity: 1,
        fillOpacity: 0.95
      });

      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; font-size: 12px; padding: 4px;">
          <div style="font-size: 9px; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; font-weight: bold; color: #67e8f9; margin-bottom: 2px;">
            ${isPwd ? "💧 People's Water Data (Citizen)" : '🛰️ IoT Buoy Node'}
          </div>
          <div style="font-weight: bold; color: white; font-size: 13px; margin-bottom: 2px;">${item.name}</div>
          <div style="color: #5eead4; font-size: 11px; margin-bottom: 6px;">${item.location}</div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-family: 'JetBrains Mono', monospace; border-top: 1px solid #0f766e; padding-top: 4px;">
            <span>Status: <strong style="color: ${color}">${(item.qualityClass || item.status).toUpperCase()}</strong></span>
            <span>Score: <strong>${item.score}/100</strong></span>
          </div>
        </div>
      `);

      marker.on('click', () => {
        onSelectLake(item);
      });

      if (isPwd) {
        pwdLayer.addLayer(marker);
      } else {
        iotLayer.addLayer(marker);
      }
    });
  }, [lakes, activeRegion, search, showIot, showPwd, onSelectLake]);

  // Fly to selected lake
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedLake) return;
    map.flyTo([selectedLake.lat, selectedLake.lng], 13, { duration: 1.5 });
  }, [selectedLake]);

  return (
    <div className="w-full h-full relative flex">
      {/* MAP CANVAS */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* MAP FLOATING CONTROLS & SEARCH BAR (Top Left) */}
      <div className="absolute top-4 left-4 z-10 glass-panel rounded-xl p-3 shadow-2xl max-w-sm w-full sm:w-[350px]">
        {/* Search Input */}
        <div className="relative mb-2">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-estuary-400 text-xs"></i>
          <input
            type="text"
            placeholder="Search lakes or citizen stations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-estuary-950/80 border border-estuary-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-estuary-400/60 focus:outline-none focus:border-estuary-400 font-sans"
          />
        </div>

        {/* LAYER SELECTOR */}
        <div className="bg-estuary-950/90 p-2 rounded-lg border border-estuary-700/60 mb-2">
          <div className="text-[10px] uppercase font-bold text-estuary-300 mb-1.5 flex justify-between items-center">
            <span>Data Layers Active</span>
            <span className="text-cyan-300 font-mono">55 Lakes + 12 PWD</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
            <label className="flex items-center gap-1.5 cursor-pointer bg-estuary-900/60 px-2 py-1 rounded border border-estuary-700/50 hover:border-estuary-400">
              <input
                type="checkbox"
                checked={showIot}
                onChange={(e) => setShowIot(e.target.checked)}
                className="accent-estuary-500 rounded"
              />
              <span className="text-[11px] text-slate-200">IoT Buoy Nodes</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer bg-cyan-950/60 px-2 py-1 rounded border border-cyan-700/50 hover:border-cyan-400">
              <input
                type="checkbox"
                checked={showPwd}
                onChange={(e) => setShowPwd(e.target.checked)}
                className="accent-cyan-500 rounded"
              />
              <span className="text-[11px] text-cyan-200">PWD Citizen Data</span>
            </label>
          </div>
        </div>

        {/* Region Chips */}
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-[10px] font-semibold text-estuary-300 uppercase tracking-wider">Regions:</span>
          <div className="flex flex-wrap gap-1 text-[10px]">
            {(['all', 'North', 'South', 'West', 'East', 'Northeast', 'Central'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setActiveRegion(r)}
                className={`px-1.5 py-0.5 rounded font-medium transition ${
                  activeRegion === r
                    ? 'bg-estuary-600 text-white'
                    : 'bg-estuary-900 text-estuary-300 hover:text-white border border-estuary-700'
                }`}
              >
                {r === 'all' ? 'All' : r === 'Northeast' ? 'NE' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Earth Base Layer Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-estuary-700/60 text-[10px]">
          <span className="text-estuary-400 font-medium">Earth Imagery:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setBaseMap('hybrid')}
              className={`px-2 py-0.5 rounded font-medium ${
                baseMap === 'hybrid'
                  ? 'bg-estuary-600 text-white border border-estuary-400'
                  : 'bg-estuary-900 text-estuary-300 hover:text-white border border-estuary-700'
              }`}
            >
              Google Hybrid
            </button>
            <button
              onClick={() => setBaseMap('satellite')}
              className={`px-2 py-0.5 rounded font-medium ${
                baseMap === 'satellite'
                  ? 'bg-estuary-600 text-white border border-estuary-400'
                  : 'bg-estuary-900 text-estuary-300 hover:text-white border border-estuary-700'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setBaseMap('dark')}
              className={`px-2 py-0.5 rounded font-medium ${
                baseMap === 'dark'
                  ? 'bg-estuary-600 text-white border border-estuary-400'
                  : 'bg-estuary-900 text-estuary-300 hover:text-white border border-estuary-700'
              }`}
            >
              Dark
            </button>
          </div>
        </div>
      </div>

      {/* MAP LEGEND (Bottom Left) */}
      <div className="absolute bottom-6 left-4 z-10 glass-panel rounded-xl p-3 shadow-xl hidden sm:block">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-estuary-300 mb-1.5 flex justify-between">
          <span>Map Classifications</span>
          <span className="text-[9px] text-cyan-300 font-mono">CPCB & PWD</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
            <span className="text-slate-200">Desirable / Good</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400"></span>
            <span className="text-slate-200">Acceptable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400"></span>
            <span className="text-slate-200">Poor / Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500"></span>
            <span className="text-slate-200">Unacceptable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
