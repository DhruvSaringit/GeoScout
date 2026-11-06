/**
 * Pre-Computed Sample Datasets for GeoScout Demonstration Mode
 * 
 * IMPORTANT: In accordance with academic integrity guidelines, these samples are
 * explicitly watermarked in the UI as:
 * "Demo mode: pre-computed results"
 * Live mode connects directly to the real API.
 */

export const DEMO_DATASETS = [
  {
    id: 'demo-agri-punjab',
    mode: 'agriculture',
    title: 'Punjab Agricultural Belt - Crop Field Delineation',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80',
    gsd: 0.5, // 0.5 m/px
    naturalSize: { w: 1200, h: 800 },
    chats: [
      {
        query: 'Segment the agricultural field parcels and calculate total acreage',
        response: 'Detected 12 primary agricultural crop parcels across the surveyed quadrant. Based on sensor GSD calibration (0.50 m/px), the aggregate cultivated crop area spans 38.42 hectares (94.94 acres). The parcel boundaries exhibit typical canal-irrigated rectilinear layout with distinct spectral reflectance between mature cereal crops and fallow preparatory parcels.',
        reasoning: '1. Intent Classification: Agricultural grounding and parcel area extraction (category: grounding).\n2. Remote Sensing Backbone: Executed multi-scale vision-language reasoning via Qwen VLM.\n3. Segment Anything 3 (SAM) Integration: Generated oriented polygon masks for all high-contrast crop boundary edges.\n4. Spatial Metric Telemetry: Recomputed pixel sum through Shoelace theorem multiplied by (GSD 0.5m)².\n5. Output Validation: Cross-referenced 12 polygon parcels against high-resolution optical reflectance.',
        response_time: '2.8s',
        reasoning_time: '1.4s',
        task_type: 'grounding',
        bounding_boxes: [
          // 8-point polygons (normalized 0 to 1)
          [0.08, 0.15, 0.28, 0.14, 0.29, 0.42, 0.09, 0.44],
          [0.31, 0.14, 0.52, 0.13, 0.53, 0.40, 0.32, 0.42],
          [0.55, 0.12, 0.78, 0.11, 0.79, 0.38, 0.56, 0.40],
          [0.80, 0.10, 0.96, 0.09, 0.97, 0.35, 0.81, 0.37],
          [0.07, 0.48, 0.27, 0.46, 0.28, 0.78, 0.08, 0.80],
          [0.30, 0.45, 0.53, 0.44, 0.54, 0.76, 0.31, 0.78],
          [0.56, 0.43, 0.79, 0.41, 0.80, 0.74, 0.57, 0.76],
          [0.82, 0.40, 0.96, 0.38, 0.97, 0.72, 0.83, 0.74],
          [0.10, 0.82, 0.35, 0.81, 0.36, 0.96, 0.11, 0.97],
          [0.38, 0.80, 0.62, 0.78, 0.63, 0.95, 0.39, 0.96],
          [0.64, 0.77, 0.82, 0.75, 0.83, 0.94, 0.65, 0.95],
          [0.84, 0.75, 0.97, 0.73, 0.98, 0.93, 0.85, 0.94]
        ]
      },
      {
        query: 'What is the dominant irrigation network in this scene?',
        response: 'Visual inspection reveals a rectilinear feeder canal traversing horizontally between the northern and southern field tiers. Distinct moisture absorption bands are observable along parcel margins, indicating furrow and basin irrigation channels.',
        reasoning: '1. Intent Classification: Scene understanding and hydrologic feature analysis.\n2. Visual Feature Tracking: High-contrast linear absorption strip detected between Y=0.42 and Y=0.45.\n3. Agronomic Assessment: Spatial orientation corresponds to gravity-fed distributor canal networks.',
        response_time: '1.9s',
        reasoning_time: '1.1s',
        task_type: 'captioning',
        bounding_boxes: []
      }
    ]
  },

  {
    id: 'demo-general-airport',
    mode: 'general',
    title: 'Commercial Airport Apron & Aviation Infrastructure',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80',
    gsd: 0.5,
    naturalSize: { w: 1200, h: 800 },
    chats: [
      {
        query: 'Locate all commercial aircraft parked on the terminal apron',
        response: 'Identified 8 commercial passenger aircraft docked along the gate concourse and taxiway holding positions. SAM 3 oriented bounding boxes have been fitted to fuselage-wing axes.',
        reasoning: '1. Intent Classification: Aviation object grounding (category: grounding).\n2. Qwen VLM Reasoning: Scanned tarmac area for swept-wing aircraft signatures.\n3. SAM 3 Alignment: Generated oriented bounding boxes with rotation angles corresponding to aircraft headings.\n4. Verification: 8 aircraft confirmed with high confidence.',
        response_time: '3.1s',
        reasoning_time: '1.6s',
        task_type: 'grounding',
        bounding_boxes: [
          [0.22, 0.28, 0.38, 0.24, 0.42, 0.40, 0.26, 0.44],
          [0.44, 0.26, 0.58, 0.22, 0.62, 0.38, 0.48, 0.42],
          [0.64, 0.24, 0.78, 0.20, 0.82, 0.36, 0.68, 0.40],
          [0.18, 0.55, 0.32, 0.52, 0.35, 0.68, 0.21, 0.71],
          [0.36, 0.52, 0.50, 0.49, 0.53, 0.65, 0.39, 0.68],
          [0.54, 0.50, 0.68, 0.47, 0.71, 0.63, 0.57, 0.66],
          [0.72, 0.48, 0.86, 0.45, 0.89, 0.61, 0.75, 0.64],
          [0.45, 0.72, 0.62, 0.70, 0.65, 0.88, 0.48, 0.90]
        ]
      }
    ]
  }
];
