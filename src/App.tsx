import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MapView } from './components/MapView';
import { SidePanel } from './components/SidePanel';
import { DirectoryTable } from './components/DirectoryTable';
import { PwdView } from './components/PwdView';
import { HardwareHealth } from './components/HardwareHealth';
import { ALL_LAKES, PWD_STATIONS } from './data/lakes';
import { LakeItem } from './types/lake';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map-view' | 'directory-view' | 'pwd-view' | 'hardware-view'>('map-view');
  const [selectedLake, setSelectedLake] = useState<LakeItem>(ALL_LAKES[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<'hydro' | 'light' | 'eco'>('hydro');

  useEffect(() => {
    document.documentElement.className = `theme-${currentTheme}`;
  }, [currentTheme]);

  const handleSelectLake = (lake: LakeItem) => {
    setSelectedLake(lake);
    setSidebarOpen(true);
  };

  return (
    <div className={`theme-${currentTheme} font-sans antialiased h-screen w-screen overflow-hidden flex flex-col`}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        currentTheme={currentTheme}
        setTheme={setCurrentTheme}
      />

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden flex">
        {/* Tab 1: Map View */}
        <div className={`w-full h-full relative flex ${activeTab === 'map-view' ? '' : 'hidden'}`}>
          <MapView
            lakes={ALL_LAKES}
            selectedLake={selectedLake}
            onSelectLake={handleSelectLake}
          />

          {/* Right Floating Inspection Drawer */}
          <SidePanel
            lake={selectedLake}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Tab 2: Directory View */}
        <div className={`w-full h-full ${activeTab === 'directory-view' ? '' : 'hidden'}`}>
          <DirectoryTable
            lakes={ALL_LAKES}
            onSelectLake={handleSelectLake}
            onNavigateToMap={() => setActiveTab('map-view')}
          />
        </div>

        {/* Tab 3: People's Water Data View */}
        <div className={`w-full h-full ${activeTab === 'pwd-view' ? '' : 'hidden'}`}>
          <PwdView
            pwdStations={PWD_STATIONS}
            onSelectLake={handleSelectLake}
            onNavigateToMap={() => setActiveTab('map-view')}
          />
        </div>

        {/* Tab 4: 10-Part Hardware Health View */}
        <div className={`w-full h-full ${activeTab === 'hardware-view' ? '' : 'hidden'}`}>
          <HardwareHealth />
        </div>
      </div>
    </div>
  );
};

export default App;
