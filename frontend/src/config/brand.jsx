import React from 'react';
import { BRAND } from './brandConstants';

export { BRAND };

/**
 * Modern SVG Logo for GeoScout
 * Orbital Aperture + Geometric Sensor Lens + Sprouting Leaf Accent
 */
export function GeoScoutLogo({ className = "w-8 h-8", animated = false }) {
  return (
    <svg 
      className={`${className} ${animated ? 'transition-transform duration-500 hover:rotate-45' : ''}`} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gs-grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="gs-grad-satellite" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <filter id="gs-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Dark rounded base */}
      <rect width="40" height="40" rx="10" fill="#0f172a" />
      <rect width="40" height="40" rx="10" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />

      {/* Orbital tracker dash ring */}
      <circle 
        cx="20" 
        cy="20" 
        r="14" 
        stroke="url(#gs-grad-emerald)" 
        strokeWidth="2" 
        strokeDasharray="5 3" 
        opacity="0.85" 
      />

      {/* Satellite sensor aperture arc */}
      <path 
        d="M20 8 A12 12 0 0 1 32 20 A12 12 0 0 1 20 32" 
        stroke="url(#gs-grad-satellite)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />

      {/* Agricultural sprout / geo-vector polygon leaf */}
      <path 
        d="M13 25 C15 17 23 15 27 18 C27 24 21 28 13 25 Z" 
        fill="url(#gs-grad-emerald)" 
        opacity="0.9" 
        filter="url(#gs-glow)" 
      />

      {/* Focal optical dot */}
      <circle cx="20" cy="20" r="3" fill="#ffffff" />
      <circle cx="20" cy="20" r="1.5" fill="#0f172a" />
    </svg>
  );
}
