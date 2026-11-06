import React, { useState } from 'react';
import { 
  IoClose, 
  IoDownloadOutline, 
  IoImageOutline, 
  IoCodeSlashOutline, 
  IoMapOutline, 
  IoDocumentTextOutline,
  IoCheckmark
} from 'react-icons/io5';
import { useMode } from '../../context/ModeContext';
import { 
  exportAnnotatedImage, 
  exportToGeoJson, 
  exportSessionJson, 
  printExecutiveReport 
} from '../../utils/exportHelpers';

export default function ExportModal({
  isOpen,
  onClose,
  chatId,
  chatTitle,
  chatHistory = [],
  boxes = [],
  imageElement,
  naturalWidth,
  naturalHeight,
  imageUrl
}) {
  const { currentMode, gsd } = useMode();
  const [downloading, setDownloading] = useState(null);

  if (!isOpen) return null;

  const handleExportPng = async () => {
    setDownloading('png');
    await exportAnnotatedImage({
      imageElement,
      boxes,
      mode: currentMode,
      gsd,
      naturalWidth,
      naturalHeight
    });
    setDownloading(null);
  };

  const handleExportGeoJson = () => {
    setDownloading('geojson');
    exportToGeoJson({
      chatId,
      mode: currentMode,
      gsd,
      boxes,
      naturalWidth,
      naturalHeight
    });
    setDownloading(null);
  };

  const handleExportJson = () => {
    setDownloading('json');
    exportSessionJson({
      chatId,
      mode: currentMode,
      gsd,
      chatTitle,
      chatHistory
    });
    setDownloading(null);
  };

  const handleExportPdf = () => {
    printExecutiveReport({
      mode: currentMode,
      gsd,
      chatTitle,
      chatHistory,
      imageUrl
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-white/15 shadow-2xl text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <IoDownloadOutline className="text-xl text-emerald-400" />
            <h3 className="text-base font-bold text-white">Export Spatial Intelligence</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          Select an analytical export format. All exports preserve the calibrated sensor resolution (<strong>GSD: {gsd} m/px</strong>) and active mode telemetry.
        </p>

        {/* Export Formats Grid */}
        <div className="space-y-3">
          {/* Format 1: Annotated High-Res PNG */}
          <button
            onClick={handleExportPng}
            disabled={downloading === 'png'}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xl">
                <IoImageOutline />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Annotated High-Resolution PNG
                </div>
                <div className="text-[11px] text-slate-400">
                  Stitches base satellite imagery with vector parcel overlays & telemetry banner
                </div>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold px-2 py-1 rounded bg-emerald-500/10">
              .PNG
            </span>
          </button>

          {/* Format 2: GeoJSON FeatureCollection */}
          <button
            onClick={handleExportGeoJson}
            disabled={downloading === 'geojson'}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xl">
                <IoMapOutline />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  GeoJSON FeatureCollection (RFC 7946)
                </div>
                <div className="text-[11px] text-slate-400">
                  Import directly into QGIS, ArcGIS, or Earth Engine with hectare & acre properties
                </div>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold px-2 py-1 rounded bg-cyan-500/10">
              .GEOJSON
            </span>
          </button>

          {/* Format 3: Session Machine JSON */}
          <button
            onClick={handleExportJson}
            disabled={downloading === 'json'}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl">
                <IoCodeSlashOutline />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  Complete Session Metadata JSON
                </div>
                <div className="text-[11px] text-slate-400">
                  Includes full reasoning chain, prompt tokens, response latency, and normalized coordinates
                </div>
              </div>
            </div>
            <span className="text-xs font-mono text-purple-400 font-semibold px-2 py-1 rounded bg-purple-500/10">
              .JSON
            </span>
          </button>

          {/* Format 4: Printable Executive Report */}
          <button
            onClick={handleExportPdf}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl">
                <IoDocumentTextOutline />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  Executive PDF Intelligence Report
                </div>
                <div className="text-[11px] text-slate-400">
                  Print-ready memo formatted with executive findings, statistics, and model transcripts
                </div>
              </div>
            </div>
            <span className="text-xs font-mono text-amber-400 font-semibold px-2 py-1 rounded bg-amber-500/10">
              .PDF
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
