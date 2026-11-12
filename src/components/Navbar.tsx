import React from 'react';

interface NavbarProps {
  activeTab: 'map-view' | 'directory-view' | 'pwd-view' | 'hardware-view';
  setActiveTab: (tab: 'map-view' | 'directory-view' | 'pwd-view' | 'hardware-view') => void;
  toggleSidebar: () => void;
  currentTheme: 'hydro' | 'light' | 'eco';
  setTheme: (theme: 'hydro' | 'light' | 'eco') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  toggleSidebar,
  currentTheme,
  setTheme
}) => {
  return (
    <header className="h-14 themed-header border-b px-4 flex items-center justify-between z-30 shrink-0 shadow-lg">
      <div className="flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center text-white shadow-inner"
          style={{ backgroundColor: 'var(--primary-brand)' }}
        >
          <i className="fa-solid fa-water text-lg"></i>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              ALL INDIA LAKE MONITORING SYSTEM
              <span
                className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--primary-brand)',
                  border: '1px solid var(--border-color)'
                }}
              >
                Official Release v1.0
              </span>
            </h1>
          </div>
          <p className="text-[11px] flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <span>CPCB Standards • 55 National Lakes + PWD Citizen Stations</span>
            <span>•</span>
            <span className="text-amber-500 font-semibold tracking-wider flex items-center gap-1">
              <i className="fa-solid fa-circle-exclamation text-[10px]"></i> DEMO STREAM (SYNTHETIC)
            </span>
          </p>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <div className="hidden md:flex items-center p-1 rounded-lg border themed-border themed-subcard">
        <button
          onClick={() => setActiveTab('map-view')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
            activeTab === 'map-view' ? 'btn-brand shadow' : ''
          }`}
          style={{ color: activeTab === 'map-view' ? '#FFF' : 'var(--text-secondary)' }}
        >
          <i className="fa-solid fa-earth-asia"></i> Geospatial Map
        </button>
        <button
          onClick={() => setActiveTab('directory-view')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
            activeTab === 'directory-view' ? 'btn-brand shadow' : ''
          }`}
          style={{ color: activeTab === 'directory-view' ? '#FFF' : 'var(--text-secondary)' }}
        >
          <i className="fa-solid fa-table-list"></i> 55 Lakes Directory
        </button>
        <button
          onClick={() => setActiveTab('pwd-view')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
            activeTab === 'pwd-view' ? 'btn-brand shadow' : ''
          }`}
          style={{ color: activeTab === 'pwd-view' ? '#FFF' : 'var(--text-secondary)' }}
        >
          <i className="fa-solid fa-users-viewfinder"></i> People's Water Data
        </button>
        <button
          onClick={() => setActiveTab('hardware-view')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
            activeTab === 'hardware-view' ? 'btn-brand shadow' : ''
          }`}
          style={{ color: activeTab === 'hardware-view' ? '#FFF' : 'var(--text-secondary)' }}
        >
          <i className="fa-solid fa-microchip"></i> 10-Part Hardware
        </button>
      </div>

      {/* Right Controls: Theme Switcher & Engine Status */}
      <div className="flex items-center gap-2.5">
        {/* Theme Switcher Selector */}
        <div className="flex items-center gap-1 p-1 rounded-lg border themed-border themed-subcard text-xs">
          <span className="text-[10px] uppercase font-bold px-1.5 hidden sm:inline" style={{ color: 'var(--text-muted)' }}>
            Theme:
          </span>
          <button
            onClick={() => setTheme('hydro')}
            title="Deep Hydro & Slate (Control Room)"
            className="px-2 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1"
            style={{
              backgroundColor: currentTheme === 'hydro' ? 'var(--primary-brand)' : 'transparent',
              color: currentTheme === 'hydro' ? '#FFF' : 'var(--text-secondary)'
            }}
          >
            <i className="fa-solid fa-tower-observation"></i>
            <span className="hidden lg:inline">Hydro Control</span>
          </button>
          <button
            onClick={() => setTheme('light')}
            title="Clean Scientific Light (Field/Daytime)"
            className="px-2 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1"
            style={{
              backgroundColor: currentTheme === 'light' ? 'var(--primary-brand)' : 'transparent',
              color: currentTheme === 'light' ? '#FFF' : 'var(--text-secondary)'
            }}
          >
            <i className="fa-solid fa-sun"></i>
            <span className="hidden lg:inline">Scientific Light</span>
          </button>
          <button
            onClick={() => setTheme('eco')}
            title="Eco-Telemetry Dark (Modern SaaS)"
            className="px-2 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1"
            style={{
              backgroundColor: currentTheme === 'eco' ? 'var(--primary-brand)' : 'transparent',
              color: currentTheme === 'eco' ? '#FFF' : 'var(--text-secondary)'
            }}
          >
            <i className="fa-solid fa-leaf"></i>
            <span className="hidden lg:inline">Eco Dark</span>
          </button>
        </div>

        {/* Live n8n Engine Pill */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-mono px-2.5 py-1.5 rounded-lg border themed-border themed-subcard">
          <span style={{ color: 'var(--text-muted)' }}>n8n AI Engine:</span>
          <span className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--status-good)' }}>
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--status-good)' }}></span>
            ONLINE (Groq)
          </span>
        </div>

        {/* Mobile drawer toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg border themed-border themed-card"
          style={{ color: 'var(--text-primary)' }}
        >
          <i className="fa-solid fa-sliders"></i>
        </button>
      </div>
    </header>
  );
};
