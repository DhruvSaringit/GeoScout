import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  IoSend, 
  IoShareSocialOutline, 
  IoDownloadOutline, 
  IoChevronDown, 
  IoChevronUp, 
  IoCopyOutline, 
  IoCheckmark, 
  IoMicOutline,
  IoSparkles,
  IoLayersOutline,
  IoFlashOutline
} from 'react-icons/io5';
import { BiLoaderAlt } from 'react-icons/bi';
import { useMode } from '../../context/ModeContext';
import { convertPixelAreaToRealWorld, calculatePolygonPixelArea } from '../../utils/geoUnits';

export default function ChatPanel({
  chatTitle,
  chatHistory = [],
  onSendMessage,
  isGenerating,
  elapsedTime,
  lastResponseTime,
  onShareClick,
  onOpenExport,
  onHighlightBox,
  onSelectBox,
  selectedIndex,
  boxes = [],
  naturalWidth = 1000,
  naturalHeight = 1000
}) {
  const { currentMode, activeModeConfig, gsd, isDemoMode, setIsDemoMode } = useMode();
  const [query, setQuery] = useState('');
  const [expandedThinking, setExpandedThinking] = useState({});
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isGenerating]);

  // Handle send
  const handleSend = () => {
    if (!query.trim() || isGenerating) return;
    onSendMessage(query.trim());
    setQuery('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e) => {
    setQuery(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  const handleCopy = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  // Web Speech API Voice Input
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuery(prev => prev ? `${prev} ${transcript}` : transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Compute total area of current boxes
  const totalMetrics = useMemo(() => {
    if (!boxes || boxes.length === 0) return null;
    let totalPixelArea = 0;

    boxes.forEach(box => {
      if (Array.isArray(box) && box.length === 8) {
        let [x1, y1, x2, y2, x3, y3, x4, y4] = box;
        if (x1 <= 1) {
          x1 *= naturalWidth; y1 *= naturalHeight;
          x2 *= naturalWidth; y2 *= naturalHeight;
          x3 *= naturalWidth; y3 *= naturalHeight;
          x4 *= naturalWidth; y4 *= naturalHeight;
        }
        totalPixelArea += calculatePolygonPixelArea([
          { x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }, { x: x4, y: y4 }
        ]);
      } else if (Array.isArray(box) && box.length === 5) {
        let [, , w, h] = box;
        if (w <= 1) { w *= naturalWidth; h *= naturalHeight; }
        totalPixelArea += (w * h);
      }
    });

    return convertPixelAreaToRealWorld(totalPixelArea, gsd);
  }, [boxes, gsd, naturalWidth, naturalHeight]);

  const primaryAccent = activeModeConfig.themeColor || '#10b981';

  return (
    <div className="flex flex-col h-full bg-[#0d111c] text-slate-100 border-l border-white/10 select-text overflow-hidden">
      {/* Chat Panel Header */}
      <div className="flex-shrink-0 h-14 px-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base">{activeModeConfig.icon}</span>
          <div className="min-w-0">
            <h2 className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-[280px]">
              {chatTitle || 'Satellite Inspection Workspace'}
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryAccent }} />
              <span>{activeModeConfig.label} Mode</span>
              <span>•</span>
              <span>GSD: {gsd}m/px</span>
              {lastResponseTime && (
                <>
                  <span>•</span>
                  <span>Last: {lastResponseTime}s</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenExport}
            title="Export Spatial Intelligence (PNG, GeoJSON, PDF)"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            <IoDownloadOutline className="text-sm" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={onShareClick}
            title="Share Workspace Link"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <IoShareSocialOutline className="text-base" />
          </button>
        </div>
      </div>

      {/* Demo Mode Notice Banner (Strict academic integrity labeling) */}
      {isDemoMode && (
        <div className="flex-shrink-0 px-3 py-1.5 bg-amber-500/15 border-b border-amber-500/30 text-amber-300 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <IoFlashOutline className="text-sm animate-pulse" />
            <span><strong>Demo Mode:</strong> Pre-computed results. Live mode calls the real API.</span>
          </div>
          <button
            onClick={() => setIsDemoMode(false)}
            className="underline font-bold hover:text-white ml-2 text-[10px]"
          >
            Exit Demo
          </button>
        </div>
      )}

      {/* Suggested Prompt Chips Marquee */}
      <div className="flex-shrink-0 py-2 px-3 border-b border-white/5 bg-slate-900/40 overflow-x-auto custom-scrollbar flex items-center gap-2">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
          <IoSparkles className="text-[9px] text-emerald-400" /> Prompts:
        </span>
        {activeModeConfig.suggestedChips?.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQuery(chip.text);
              if (textareaRef.current) textareaRef.current.focus();
            }}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            {chip.icon && <span>{chip.icon}</span>}
            <span>{chip.text}</span>
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-3">
              {activeModeConfig.icon}
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Ready for {activeModeConfig.label} Spatial Querying
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              {activeModeConfig.description}
            </p>
            <div className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400">
              Sensor Resolution calibrated at <strong>{gsd} meters/pixel</strong>
            </div>
          </div>
        ) : (
          chatHistory.map((item, idx) => {
            const hasBoxes = Array.isArray(item.bounding_boxes) && item.bounding_boxes.length > 0;
            const isThinkingExpanded = expandedThinking[idx] !== false; // Default expanded

            return (
              <div key={idx} className="space-y-3 fade-in">
                {/* User Query Bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-slate-800 to-slate-700 border border-white/10 text-white text-xs leading-relaxed shadow-md">
                    {item.query}
                  </div>
                </div>

                {/* AI Response Card */}
                <div className="flex justify-start">
                  <div className="w-full max-w-[95%] p-4 rounded-2xl rounded-tl-sm bg-slate-900/90 border border-white/10 shadow-lg space-y-3">
                    {/* Header: Ambient Mode Badge & Response Time */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/10 pb-2">
                      <span className="flex items-center gap-1.5 font-bold" style={{ color: primaryAccent }}>
                        <span>{activeModeConfig.icon}</span>
                        <span>{activeModeConfig.badge}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        {item.response_time && (
                          <span>Latency: {item.response_time}</span>
                        )}
                        <button
                          onClick={() => handleCopy(item.response, idx)}
                          title="Copy finding"
                          className="hover:text-white transition-colors"
                        >
                          {copiedIdx === idx ? <IoCheckmark className="text-emerald-400" /> : <IoCopyOutline />}
                        </button>
                      </div>
                    </div>

                    {/* Step-by-Step Reasoning Monologue (SSE Streamed Accordion) */}
                    {item.reasoning && (
                      <div className="rounded-xl bg-slate-950/70 border border-white/5 overflow-hidden">
                        <button
                          onClick={() => setExpandedThinking(prev => ({ ...prev, [idx]: !isThinkingExpanded }))}
                          className="w-full px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            <span>VLM Reasoning Monologue ({item.reasoning_time || 'live'})</span>
                          </span>
                          {isThinkingExpanded ? <IoChevronUp /> : <IoChevronDown />}
                        </button>

                        {isThinkingExpanded && (
                          <div className="p-3 text-xs font-mono text-slate-300 bg-slate-950/90 border-t border-white/5 whitespace-pre-wrap leading-relaxed">
                            {item.reasoning}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Main Solution Text */}
                    <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {item.response === '...' ? (
                        <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
                          <BiLoaderAlt className="animate-spin text-emerald-400" />
                          <span>Generating spatial reasoning...</span>
                        </div>
                      ) : (
                        item.response
                      )}
                    </div>

                    {/* Structured Spatial Telemetry Block (Agriculture Hectares / Acres or General m²) */}
                    {hasBoxes && totalMetrics && (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-emerald-500/30 text-xs">
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10 font-bold text-white">
                          <span className="flex items-center gap-1.5">
                            <IoLayersOutline className="text-emerald-400" />
                            <span>
                              {currentMode === 'agriculture' ? 'Crop Parcel Telemetry' : 'Spatial Object Telemetry'}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono text-emerald-300">
                            {item.bounding_boxes.length} targets detected
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-slate-300">
                          {currentMode === 'agriculture' ? (
                            <>
                              <div>
                                <span className="text-[10px] text-slate-500 block">Total Area (ha):</span>
                                <span className="text-sm font-bold text-emerald-400">{totalMetrics.formattedHa}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block">Total Area (acres):</span>
                                <span className="text-sm font-bold text-cyan-400">{totalMetrics.formattedAcres}</span>
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                <span className="text-[10px] text-slate-500 block">Sensor Factor:</span>
                                <span className="text-xs text-slate-300">{gsd} m/px</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <span className="text-[10px] text-slate-500 block">Total Area (m²):</span>
                                <span className="text-sm font-bold text-cyan-400">{totalMetrics.formattedSqM}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block">Square Kilometers:</span>
                                <span className="text-sm font-bold text-emerald-400">{totalMetrics.formattedSqKm}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block">Count:</span>
                                <span className="text-xs text-slate-300">{item.bounding_boxes.length} objects</span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Interactive Parcel Chips */}
                        <div className="mt-3 pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
                          <span className="text-[10px] text-slate-500 self-center">Targets:</span>
                          {item.bounding_boxes.slice(0, 16).map((_, bIdx) => (
                            <button
                              key={bIdx}
                              onClick={() => onSelectBox && onSelectBox(bIdx)}
                              onMouseEnter={() => onHighlightBox && onHighlightBox(bIdx)}
                              onMouseLeave={() => onHighlightBox && onHighlightBox(null)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                                selectedIndex === bIdx
                                  ? 'bg-emerald-500 text-slate-950 font-bold'
                                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
                              }`}
                            >
                              #{bIdx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="flex-shrink-0 p-3 bg-slate-950/80 border-t border-white/10">
        <div className="relative flex items-end gap-2 p-1.5 rounded-2xl bg-slate-900 border border-white/15 focus-within:border-emerald-500/70 transition-all shadow-inner">
          {/* Voice Input Mic Button */}
          <button
            onClick={toggleVoiceInput}
            title={isListening ? 'Listening... click to stop' : 'Voice Input (Speech-to-Text)'}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isListening
                ? 'bg-red-500/20 text-red-400 animate-pulse'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <IoMicOutline className="text-lg" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={query}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={
              currentMode === 'agriculture'
                ? "Ask about crop parcels, acreage in ha, irrigation channels..."
                : "Ask about aircraft, runways, buildings, roads, scene context..."
            }
            className="flex-1 max-h-36 py-2 px-1 bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!query.trim() || isGenerating}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              query.trim() && !isGenerating
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/25'
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <BiLoaderAlt className="animate-spin text-base" />
            ) : (
              <IoSend className="text-base" />
            )}
          </button>
        </div>

        <div className="mt-1 px-1 flex items-center justify-between text-[10px] text-slate-500">
          <span>Shift+Enter for new line • Enter to submit</span>
          <span>Mode: {activeModeConfig.label}</span>
        </div>
      </div>
    </div>
  );
}
