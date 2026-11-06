/**
 * Mode Configuration Registry for GeoScout
 * Easily extensible to add new Earth Observation operational modes.
 */

export const MODES = {
  agriculture: {
    id: 'agriculture',
    label: 'Agriculture',
    shortLabel: 'Agri',
    icon: '🌾',
    badge: 'AGRI-EO',
    themeColor: '#10b981', // Emerald
    accentGlow: 'rgba(16, 185, 129, 0.3)',
    accentBgSubtle: 'rgba(16, 185, 129, 0.12)',
    accentBorder: 'rgba(16, 185, 129, 0.35)',
    description: 'Precision crop parcel segmentation, acreage measurement & irrigation monitoring',
    defaultGsd: 0.5, // 0.5m per pixel typical for high-res field survey
    defaultUnits: {
      primary: 'ha',
      secondary: 'acres',
      metric: 'm²'
    },
    suggestedChips: [
      { icon: "🌾", text: "Detect agricultural field parcels", category: "grounding" },
      { icon: "📐", text: "Calculate total cropland area in hectares", category: "vqa_numeric" },
      { icon: "💧", text: "Identify irrigation canals and ponds", category: "grounding" },
      { icon: "🚜", text: "Count individual farm plots", category: "vqa_numeric" },
      { icon: "🌱", text: "Estimate crop cover percentage", category: "captioning" },
      { icon: "🛰️", text: "Assess field boundary patterns", category: "captioning" }
    ],
    sampleImages: [
      {
        id: 'punjab-wheat',
        title: 'Punjab Agricultural Belt (Canal Colony)',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        description: 'Multi-parcel wheat & rice crop matrix with visible irrigation channels',
        gsd: 0.5
      },
      {
        id: 'california-fields',
        title: 'Central Valley Circular Irrigation Plots',
        url: 'https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?auto=format&fit=crop&w=1200&q=80',
        description: 'Center-pivot irrigation circles and rectilinear cropland blocks',
        gsd: 0.8
      }
    ]
  },

  flood: {
    id: 'flood',
    label: 'Flood & SAR',
    shortLabel: 'Flood',
    icon: '🌊',
    badge: 'SAR-HYDRO',
    themeColor: '#06b6d4', // Cyan / Hydro Blue
    accentGlow: 'rgba(6, 182, 212, 0.3)',
    accentBgSubtle: 'rgba(6, 182, 212, 0.12)',
    accentBorder: 'rgba(6, 182, 212, 0.35)',
    description: 'Bi-temporal Sentinel-1 SAR change detection, Otsu backscatter thresholding & cropland inundation telemetry',
    defaultGsd: 1.0,
    defaultUnits: {
      primary: 'ha',
      secondary: 'acres',
      metric: 'km²'
    },
    suggestedChips: [
      { icon: "🌊", text: "Run Punjab Flood SAR change detection", category: "grounding" },
      { icon: "🌾", text: "Calculate flooded cropland in hectares", category: "vqa_numeric" },
      { icon: "📊", text: "Generate per-field submersion risk table", category: "vqa_numeric" },
      { icon: "📋", text: "Inspect Sen1Floods11 validation metrics", category: "captioning" },
      { icon: "📄", text: "Export bilingual flood assessment report (Hindi/English)", category: "captioning" }
    ],
    sampleImages: [
      {
        id: 'punjab-flood-2025',
        title: '2025 Punjab Flood - Sutlej Basin',
        url: '/data/flood/punjab_post_flood_sar.jpg',
        baselineUrl: '/data/flood/punjab_pre_flood.jpg',
        description: 'Sentinel-1 C-band SAR VV backscatter during peak monsoonal flood with submerged crop parcels',
        gsd: 1.0
      }
    ]
  },

  general: {
    id: 'general',
    label: 'General',
    shortLabel: 'General',
    icon: '🛰️',
    badge: 'EARTH-OBS',
    themeColor: '#0ea5e9', // Electric Cyan
    accentGlow: 'rgba(14, 165, 233, 0.3)',
    accentBgSubtle: 'rgba(14, 165, 233, 0.12)',
    accentBorder: 'rgba(14, 165, 233, 0.35)',
    description: 'Broad remote sensing intelligence: urban footprint, infrastructure, maritime & aviation',
    defaultGsd: 1.0,
    defaultUnits: {
      primary: 'm²',
      secondary: 'km²',
      metric: 'm²'
    },
    suggestedChips: [
      { icon: "🛰️", text: "Describe this satellite scene", category: "captioning" },
      { icon: "✈️", text: "Detect aircraft and hangars", category: "grounding" },
      { icon: "🏢", text: "Segment buildings and urban density", category: "grounding" },
      { icon: "🛢️", text: "Count industrial storage tanks", category: "vqa_numeric" },
      { icon: "🚢", text: "Locate maritime ships and port berths", category: "grounding" },
      { icon: "🛣️", text: "Trace main arterial roadways", category: "grounding" }
    ],
    sampleImages: [
      {
        id: 'airport-hub',
        title: 'International Airport Apron & Runways',
        url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
        description: 'High-density tarmac with commercial airliners and taxiway vectors',
        gsd: 0.5
      },
      {
        id: 'container-port',
        title: 'Maritime Deep-Water Container Terminal',
        url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
        description: 'Container gantry cranes, cargo ships, and container storage yards',
        gsd: 1.0
      }
    ]
  },

  // Future Extensible Modes (Rendered in dropdown as Preview)
  disaster: {
    id: 'disaster',
    label: 'Disaster Response',
    shortLabel: 'Disaster',
    icon: '🚨',
    badge: 'DISASTER-PREVIEW',
    isUpcoming: true,
    themeColor: '#ef4444', // Red
    accentGlow: 'rgba(239, 68, 68, 0.3)',
    accentBgSubtle: 'rgba(239, 68, 68, 0.12)',
    accentBorder: 'rgba(239, 68, 68, 0.35)',
    description: 'Rapid damage assessment, flood extent delineation and wildfire monitoring',
    defaultGsd: 1.5,
    defaultUnits: { primary: 'km²', secondary: 'ha', metric: 'm²' },
    suggestedChips: [
      { text: "🌊 Delineate flooded cropland and settlements", category: "grounding" },
      { text: "🔥 Identify active burn scars", category: "grounding" },
      { text: "🏚️ Count damaged roof structures", category: "vqa_numeric" }
    ]
  },

  urban: {
    id: 'urban',
    label: 'Urban Planning',
    shortLabel: 'Urban',
    icon: '🏙️',
    badge: 'URBAN-PREVIEW',
    isUpcoming: true,
    themeColor: '#8b5cf6', // Violet
    accentGlow: 'rgba(139, 92, 246, 0.3)',
    accentBgSubtle: 'rgba(139, 92, 246, 0.12)',
    accentBorder: 'rgba(139, 92, 246, 0.35)',
    description: 'Building footprint density, green canopy share, and road network zoning',
    defaultGsd: 0.5,
    defaultUnits: { primary: 'm²', secondary: 'km²', metric: 'm²' },
    suggestedChips: [
      { text: "🏙️ Measure urban built-up area footprint", category: "vqa_numeric" },
      { text: "🌳 Calculate green park space coverage", category: "captioning" },
      { text: "🚗 Segment parking lots and vehicles", category: "grounding" }
    ]
  }
};

export const DEFAULT_MODE_ID = 'agriculture';
