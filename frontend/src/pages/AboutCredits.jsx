import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import { BRAND } from '../config/brand';
import { 
  IoArrowBack, 
  IoGlobeOutline, 
  IoSparkles, 
  IoCheckmarkCircle, 
  IoDocumentTextOutline,
  IoGitBranchOutline,
  IoHardwareChipOutline,
  IoShieldCheckmarkOutline
} from 'react-icons/io5';

export default function AboutCredits() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white mb-8 transition-colors cursor-pointer"
        >
          <IoArrowBack />
          <span>Back to Home</span>
        </button>

        {/* Page Header */}
        <div className="border-b border-white/10 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 mb-3">
            <IoGlobeOutline />
            <span>Platform Overview & Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About {BRAND.name}
          </h1>
          <p className="mt-3 text-slate-300 text-sm leading-relaxed">
            {BRAND.tagline} — an autonomous, multi-modal remote sensing intelligence platform bridging state-of-the-art vision-language reasoning with deterministic GIS spatial telemetry.
          </p>
        </div>

        {/* Section 1: Core Purpose */}
        <section className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-3">
            <IoDocumentTextOutline className="text-emerald-400" />
            1. Core Purpose & Mission
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            Traditional geographic information systems (GIS) like QGIS and ArcGIS demand steep learning curves, manual band combinations, and specialized photo-interpretation. <strong>{BRAND.name}</strong> solves this through zero-shot natural language interaction: analysts simply drag-and-drop high-resolution satellite scenes and query terrain, infrastructure, disaster damage, and crop health in plain conversational English.
          </p>
        </section>

        {/* Section 2: Upstream Foundation vs Verified Additions */}
        <section className="mb-10 p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <IoSparkles className="text-emerald-400" />
              2. Upstream Foundations & Verified GeoScout Additions
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              VERIFIED ARCHITECTURE
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            To maintain strict scientific integrity, {BRAND.name} clearly separates upstream open-source foundation models from novel contributions developed specifically for this project:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Upstream Foundations Card */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Upstream Foundation Models (Open-Source)
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>Qwen2.5-VL:</strong> Vision-Language reasoning and multi-task token generation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>SAM 3 (Segment Anything):</strong> Prompt-conditioned zero-shot instance segmentation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>DistilBERT:</strong> Lightweight intent and query category classification.</span>
                </li>
              </ul>
            </div>

            {/* Implemented in GeoScout Card */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                Implemented for GeoScout (Our Contributions)
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Rotated 8-Point OBBs:</strong> OpenCV <code className="text-emerald-300">minAreaRect</code> heading orientation, eliminating axis-aligned bounding box overlap on angled aerial targets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Sensor GSD Calibration:</strong> Dynamic physical telemetry engine converting pixel contours directly to Hectares (ha) and Acres.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Bi-Temporal SAR Flood Engine:</strong> Sentinel-1 C-band Otsu specular thresholding and Shapely cadastral parcel damage assessment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Interactive Web GIS Canvas:</strong> Multi-format export (GeoJSON, vector PNG, PDF reports), zoom/pan controls, and split wipe curtain.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Technical Transparency & Attribution */}
        <section className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-3">
            <IoShieldCheckmarkOutline className="text-cyan-400" />
            3. Transparency & Attribution Statement
          </h2>
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
            <blockquote className="p-4 rounded-xl bg-slate-950 border-l-4 border-cyan-400 text-slate-300 text-xs leading-relaxed">
              GeoScout leverages state-of-the-art open-source AI backbones. We do not claim authorship of the underlying base foundation weights (Qwen, SAM 3, DistilBERT). All third-party libraries, datasets (DOTA, Sen1Floods11), and foundational models are acknowledged and governed by their respective open-source licenses. For complete citations and license records, refer to <code className="text-cyan-300 font-mono">ATTRIBUTION.md</code>.
            </blockquote>
          </div>
        </section>

        {/* Section 4: Dual-Mode Architecture */}
        <section className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <IoGitBranchOutline className="text-purple-400" />
            4. GeoScout Decoupled Multi-Modal Pipeline
          </h2>

          <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
            <pre className="text-emerald-400">
{`┌─────────────────────────────────────────────────────────────┐
│                       USER QUERY                            │
│  "Detect agricultural field parcels & calculate area in ha" │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│       INTENT CLASSIFIER (DistilBERT Multi-Category)         │
│  Routing Policy: 'captioning' | 'grounding' | 'vqa_numeric' │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          GEO-VISION BACKBONE (Qwen2.5-VL + SAM 3)           │
│  • Natural Language Scene Reasoning                         │
│  • Text-Prompted Instance Masks (Semantic IoB > 0.5)        │
│  • OpenCV minAreaRect → 8-Point Rotated OBB Generation      │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          GEOSCOUT SPATIAL SENSOR TELEMETRY (Deterministic)  │
│  • Shoelace Polygon Integration: Pixel Surface Count        │
│  • Sensor Resolution Factor: Area (ha) = Px * GSD² / 10,000 │
│  • 0.0% Run-to-Run Variance (No Generative Hallucinations)   │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             WEB GIS WORKSTATION & EXPORT                    │
│  • Interactive Canvas  • GeoJSON  • Shapefile  • PDF Report │
└─────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </section>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/chat')}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all cursor-pointer"
          >
            Launch GeoScout Workspace
          </button>
        </div>
      </main>
    </div>
  );
}
