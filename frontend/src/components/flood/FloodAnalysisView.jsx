import React, { useState, useEffect, useRef } from 'react';
import FieldSubmersionTable from './FieldSubmersionTable';
import Sen1Floods11Modal from './Sen1Floods11Modal';
import BilingualReportModal from './BilingualReportModal';
import CustomFloodUploadModal from './CustomFloodUploadModal';
import { 
  IoLayersOutline, 
  IoDocumentTextOutline, 
  IoRibbonOutline, 
  IoDownloadOutline,
  IoWaterOutline,
  IoAnalyticsOutline,
  IoCloudUploadOutline,
  IoRefreshOutline
} from 'react-icons/io5';

/**
 * Flood & SAR Change Detection Primary Workbench
 * Bi-temporal split curtain (Pre-Flood vs Post-Flood SAR), Otsu thresholding,
 * per-field cadastral intersection, and Sen1Floods11 academic validation.
 */
export default function FloodAnalysisView() {
  const [floodData, setFloodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [showSen1Modal, setShowSen1Modal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isCustomPair, setIsCustomPair] = useState(false);
  const [canvasImages, setCanvasImages] = useState({
    pre: '/data/flood/punjab_pre_flood.jpg',
    post: '/data/flood/punjab_post_flood_sar.jpg'
  });
  
  // Layer visibility toggles
  const [layers, setLayers] = useState({
    showParcels: true,
    showFloodOverlay: true,
    showLabels: true
  });

  const containerRef = useRef(null);

  const getBackendUrl = () => {
    return window.location.hostname === 'localhost' ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`;
  };

  // Fetch default flood telemetry from backend
  const loadBenchmarkData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${getBackendUrl()}/api/flood/demo`);
      if (res.ok) {
        const data = await res.json();
        setFloodData(data);
        setCanvasImages({
          pre: '/data/flood/punjab_pre_flood.jpg',
          post: '/data/flood/punjab_post_flood_sar.jpg'
        });
        setIsCustomPair(false);
        setSelectedFieldId(null);
      }
    } catch (err) {
      console.warn('Failed to load live flood API, using fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBenchmarkData();
  }, []);

  // Split-curtain dragging handlers
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pct);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pct);
  };

  const summary = floodData?.summary || {
    monitored_cropland_ha: 26.85,
    flooded_cropland_ha: 14.82,
    submersion_percent: 55.2,
    total_parcels: 12,
    critical_parcels_count: 5
  };

  const parcels = floodData?.per_field_telemetry || [];
  const selectedParcel = parcels.find((p) => p.field_id === selectedFieldId);

  // Export GeoJSON helper
  const handleExportGeoJson = () => {
    if (!floodData) return;
    const geojson = {
      type: "FeatureCollection",
      metadata: {
        event: floodData.event_title,
        sensor: floodData.sensor,
        timestamp: new Date().toISOString(),
        flooded_cropland_ha: summary.flooded_cropland_ha,
        submersion_percent: summary.submersion_percent
      },
      features: parcels.map((p) => ({
        type: "Feature",
        id: p.field_id,
        properties: {
          field_id: p.field_id,
          name: p.name,
          total_ha: p.area_ha,
          flooded_ha: p.flooded_ha,
          submersion_percent: p.submersion_percent,
          risk: p.risk_level
        },
        geometry: {
          type: "Polygon",
          coordinates: [p.polygon_normalized.map(pt => [pt[0], pt[1]])]
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GeoScout_Punjab_Flood_Inundated_Parcels_${Date.now()}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 text-slate-100 animate-fade-in">
      
      {/* Top Telemetry & Headline Banner */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-white/10 bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        
        {/* Title & Sensor Badges */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xl font-bold shadow-lg shadow-cyan-500/20">
            🌊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                {floodData?.event_title || "Punjab Agricultural Flood Assessment"}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {floodData?.sensor?.includes('(') ? floodData.sensor.split('(')[0].trim() : (floodData?.sensor || "SENTINEL-1 SAR (VV)")}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>{floodData?.region || "Sutlej Basin • Bi-temporal Inundation Telemetry"}</span>
              <span className="text-cyan-400 font-mono text-[10px]">
                Otsu Threshold: {floodData?.otsu_threshold_db != null ? `${floodData.otsu_threshold_db} dB` : "-16.4 dB"}
              </span>
            </p>
          </div>
        </div>

        {/* Live Submersion Counters */}
        <div className="flex items-center gap-4">
          <div className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/25 flex flex-col items-center">
            <span className="text-[9px] uppercase font-mono text-red-400 font-bold">Submerged Cropland</span>
            <span className="text-base font-black text-red-400 font-mono">
              {summary.flooded_cropland_ha} ha <span className="text-xs text-red-300/80">({summary.submersion_percent}%)</span>
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/60 border border-white/10 flex flex-col items-center">
            <span className="text-[9px] uppercase font-mono text-slate-400 font-bold">Monitored Farmland</span>
            <span className="text-base font-black text-white font-mono">
              {summary.monitored_cropland_ha} ha
            </span>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-cyan-500/20 active:scale-95"
              title="Upload custom Pre/Post satellite pair to run Otsu analysis"
            >
              <IoCloudUploadOutline className="text-base" />
              <span>Upload Custom Pair</span>
            </button>

            {isCustomPair && (
              <button
                onClick={loadBenchmarkData}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-white/10 transition-colors cursor-pointer"
                title="Reset back to Punjab Sutlej benchmark"
              >
                <IoRefreshOutline /> <span>Reset</span>
              </button>
            )}

            <button
              onClick={() => setShowSen1Modal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
              title="Inspect Sen1Floods11 validation metrics"
            >
              <IoRibbonOutline className="text-sm" />
              <span className="hidden sm:inline">Validation</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/30">76.4% IoU</span>
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
              title="Export official bilingual report in Hindi & English"
            >
              <IoDocumentTextOutline className="text-sm" />
              <span>Bilingual Report (हिंदी)</span>
            </button>

            <button
              onClick={handleExportGeoJson}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 transition-colors cursor-pointer"
              title="Export Flooded Parcels GeoJSON"
            >
              <IoDownloadOutline className="text-sm" />
              <span className="hidden md:inline">GeoJSON</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Dual-Pane Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        
        {/* Left GIS Split Canvas */}
        <div 
          className="flex-1 relative bg-slate-950 flex flex-col overflow-hidden select-none border-b lg:border-b-0 lg:border-r border-white/10"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Layer Control Bar */}
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-xl">
            <span className="text-[10px] font-mono uppercase text-slate-400 px-2 flex items-center gap-1">
              <IoLayersOutline /> Layers
            </span>
            <button
              onClick={() => setLayers(l => ({ ...l, showParcels: !l.showParcels }))}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-colors ${
                layers.showParcels ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              Parcels
            </button>
            <button
              onClick={() => setLayers(l => ({ ...l, showFloodOverlay: !l.showFloodOverlay }))}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-colors ${
                layers.showFloodOverlay ? 'bg-red-500/25 text-red-300 border border-red-500/40' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              Flood Mask
            </button>
            <button
              onClick={() => setLayers(l => ({ ...l, showLabels: !l.showLabels }))}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-colors ${
                layers.showLabels ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              Labels
            </button>
          </div>

          {/* Active Field Hover Tooltip */}
          {selectedParcel && (
            <div className="absolute top-4 right-4 z-30 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-400/40 shadow-2xl max-w-xs animate-fade-in">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-1.5">
                <span className="font-mono font-bold text-cyan-300 text-xs">{selectedParcel.field_id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedParcel.risk_level === 'critical' ? 'bg-red-500/20 text-red-400' :
                  selectedParcel.risk_level === 'moderate' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {selectedParcel.submersion_percent}% Submerged
                </span>
              </div>
              <div className="text-xs font-medium text-white">{selectedParcel.name}</div>
              <div className="text-[11px] text-slate-300 font-mono mt-1">
                Area: {selectedParcel.area_ha} ha • Flooded: <strong className="text-red-400">{selectedParcel.flooded_ha} ha</strong>
              </div>
            </div>
          )}

          {/* Interactive Split-Curtain Container */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative flex-1 w-full h-full overflow-hidden cursor-crosshair"
          >
            {/* Background Layer: Post-Flood Sentinel-1 SAR */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
              <img
                src={canvasImages.post}
                alt="Post-Flood Sentinel-1 SAR C-band VV"
                className="w-full h-full object-contain"
              />
              <span className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-cyan-300">
                {floodData?.acquisition_date_post ? `POST-FLOOD: ${floodData.acquisition_date_post}` : "POST-FLOOD: Sentinel-1 SAR (28-Jul-2025)"}
              </span>
            </div>

            {/* Foreground Layer (Clipped): Pre-Flood Optical Baseline */}
            <div
              className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <div className="w-full h-full flex items-center justify-center bg-black">
                <img
                  src={canvasImages.pre}
                  alt="Pre-Flood Agricultural Baseline"
                  className="w-full h-full object-contain"
                />
                <span className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-emerald-300">
                  {floodData?.acquisition_date_pre ? `PRE-FLOOD: ${floodData.acquisition_date_pre}` : "PRE-FLOOD: Optical Baseline (12-Jul-2025)"}
                </span>
              </div>
            </div>

            {/* Interactive SVG Overlay (Parcels & Submersion Vector Polygons) */}
            {layers.showParcels && (
              <svg 
                className="absolute inset-0 w-full h-full z-20 pointer-events-auto"
                viewBox="0 0 1000 1000"
                preserveAspectRatio="none"
              >
                {parcels.map((p) => {
                  const points = p.polygon_normalized.map(pt => `${pt[0] * 1000},${pt[1] * 1000}`).join(' ');
                  const isSelected = selectedFieldId === p.field_id;

                  return (
                    <g key={p.field_id} onClick={() => setSelectedFieldId(p.field_id)} className="cursor-pointer">
                      {/* Submersion Fill */}
                      {layers.showFloodOverlay && p.submersion_percent > 5 && (
                        <polygon
                          points={points}
                          fill={p.color}
                          fillOpacity={isSelected ? 0.45 : 0.28}
                          className="transition-all duration-300"
                        />
                      )}

                      {/* Boundary Stroke */}
                      <polygon
                        points={points}
                        fill="transparent"
                        stroke={isSelected ? '#38bdf8' : p.color}
                        strokeWidth={isSelected ? 4 : 2}
                        strokeDasharray={p.risk_level === 'critical' ? '6,3' : 'none'}
                        className="transition-all duration-200 hover:stroke-cyan-300 hover:stroke-width-3"
                      />

                      {/* Centroid Label */}
                      {layers.showLabels && (
                        <text
                          x={p.centroid[0] * 1000}
                          y={p.centroid[1] * 1000}
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] select-none pointer-events-none"
                        >
                          {p.field_id.replace('PB-FLD-', 'F')} ({p.submersion_percent}%)
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Split Curtain Slider Handle */}
            <div
              className="absolute top-0 bottom-0 z-30 w-1 bg-cyan-400 cursor-ew-resize select-none shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
              onTouchStart={() => setIsDragging(true)}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-400 shadow-xl flex items-center justify-center text-cyan-300 text-xs">
                ↔
              </div>
            </div>

          </div>

          {/* Footer Guide / Instructions */}
          <div className="px-4 py-2 border-t border-white/10 bg-slate-900/70 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <IoWaterOutline className="text-cyan-400" />
              <span>Drag the <strong>split curtain ↔</strong> to inspect before vs after SAR water backscatter.</span>
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              GSD: {floodData?.gsd_resolution_m || 1.0} m/px • Otsu Specular Extraction
            </span>
          </div>

        </div>

        {/* Right Pane: Interactive Per-Field Submersion Table */}
        <div className="w-full lg:w-[480px] xl:w-[540px] flex flex-col h-full overflow-hidden p-4 bg-slate-950/60">
          <FieldSubmersionTable
            fields={parcels}
            selectedFieldId={selectedFieldId}
            onSelectField={(id) => setSelectedFieldId(id)}
          />
        </div>

      </div>

      {/* Custom Flood Pair Upload Modal */}
      <CustomFloodUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onAnalysisComplete={(data, urls) => {
          setFloodData(data);
          setIsCustomPair(true);
          if (urls.postUrl) {
            setCanvasImages({
              pre: urls.preUrl || canvasImages.pre,
              post: urls.postUrl
            });
          }
          if (data.per_field_telemetry?.length > 0) {
            setSelectedFieldId(data.per_field_telemetry[0].field_id);
          }
        }}
      />

      {/* Validation Modal */}
      <Sen1Floods11Modal
        isOpen={showSen1Modal}
        onClose={() => setShowSen1Modal(false)}
      />

      {/* Bilingual Report Modal */}
      <BilingualReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        floodData={floodData}
      />

    </div>
  );
}
