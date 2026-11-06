import React, { useState, useRef, useMemo, useEffect } from 'react';
import ImageViewer from './ImageViewer';
import ChatPanel from './ChatPanel';
import ExportModal from './ExportModal';
import { useMode } from '../../context/ModeContext';

export default function WorkspaceLayout({
  chatId,
  imageUrl,
  chatTitle,
  chatHistory = [],
  onSendMessage,
  isGenerating,
  elapsedTime,
  lastResponseTime,
  onShareClick
}) {
  const { isDemoMode, activeDemoDataset } = useMode();

  // If in Demo Mode and no live chat is loaded, seamlessly display the active demo dataset!
  const effectiveImageUrl = (isDemoMode && !chatId) ? activeDemoDataset.imageUrl : imageUrl;
  const effectiveChatTitle = (isDemoMode && !chatId) ? activeDemoDataset.title : chatTitle;
  const effectiveChatHistory = (isDemoMode && !chatId) ? activeDemoDataset.chats : chatHistory;

  // Split pane sizing
  const [leftWidthPercent, setLeftWidthPercent] = useState(58);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Cross-linking selection state
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Natural and display image metrics
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });

  // Extract latest bounding boxes
  const latestBoxes = useMemo(() => {
    if (!Array.isArray(effectiveChatHistory)) return [];
    for (let i = effectiveChatHistory.length - 1; i >= 0; i--) {
      const b = effectiveChatHistory[i]?.bounding_boxes;
      if (Array.isArray(b) && b.length > 0) return b;
    }
    return [];
  }, [effectiveChatHistory]);

  // Mouse drag resizer
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidthPercent(Math.max(30, Math.min(75, newWidth)));
    };

    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 w-full h-full flex flex-col md:flex-row overflow-hidden relative"
    >
      {/* Left Pane: GIS & Image Viewer */}
      <div 
        className="h-1/2 md:h-full relative overflow-hidden"
        style={{ width: `${leftWidthPercent}%` }}
      >
        <ImageViewer
          imageUrl={effectiveImageUrl}
          boxes={latestBoxes}
          highlightIndex={highlightIndex}
          selectedIndex={selectedIndex}
          onSelectBox={(idx) => setSelectedIndex(idx)}
          naturalSize={naturalSize}
          setNaturalSize={setNaturalSize}
          displaySize={displaySize}
          setDisplaySize={setDisplaySize}
          imageRef={imageRef}
        />
      </div>

      {/* Resizer Divider */}
      <div
        className="hidden md:flex w-1.5 hover:w-2 bg-slate-950 border-x border-white/10 cursor-col-resize items-center justify-center transition-all z-30 group"
        onMouseDown={() => setIsResizing(true)}
      >
        <div className="w-0.5 h-8 rounded-full bg-white/20 group-hover:bg-emerald-400 transition-colors" />
      </div>

      {/* Right Pane: Conversational Intelligence Stream */}
      <div 
        className="h-1/2 md:h-full relative overflow-hidden"
        style={{ width: `${100 - leftWidthPercent}%` }}
      >
        <ChatPanel
          chatId={chatId}
          chatTitle={effectiveChatTitle}
          chatHistory={effectiveChatHistory}
          onSendMessage={onSendMessage}
          isGenerating={isGenerating}
          elapsedTime={elapsedTime}
          lastResponseTime={lastResponseTime}
          onShareClick={onShareClick}
          onOpenExport={() => setShowExportModal(true)}
          onHighlightBox={(idx) => setHighlightIndex(idx)}
          onSelectBox={(idx) => setSelectedIndex(idx)}
          selectedIndex={selectedIndex}
          boxes={latestBoxes}
          naturalWidth={naturalSize?.w || 1000}
          naturalHeight={naturalSize?.h || 1000}
        />
      </div>

      {/* Multi-Format Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        chatId={chatId}
        chatTitle={effectiveChatTitle}
        chatHistory={effectiveChatHistory}
        boxes={latestBoxes}
        imageElement={imageRef.current}
        naturalWidth={naturalSize?.w}
        naturalHeight={naturalSize?.h}
        imageUrl={effectiveImageUrl}
      />
    </div>
  );
}
