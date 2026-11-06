import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GeoScoutLogo, BRAND } from '../../config/brand';
import ModeSwitcher from './ModeSwitcher';
import { useMode } from '../../context/ModeContext';
import { useAuth } from '../../context/AuthContext';
import { IoLayersOutline, IoInformationCircleOutline, IoFlashOutline, IoLogInOutline } from 'react-icons/io5';

export default function Navbar({ onNewChat }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeModeConfig, gsd, setGsd, isDemoMode, setIsDemoMode } = useMode();
  const { isAuthenticated, user, logout } = useAuth();
  const [showGsdModal, setShowGsdModal] = useState(false);
  const [tempGsd, setTempGsd] = useState(gsd);

  const isLanding = location.pathname === '/';
  const isAbout = location.pathname === '/about' || location.pathname === '/credits';

  const handleApplyGsd = () => {
    setGsd(tempGsd);
    setShowGsdModal(false);
  };

  return (
    <header className="relative z-40 w-full h-14 bg-slate-950/85 backdrop-blur-xl border-b border-white/10 px-4 flex items-center justify-between">
      {/* Brand Section */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => {
            if (onNewChat) onNewChat();
            navigate('/');
          }} 
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        >
          <GeoScoutLogo className="w-8 h-8 transition-transform group-hover:scale-105" />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                {BRAND.name}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300 border border-white/10">
                v{BRAND.version}
              </span>
            </div>
          </div>
        </button>

        {/* Ambient Mode Badge */}
        <div className="hidden lg:flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeModeConfig.themeColor }} />
          <span>{activeModeConfig.badge}</span>
        </div>
      </div>

      {/* Central Mode Switcher (Alternative 1) */}
      <div className="flex items-center justify-center">
        <ModeSwitcher />
      </div>

      {/* Action Controls (Right) */}
      <div className="flex items-center gap-2.5">
        {/* Ground Sample Distance (GSD) Calibration */}
        <button
          onClick={() => {
            setTempGsd(gsd);
            setShowGsdModal(!showGsdModal);
          }}
          title="Calibrate Ground Sample Distance (Sensor Resolution)"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
        >
          <IoLayersOutline className="text-sm text-slate-400" />
          <span>GSD: <strong className="text-white">{gsd}m/px</strong></span>
        </button>

        {/* Demo Mode Toggle */}
        <button
          onClick={() => setIsDemoMode(!isDemoMode)}
          title="Toggle Pre-Computed Demo Mode for Viva / Evaluation"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isDemoMode
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10'
          }`}
        >
          <IoFlashOutline className={`text-sm ${isDemoMode ? 'animate-bounce' : ''}`} />
          <span className="hidden md:inline">{isDemoMode ? 'Demo Mode: ON' : 'Live Mode'}</span>
        </button>

        {/* Credits & Heritage Page Link */}
        <button
          onClick={() => navigate('/about')}
          title="Project Heritage & Research Credits"
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            isAbout
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10'
          }`}
        >
          <IoInformationCircleOutline className="text-base" />
        </button>

        {/* Workspace or Auth Button */}
        {isLanding ? (
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:shadow-emerald-500/35"
          >
            <span>Launch Workspace</span>
          </button>
        ) : isAuthenticated ? (
          <div className="flex items-center gap-2 pl-1">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-xs font-bold text-emerald-400">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium border border-white/15 transition-colors cursor-pointer"
          >
            <IoLogInOutline className="text-sm" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>

      {/* GSD Calibration Modal */}
      {showGsdModal && (
        <div className="absolute top-16 right-16 w-80 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl z-50 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <IoLayersOutline className="text-emerald-400" /> Sensor GSD Calibration
            </h4>
            <span className="text-[10px] text-slate-400">meters / pixel</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Ground Sample Distance allows GeoScout to compute real-world acreage, hectares, and square meters from raw image pixels.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Resolution (GSD):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.05"
                  max="30"
                  value={tempGsd}
                  onChange={(e) => setTempGsd(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs font-mono text-slate-400">m/px</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-slate-500">Presets:</span>
              <button 
                onClick={() => setTempGsd(0.5)} 
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
              >
                0.5m (Drone/Cartosat)
              </button>
              <button 
                onClick={() => setTempGsd(10.0)} 
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
              >
                10m (Sentinel-2)
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setShowGsdModal(false)}
                className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyGsd}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              >
                Apply GSD
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
