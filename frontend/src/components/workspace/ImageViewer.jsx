import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  IoAdd, 
  IoRemove, 
  IoScanOutline, 
  IoEyeOutline, 
  IoEyeOffOutline, 
  IoLayersOutline,
  IoGitCompareOutline,
  IoLocationOutline
} from 'react-icons/io5';
import { useMode } from '../../context/ModeContext';
import { convertPixelAreaToRealWorld, calculatePolygonPixelArea } from '../../utils/geoUnits';

export default function ImageViewer({
  imageUrl,
  boxes = [],
  highlightIndex = null,
  selectedIndex = null,
  onSelectBox = () => {},
  naturalSize,
  setNaturalSize,
  displaySize,
  setDisplaySize,
  imageRef
}) {
  const { activeModeConfig, gsd } = useMode();
  const containerRef = useRef(null);

  // Pan & Zoom State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // GIS Controls State
  const [overlayOpacity, setOverlayOpacity] = useState(0.45);
  const [showOverlays, setShowOverlays] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSplit, setCompareSplit] = useState(50);
  const [hoveredBoxIdx, setHoveredBoxIdx] = useState(null);
  const hiddenBoxes = useMemo(() => new Set(), []);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  // Reset zoom & pan when image changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [imageUrl]);

  // Handle image load
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight, clientWidth, clientHeight } = e.target;
    if (setNaturalSize) {
      setNaturalSize({ w: naturalWidth, h: naturalHeight });
    }
    if (setDisplaySize) {
      setDisplaySize({ w: clientWidth, h: clientHeight });
    }
  };

  // Zoom helpers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Wheel zoom
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey || zoom > 1) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      setZoom(prev => Math.max(1, Math.min(prev + delta, 8)));
    }
  };

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (zoom > 1 && e.button === 0 && !e.target.closest('.canvas-control')) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const newX = e.clientX - panStartRef.current.x;
      const newY = e.clientY - panStartRef.current.y;
      setPan({ x: newX, y: newY });
    }

    // Track mouse coordinates over image
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) / zoom);
      const y = Math.round((e.clientY - rect.top) / zoom);
      setMouseCoords({ x: Math.max(0, x), y: Math.max(0, y) });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  // Scaled Vector Geometries
  const scaledPolygons = useMemo(() => {
    const natW = naturalSize?.w || 1000;
    const natH = naturalSize?.h || 1000;
    const dispW = displaySize?.w || natW;
    const dispH = displaySize?.h || natH;
    const scaleX = dispW / natW;
    const scaleY = dispH / natH;

    return (boxes || []).map((box, idx) => {
      if (Array.isArray(box) && box.length === 8) {
        let [x1, y1, x2, y2, x3, y3, x4, y4] = box;
        // Normalize if 0-1
        if (x1 <= 1 && y1 <= 1 && x2 <= 1 && y2 <= 1) {
          x1 *= natW; y1 *= natH;
          x2 *= natW; y2 *= natH;
          x3 *= natW; y3 *= natH;
          x4 *= natW; y4 *= natH;
        }

        const rawPoints = [
          { x: x1, y: y1 },
          { x: x2, y: y2 },
          { x: x3, y: y3 },
          { x: x4, y: y4 }
        ];

        const pixelArea = calculatePolygonPixelArea(rawPoints);
        const realWorld = convertPixelAreaToRealWorld(pixelArea, gsd);

        const svgPoints = rawPoints
          .map(pt => `${pt.x * scaleX},${pt.y * scaleY}`)
          .join(' ');

        return {
          id: idx,
          type: 'polygon',
          svgPoints,
          center: {
            x: ((x1 + x2 + x3 + x4) / 4) * scaleX,
            y: ((y1 + y2 + y3 + y4) / 4) * scaleY
          },
          realWorld
        };
      } else if (Array.isArray(box) && box.length === 5) {
        let [cx, cy, bw, bh, angle = 0] = box;
        if (cx <= 1 && cy <= 1) {
          cx *= natW; cy *= natH; bw *= natW; bh *= natH;
        }
        const pixelArea = bw * bh;
        const realWorld = convertPixelAreaToRealWorld(pixelArea, gsd);

        return {
          id: idx,
          type: 'obb',
          x: (cx - bw / 2) * scaleX,
          y: (cy - bh / 2) * scaleY,
          w: bw * scaleX,
          h: bh * scaleY,
          angle,
          center: { x: cx * scaleX, y: cy * scaleY },
          realWorld
        };
      }
      return null;
    }).filter(Boolean);
  }, [boxes, naturalSize, displaySize, gsd]);

  const primaryAccent = activeModeConfig.themeColor || '#10b981';

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-[#0a0d14] overflow-hidden select-none flex flex-col"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Floating GIS Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* Left: Zoom & Fit Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 shadow-xl pointer-events-auto">
          <button
            onClick={handleZoomIn}
            title="Zoom In (+)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <IoAdd className="text-base" />
          </button>
          <span className="text-[11px] font-mono px-2 text-slate-300 font-semibold min-w-[42px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomOut}
            title="Zoom Out (-)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <IoRemove className="text-base" />
          </button>
          <div className="w-[1px] h-4 bg-white/15 my-auto" />
          <button
            onClick={handleResetZoom}
            title="Fit to Canvas (100%)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <IoScanOutline className="text-sm" />
          </button>
        </div>

        {/* Right: Layer Opacity & Compare Toggle */}
        <div className="flex items-center gap-2 p-1 px-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 shadow-xl pointer-events-auto">
          {/* Compare Split Toggle */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            title="Toggle Split-Screen Satellite Compare"
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
              compareMode
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <IoGitCompareOutline className="text-sm" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          <div className="w-[1px] h-4 bg-white/15 my-auto" />

          {/* Visibility Toggle */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            title={showOverlays ? 'Hide AI Overlays' : 'Show AI Overlays'}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {showOverlays ? <IoEyeOutline className="text-sm" /> : <IoEyeOffOutline className="text-sm text-red-400" />}
          </button>

          {/* Opacity Slider */}
          <div className="flex items-center gap-1.5 pl-1">
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">Opacity</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
              className="w-16 sm:w-20 accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <div
            className="relative transition-transform duration-75 origin-center will-change-transform"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default'
            }}
          >
            {/* Base Satellite Image */}
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Satellite Scene"
              onLoad={handleImageLoad}
              className="max-w-none block pointer-events-none rounded-lg shadow-2xl"
              style={{
                maxHeight: 'calc(100vh - 120px)',
                maxWidth: 'calc(100vw - 450px)',
                width: 'auto',
                height: 'auto'
              }}
            />

            {/* SVG Vector Overlays */}
            {showOverlays && scaledPolygons.length > 0 && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-auto"
                style={{
                  clipPath: compareMode ? `inset(0 0 0 ${compareSplit}%)` : 'none'
                }}
              >
                {scaledPolygons.map((poly) => {
                  const isHovered = hoveredBoxIdx === poly.id || highlightIndex === poly.id;
                  const isSelected = selectedIndex === poly.id;
                  const isHidden = hiddenBoxes.has(poly.id);

                  if (isHidden) return null;

                  return (
                    <g key={poly.id} className="cursor-pointer" onClick={() => onSelectBox(poly.id)}>
                      {poly.type === 'polygon' && (
                        <polygon
                          points={poly.svgPoints}
                          fill={isHovered || isSelected ? primaryAccent : primaryAccent}
                          fillOpacity={isHovered || isSelected ? Math.min(overlayOpacity + 0.35, 0.9) : overlayOpacity}
                          stroke={isHovered || isSelected ? '#ffffff' : primaryAccent}
                          strokeWidth={isHovered || isSelected ? 3 : 1.8}
                          strokeDasharray={isSelected ? '4 2' : 'none'}
                          className="transition-all duration-150"
                          onMouseEnter={() => setHoveredBoxIdx(poly.id)}
                          onMouseLeave={() => setHoveredBoxIdx(null)}
                        />
                      )}

                      {/* Center Label Tag */}
                      <g 
                        transform={`translate(${poly.center.x}, ${poly.center.y})`}
                        className="pointer-events-none"
                      >
                        <rect
                          x="-18"
                          y="-9"
                          width="36"
                          height="18"
                          rx="4"
                          fill="rgba(15, 23, 42, 0.85)"
                          stroke={primaryAccent}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="3"
                          fill="#ffffff"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          #{poly.id + 1}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Split Screen Curtain Slider in Compare Mode */}
            {compareMode && (
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] cursor-ew-resize z-20 pointer-events-auto"
                style={{ left: `${compareSplit}%` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const startX = e.clientX;
                  const startSplit = compareSplit;
                  const onMove = (ev) => {
                    const deltaX = ev.clientX - startX;
                    const rect = imageRef.current?.getBoundingClientRect();
                    if (rect) {
                      const deltaPct = (deltaX / rect.width) * 100;
                      setCompareSplit(Math.max(5, Math.min(95, startSplit + deltaPct)));
                    }
                  };
                  const onUp = () => {
                    window.removeEventListener('mousemove', onMove);
                    window.removeEventListener('mouseup', onUp);
                  };
                  window.addEventListener('mousemove', onMove);
                  window.addEventListener('mouseup', onUp);
                }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[9px] text-white">
                  ↔
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 text-slate-500">
            <IoLayersOutline className="text-4xl mx-auto mb-2 opacity-50" />
            <p className="text-sm">Upload or select a satellite scene to begin analysis</p>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="h-7 bg-slate-950/90 border-t border-white/10 px-3 flex items-center justify-between text-[11px] font-mono text-slate-400 z-20">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-300">
            <IoLocationOutline className="text-xs text-emerald-400" />
            <span>X: {mouseCoords.x}px | Y: {mouseCoords.y}px</span>
          </span>
          <span className="text-slate-600">•</span>
          <span>Sensor GSD: <strong className="text-white">{gsd} m/px</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span>Targets: <strong className="text-white">{scaledPolygons.length}</strong></span>
          <span className="text-slate-600">•</span>
          <span>Dimensions: {naturalSize?.w || 0} × {naturalSize?.h || 0} px</span>
        </div>
      </div>
    </div>
  );
}
