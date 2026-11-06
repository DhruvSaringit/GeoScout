import React from "react";
import ImageUpload from "../ImageUpload";
import { GeoScoutLogo, BRAND } from "../../config/brand";
import { useMode } from "../../context/ModeContext";
import { IoFlashOutline } from "react-icons/io5";

export default function WelcomeScreen({ 
  isUploading, 
  onImageUpload,
  theme = 'dark',
  textColor,
  secondaryTextColor
}) {
  const { activeModeConfig, setIsDemoMode } = useMode();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col items-center gap-6 max-w-2xl w-full text-center">
        {/* Brand Aperture & Mode Badge */}
        <div className="flex flex-col items-center gap-2">
          <GeoScoutLogo className="w-14 h-14" animated={true} />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeModeConfig.themeColor }} />
            <span>MODE: {activeModeConfig.badge}</span>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {isUploading ? "Uploading Satellite Scene..." : `Welcome to ${BRAND.name}`}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
            {activeModeConfig.description}
          </p>
        </div>

        {/* Upload Zone */}
        {!isUploading && (
          <ImageUpload onImageSelect={onImageUpload} />
        )}

        {isUploading && (
          <div className="p-8 text-center text-slate-300 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-mono">Ingesting imagery into MinIO object store...</span>
          </div>
        )}

        {/* Instant Zero-Friction Demo Mode Quick Action */}
        {!isUploading && (
          <div className="pt-2 flex flex-col items-center gap-3">
            <div className="text-xs text-slate-500 font-mono">
              Don't have an image ready? Inspect instant sample data:
            </div>
            <button
              onClick={() => setIsDemoMode(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer shadow-lg shadow-amber-500/10"
            >
              <IoFlashOutline className="text-sm" />
              <span>Inspect Pre-Computed {activeModeConfig.label} Demo Dataset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
