import React, { createContext, useContext, useState, useEffect } from 'react';
import { MODES, DEFAULT_MODE_ID } from '../config/modes';
import { DEMO_DATASETS } from '../demo_outputs/sampleData';

const ModeContext = createContext(null);

export function ModeProvider({ children }) {
  const [currentMode, setCurrentMode] = useState(() => {
    return localStorage.getItem('geoscout_mode') || DEFAULT_MODE_ID;
  });

  const [gsd, setGsd] = useState(() => {
    const saved = localStorage.getItem('geoscout_gsd');
    return saved ? parseFloat(saved) : (MODES[currentMode]?.defaultGsd || 0.5);
  });

  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeDemoId, setActiveDemoId] = useState(DEMO_DATASETS[0].id);

  // Sync mode with HTML document for CSS attribute selectors
  useEffect(() => {
    document.body.setAttribute('data-mode', currentMode);
    localStorage.setItem('geoscout_mode', currentMode);
    
    // If GSD was not customized, sync default GSD for that mode
    const modeConfig = MODES[currentMode];
    if (modeConfig && !localStorage.getItem('geoscout_gsd_user_override')) {
      setGsd(modeConfig.defaultGsd);
    }
  }, [currentMode]);

  const handleSetMode = (modeId) => {
    if (MODES[modeId]) {
      setCurrentMode(modeId);
    }
  };

  const handleSetGsd = (newGsd) => {
    const val = parseFloat(newGsd);
    if (!isNaN(val) && val > 0) {
      setGsd(val);
      localStorage.setItem('geoscout_gsd', val.toString());
      localStorage.setItem('geoscout_gsd_user_override', 'true');
    }
  };

  const activeModeConfig = MODES[currentMode] || MODES[DEFAULT_MODE_ID];
  const activeDemoDataset = DEMO_DATASETS.find(d => d.id === activeDemoId) || DEMO_DATASETS[0];

  const value = {
    currentMode,
    setMode: handleSetMode,
    activeModeConfig,
    availableModes: MODES,
    gsd,
    setGsd: handleSetGsd,
    isDemoMode,
    setIsDemoMode,
    activeDemoId,
    setActiveDemoId,
    activeDemoDataset,
    demoDatasets: DEMO_DATASETS
  };

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
