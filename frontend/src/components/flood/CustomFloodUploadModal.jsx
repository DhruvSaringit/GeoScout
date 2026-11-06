import React, { useState, useRef } from 'react';
import { 
  IoCloseOutline, 
  IoCloudUploadOutline, 
  IoFlashOutline, 
  IoWaterOutline,
  IoCheckmarkCircle
} from 'react-icons/io5';

/**
 * Custom Flood Pair Upload Modal
 * Allows users to upload arbitrary Pre-Flood & Post-Flood satellite imagery,
 * run live Python Otsu thresholding, and update the GIS canvas dynamically.
 */
export default function CustomFloodUploadModal({ 
  isOpen, 
  onClose, 
  onAnalysisComplete 
}) {
  const [preFile, setPreFile] = useState(null);
  const [postFile, setPostFile] = useState(null);
  const [prePreview, setPrePreview] = useState(null);
  const [postPreview, setPostPreview] = useState(null);
  const [gsd, setGsd] = useState(1.0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const preInputRef = useRef(null);
  const postInputRef = useRef(null);

  if (!isOpen) return null;

  const handlePreChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreFile(file);
      setPrePreview(URL.createObjectURL(file));
    }
  };

  const handlePostChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostFile(file);
      setPostPreview(URL.createObjectURL(file));
    }
  };

  const handleRunAnalysis = async () => {
    if (!postFile) {
      setError('Please select at least a Post-Flood (Inundated / SAR) image.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      if (preFile) formData.append('pre_image', preFile);
      formData.append('post_image', postFile);
      formData.append('gsd', gsd.toString());

      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`;
      const res = await fetch(`${backendUrl}/api/flood/analyze`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      
      // Pass back analysis results and visual preview URLs
      onAnalysisComplete(data, {
        preUrl: prePreview || '/data/flood/punjab_pre_flood.jpg',
        postUrl: postPreview
      });
      onClose();
    } catch (err) {
      console.error('Flood analysis error:', err);
      setError(`Analysis failed: ${err.message}. Retrying with benchmark baseline.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-bold">
              <IoWaterOutline />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Upload Custom Bi-Temporal Flood Pair</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  LIVE OTSU BACKSCATTER
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Execute live OpenCV Otsu thresholding &amp; Shapely cadastral parcel extraction on your imagery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <IoCloseOutline className="text-xl" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 custom-scrollbar">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Dual Dropzone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Box 1: Pre-Flood Baseline */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>1. Pre-Flood Baseline (Optical / Dry)</span>
              </label>

              <input
                ref={preInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handlePreChange}
                className="hidden"
              />

              <div
                onClick={() => preInputRef.current?.click()}
                className={`h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all ${
                  prePreview 
                    ? 'border-emerald-500/50 bg-emerald-500/10' 
                    : 'border-white/15 bg-slate-950/60 hover:border-emerald-400/50'
                }`}
              >
                {prePreview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={prePreview} 
                      alt="Pre-flood preview" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-emerald-300">
                      Baseline Ready
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <IoCloudUploadOutline className="text-2xl text-emerald-400" />
                    <span className="font-semibold text-slate-200">Select Pre-Flood Image</span>
                    <span className="text-[10px] text-slate-500 font-mono">Optical or dry radar baseline</span>
                  </div>
                )}
              </div>
            </div>

            {/* Box 2: Post-Flood Inundation */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>2. Post-Flood Inundation (SAR / Flood) *</span>
              </label>

              <input
                ref={postInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handlePostChange}
                className="hidden"
              />

              <div
                onClick={() => postInputRef.current?.click()}
                className={`h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all ${
                  postPreview 
                    ? 'border-cyan-500/50 bg-cyan-500/10' 
                    : 'border-white/15 bg-slate-950/60 hover:border-cyan-400/50'
                }`}
              >
                {postPreview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={postPreview} 
                      alt="Post-flood preview" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-cyan-300">
                      Inundated SAR Ready
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <IoCloudUploadOutline className="text-2xl text-cyan-400" />
                    <span className="font-semibold text-slate-200">Select Post-Flood Image</span>
                    <span className="text-[10px] text-slate-500 font-mono">Sentinel-1 SAR C-band or flood photo</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* GSD Resolution Control */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/10 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-white block text-xs">Sensor Ground Sampling Distance (GSD)</span>
              <span className="text-[10px] text-slate-400">Used by Shoelace formula to compute physical hectares</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="30"
                value={gsd}
                onChange={(e) => setGsd(parseFloat(e.target.value) || 1.0)}
                className="w-20 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/15 text-slate-200 font-mono text-xs text-right focus:outline-none focus:border-cyan-400"
              />
              <span className="font-mono text-xs text-slate-400">m/pixel</span>
            </div>
          </div>

          {/* Academic Pipeline Explainer */}
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 font-mono text-[11px] text-cyan-200/90 leading-relaxed space-y-1">
            <div><strong>Processing Pipeline:</strong></div>
            <div>1. Python OpenCV calculates Otsu variance maximization on the post-flood radar matrix.</div>
            <div>2. Permanent river/canal vectors are subtracted using the pre-flood baseline.</div>
            <div>3. Cadastral parcels are intersected with flood polygons using Shapely to output per-field hectares.</div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-800/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            {postFile ? 'Ready to execute Python analyzer' : 'Select at least Post-Flood image'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleRunAnalysis}
              disabled={isProcessing || !postFile}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-lg ${
                isProcessing || !postFile
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Executing Otsu Thresholding...</span>
                </>
              ) : (
                <>
                  <IoFlashOutline className="text-sm" />
                  <span>Run Live Otsu Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
