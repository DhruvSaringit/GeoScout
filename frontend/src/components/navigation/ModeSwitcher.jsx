import React, { useState, useRef, useEffect } from 'react';
import { useMode } from '../../context/ModeContext';
import { IoChevronDown, IoSparkles } from 'react-icons/io5';

/**
 * Segmented Glassmorphism Pill Mode Switcher (Alternative 1 - Recommended)
 * Positioned centrally in top navigation: [ 🌾 Agriculture | 🛰️ General ] with expandable dropdown
 */
export default function ModeSwitcher() {
  const { currentMode, setMode, availableModes } = useMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryModes = ['agriculture', 'flood', 'general'];
  const previewModes = ['disaster', 'urban'];

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      {/* Segmented Pill Container */}
      <div className="flex items-center p-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg shadow-black/30">
        {primaryModes.map((modeId) => {
          const mode = availableModes[modeId];
          const isActive = currentMode === modeId;

          const getActiveClass = () => {
            if (modeId === 'agriculture') return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.35)]';
            if (modeId === 'flood') return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.35)]';
            return 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.35)]';
          };

          return (
            <button
              key={modeId}
              onClick={() => setMode(modeId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                isActive
                  ? getActiveClass()
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="text-sm">{mode.icon}</span>
              <span>{mode.shortLabel || mode.label}</span>
            </button>
          );
        })}

        {/* Expandable Dropdown Trigger for Future Modes */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          title="More Earth Observation Modes"
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
            previewModes.includes(currentMode)
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <span className="text-[11px] opacity-75">More</span>
          <IoChevronDown className={`text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expandable Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 p-2 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl z-50 animate-fadeIn">
          <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-white/10 flex items-center justify-between">
            <span>Specialized Modalities</span>
            <span className="text-emerald-400 flex items-center gap-1"><IoSparkles className="text-[9px]" /> Preview</span>
          </div>

          <div className="mt-1 space-y-1">
            {previewModes.map((modeId) => {
              const mode = availableModes[modeId];
              const isActive = currentMode === modeId;

              return (
                <button
                  key={modeId}
                  onClick={() => {
                    setMode(modeId);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <span className="text-base mt-0.5">{mode.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{mode.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Preview</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{mode.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
