import React, { useState, useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useMode } from "../context/ModeContext";

export default function ImageUpload({ onImageSelect }) {
  const { activeModeConfig } = useMode();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      } else {
        alert('Please drop a valid image file (JPEG, JPG, PNG)');
      }
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const primaryAccent = activeModeConfig.themeColor || '#10b981';

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xl">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full min-h-[260px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 p-8 transition-all ${
          isDragging 
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]' 
            : 'border-white/15 bg-slate-900/60 hover:border-white/30 backdrop-blur-md'
        }`}
      >
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
          style={{ backgroundColor: activeModeConfig.accentBgSubtle, color: primaryAccent }}
        >
          <IoCloudUploadOutline />
        </div>
        
        <div className="text-center">
          <div className="text-white text-lg font-bold">
            {isDragging ? 'Drop satellite scene here' : 'Drag & drop satellite scene'}
          </div>
          <div className="text-slate-400 text-xs mt-1">
            Supports high-resolution optical, aerial & multi-spectral exports (JPG, PNG)
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-[11px] text-slate-500 uppercase font-mono">or</span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>
        
        <button
          onClick={handleBrowseClick}
          className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 transition-all hover:scale-105 cursor-pointer shadow-lg"
          style={{ backgroundColor: primaryAccent }}
        >
          Browse Files
        </button>
      </div>
    </div>
  );
}
