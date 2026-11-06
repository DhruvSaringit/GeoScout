import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import { useMode } from '../context/ModeContext';
import { BRAND } from '../config/brand';
import { 
  IoSparkles, 
  IoArrowForward, 
  IoLayersOutline, 
  IoDocumentTextOutline, 
  IoShieldCheckmarkOutline,
  IoHardwareChipOutline,
  IoCheckmarkCircle
} from 'react-icons/io5';
import { RiLeafLine, RiRadarLine } from 'react-icons/ri';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setMode, setIsDemoMode } = useMode();
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleLaunchWithMode = (modeId) => {
    setMode(modeId);
    navigate('/chat');
  };

  const handleLaunchDemo = (modeId) => {
    setMode(modeId);
    setIsDemoMode(true);
    navigate('/chat');
  };

  const handleSliderMove = (e) => {
    if (!isDragging && e.type !== 'click') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center overflow-hidden">
        {/* Subtle radial glow background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-emerald-500/15 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Top pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-emerald-400 mb-6 backdrop-blur-md">
          <IoSparkles className="text-xs" />
          <span>Next-Gen Earth Observation AI • Version {BRAND.version}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-tight">
          Conversational Satellite Vision <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            From Crop to City
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed">
          Ask questions in plain English over high-resolution satellite imagery. Detect crop parcels, calculate acreage in hectares, segment urban infrastructure, and inspect streaming reasoning models in a single cockpit.
        </p>

        {/* Action CTAs */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => handleLaunchWithMode('agriculture')}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Launch Workspace</span>
            <IoArrowForward className="text-base" />
          </button>

          <button
            onClick={() => handleLaunchDemo('agriculture')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 font-semibold text-sm backdrop-blur-md transition-all cursor-pointer"
          >
            <span>🌾 Try Agriculture Demo</span>
          </button>

          <button
            onClick={() => navigate('/about')}
            className="px-5 py-3.5 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Paper Credits & Heritage →
          </button>
        </div>

        {/* Interactive Before/After Satellite Compare Slider */}
        <div className="mt-14 w-full max-w-5xl rounded-2xl border border-white/15 overflow-hidden shadow-2xl bg-slate-900/90 relative group">
          <div className="px-4 py-2.5 bg-slate-950/80 border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-slate-300">Punjab Farmland Quadrant (GSD: 0.50 m/px)</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500 hidden sm:block">
              ← Raw Satellite Optical | GeoScout SAM 3 Vector Parcels →
            </div>
          </div>

          <div 
            className="relative h-[380px] sm:h-[460px] w-full select-none cursor-ew-resize overflow-hidden"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleSliderMove}
            onClick={handleSliderMove}
          >
            {/* Base Image (Raw Optical) */}
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80" 
              alt="Raw Satellite Farmland"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Segmented Overlay (Revealed on Right) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80" 
                alt="Segmented Satellite Farmland"
                className="absolute inset-0 w-full h-full object-cover brightness-95"
              />
              {/* Simulated Neon Vector Outlines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <rect x="8%" y="15%" width="20%" height="28%" rx="6" fill="rgba(16, 185, 129, 0.28)" stroke="#10b981" strokeWidth="2.5" />
                <text x="9%" y="22%" fill="#ffffff" fontSize="12" fontWeight="bold">Parcel #1: 3.42 ha</text>

                <rect x="31%" y="14%" width="21%" height="26%" rx="6" fill="rgba(16, 185, 129, 0.28)" stroke="#10b981" strokeWidth="2.5" />
                <text x="32%" y="21%" fill="#ffffff" fontSize="12" fontWeight="bold">Parcel #2: 4.15 ha</text>

                <rect x="55%" y="12%" width="23%" height="26%" rx="6" fill="rgba(16, 185, 129, 0.28)" stroke="#10b981" strokeWidth="2.5" />
                <text x="56%" y="19%" fill="#ffffff" fontSize="12" fontWeight="bold">Parcel #3: 5.80 ha</text>

                <rect x="7%" y="48%" width="20%" height="32%" rx="6" fill="rgba(16, 185, 129, 0.28)" stroke="#10b981" strokeWidth="2.5" />
                <text x="8%" y="55%" fill="#ffffff" fontSize="12" fontWeight="bold">Parcel #4: 4.90 ha</text>

                <rect x="30%" y="45%" width="23%" height="31%" rx="6" fill="rgba(16, 185, 129, 0.28)" stroke="#10b981" strokeWidth="2.5" />
                <text x="31%" y="52%" fill="#ffffff" fontSize="12" fontWeight="bold">Parcel #5: 6.20 ha</text>

                <rect x="56%" y="43%" width="23%" height="31%" rx="6" fill="rgba(16, 185, 129, 0.28)" stroke="#10b981" strokeWidth="2.5" />
                <text x="57%" y="50%" fill="#ffffff" fontSize="12" fontWeight="bold">Parcel #6: 5.95 ha</text>
              </svg>
            </div>

            {/* Vertical Divider Line with Grabber */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] cursor-ew-resize z-20 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-950 border-2 border-white shadow-xl flex items-center justify-center text-[10px] text-white font-bold">
                ↔
              </div>
            </div>

            {/* Corner tags */}
            <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-mono text-slate-300 border border-white/10">
              Raw Satellite Scene
            </div>
            <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-emerald-950/85 backdrop-blur-md text-[11px] font-mono text-emerald-300 border border-emerald-500/30">
              GeoScout AI: 12 Parcels • 38.4 ha
            </div>
          </div>
        </div>
      </section>

      {/* Domain Modes Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Two Specialized Operational Modalities
          </h2>
          <p className="mt-2 text-slate-400 text-sm max-w-2xl mx-auto">
            Switch effortlessly with the segmented pill in the top header. Each mode tunes the suggested prompts, visual telemetry, and measurement units.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Agriculture Mode Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/30 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🌾</span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                HEADLINE WORKFLOW
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">Agriculture Intelligence</h3>
            <p className="mt-2 text-sm text-slate-300">
              Specialized for agrarian surveying, crop management, and precision agronomy.
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <IoCheckmarkCircle className="text-emerald-400 text-sm flex-shrink-0" />
                <span>Crop parcel segmentation with polygon vector boundaries</span>
              </li>
              <li className="flex items-center gap-2">
                <IoCheckmarkCircle className="text-emerald-400 text-sm flex-shrink-0" />
                <span>Real-world area measurement in <strong>Hectares (ha)</strong> and <strong>Acres</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <IoCheckmarkCircle className="text-emerald-400 text-sm flex-shrink-0" />
                <span>Irrigation canal & water catchment feature identification</span>
              </li>
              <li className="flex items-center gap-2">
                <IoCheckmarkCircle className="text-emerald-400 text-sm flex-shrink-0" />
                <span>Calibrated sensor Ground Sample Distance (GSD 0.5m/px)</span>
              </li>
            </ul>

            <button
              onClick={() => handleLaunchWithMode('agriculture')}
              className="mt-8 w-full py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Open Agriculture Workspace</span>
              <IoArrowForward />
            </button>
          </div>

          {/* General Earth Observation Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-500/30 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🛰️</span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                COMPREHENSIVE EO
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">General Satellite Vision</h3>
            <p className="mt-2 text-sm text-slate-300">
              Broad planetary intelligence covering transportation, civil infrastructure, and maritime berths.
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <IoCheckmarkCircle className="text-cyan-400 text-sm flex-shrink-0" />
                <span>Aviation grounding: commercial aircraft, hangars, and runways</span>
              </li>
              <li className="flex items-center gap-2">
                <IoCheckmarkCircle className="text-cyan-400 text-sm flex-shrink-0" />
                <span>Urban building footprint & arterial road network classification</span>
              </li>
              <li className="flex items-center gap-2">
                <IoCheckmarkCircle className="text-cyan-400 text-sm flex-shrink-0" />
                <span>Industrial storage tank and maritime container ship tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <IoCheckmarkCircle className="text-cyan-400 text-sm flex-shrink-0" />
                <span>Metric calculations in <strong>m²</strong> and <strong>km²</strong></span>
              </li>
            </ul>

            <button
              onClick={() => handleLaunchWithMode('general')}
              className="mt-8 w-full py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Open General Workspace</span>
              <IoArrowForward />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Architecture Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Production-Grade Remote Sensing Cockpit
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Engineered for academic evaluation, project defense, and GIS analyst workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-4 text-xl">
              <RiRadarLine />
            </div>
            <h4 className="font-bold text-white text-base">Streaming Reasoning</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Watch the vision-language model reason step-by-step in real time before rendering final answers and vector polygons.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-4 text-xl">
              <IoLayersOutline />
            </div>
            <h4 className="font-bold text-white text-base">Interactive GIS Canvas</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Pan, smooth zoom up to 10x, vector polygon opacity sliders, before/after compare slider, and bidirectional click highlighting.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-4 text-xl">
              <IoDocumentTextOutline />
            </div>
            <h4 className="font-bold text-white text-base">Multi-Format Spatial Export</h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Download annotated PNGs with burned-in vector telemetry, machine-readable GeoJSON FeatureCollections, and executive PDF reports.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Heritage Footer Notice */}
      <footer className="mt-auto border-t border-white/10 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-semibold text-slate-300">
            GeoScout • Autonomous Geospatial Vision & Agricultural Remote Sensing Suite
          </p>
          <p className="text-slate-500">
            Academic Project Defense Edition • Heritage: Built upon original foundational research from GeoNLI (Inter-IIT ISRO Tech Meet Challenge).
          </p>
          <div className="pt-2">
            <button 
              onClick={() => navigate('/about')} 
              className="text-emerald-400 hover:text-emerald-300 underline font-medium"
            >
              View Research Paper Credits & Heritage Documentation
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
