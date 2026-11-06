import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import { BRAND } from '../config/brand';
import { 
  IoArrowBack, 
  IoSchoolOutline, 
  IoSparkles, 
  IoCheckmarkCircle, 
  IoDocumentTextOutline,
  IoGitBranchOutline,
  IoHardwareChipOutline
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
            <IoSchoolOutline />
            <span>Academic Heritage & Defense Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Project Credits & Research Heritage
          </h1>
          <p className="mt-3 text-slate-300 text-sm leading-relaxed">
            Honoring foundational remote sensing research while establishing the novel agricultural workflows, interactive spatial engine, and conversational intelligence of <strong>{BRAND.name}</strong>.
          </p>
        </div>

        {/* Section 1: Foundational Base Work */}
        <section className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-3">
            <IoDocumentTextOutline className="text-emerald-400" />
            1. Foundational Base Research
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            This system builds directly upon the foundational research and software architecture originally created for the <strong>Inter-IIT Tech Meet ISRO Challenge</strong> (project titled <em>GeoNLI: Natural Language Inference for Satellite Imagery</em>).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-slate-950/60 p-4 rounded-xl border border-white/5">
            <div>
              <span className="text-slate-500 block">Baseline Project:</span>
              <span className="text-slate-200 font-bold">{BRAND.heritage.baseProject}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Original Focus:</span>
              <span className="text-slate-200 font-bold">{BRAND.heritage.originalGoal}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Foundational Vision-Language:</span>
              <span className="text-slate-200">Qwen VLM + Segment Anything (SAM 3)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Intent Classification:</span>
              <span className="text-slate-200">DistilBERT Multi-Category Classifier</span>
            </div>
          </div>
        </section>

        {/* Section 2: What is New in GeoScout */}
        <section className="mb-10 p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <IoSparkles className="text-emerald-400" />
              2. What is New in GeoScout (Major Project Contributions)
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              MAJOR ADDITIONS
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            GeoScout transforms the prototype inference script into a full-scale Earth Observation intelligence workstation. All enhancements below were designed and implemented specifically for this project:
          </p>

          <div className="space-y-4">
            {BRAND.heritage.newInGeoScout.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <IoCheckmarkCircle className="text-emerald-400 text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{item}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {idx === 0 && "Custom prompt engineering, parcel boundary aggregation, and agronomic feature grounding over agricultural terrain."}
                    {idx === 1 && "Mathematical Shoelace polygon formula integrated with Ground Sample Distance (GSD) sensor telemetry for exact metric conversion into Hectares (ha) and Acres."}
                    {idx === 2 && "Segmented glassmorphism header toggle shifting primary accent glow, suggested prompt marquee, and target units between Agriculture and General EO."}
                    {idx === 3 && "Full pan, smooth 10x wheel zoom, polygon opacity sliders, before/after split compare curtain, and bidirectional card ↔ polygon focus."}
                    {idx === 4 && "Production-grade downloads: GeoJSON FeatureCollections (RFC 7946), burn-in vector annotated PNGs, session JSON, and printable executive PDF reports."}
                    {idx === 5 && "Strict academic honesty: clearly flagged pre-computed demonstration dataset for reliable offline evaluation alongside live API execution."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Technical & Model Clarification */}
        <section className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-3">
            <IoHardwareChipOutline className="text-cyan-400" />
            3. Model & AI Architecture Clarification
          </h2>
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
            <p>
              <strong>Academic Transparency Statement:</strong> To maintain strict scientific integrity during defense evaluation:
            </p>
            <blockquote className="p-4 rounded-xl bg-slate-950 border-l-4 border-amber-400 text-slate-300 italic text-xs leading-relaxed">
              "GeoScout does not claim to utilize a proprietary agriculture-fine-tuned neural backbone. Instead, the Agricultural Modality operates through <strong>domain-specialized prompt engineering, agricultural unit telemetry (Hectares and Acres), field-oriented grounding queries, and spatial geometric area integration</strong> layered dynamically on top of the Qwen Vision-Language Model and SAM 3 segmentation backbone."
            </blockquote>
          </div>
        </section>

        {/* Section 4: System Architecture Diagram */}
        <section className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <IoGitBranchOutline className="text-purple-400" />
            4. GeoScout Dual-Mode Pipeline
          </h2>

          <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
            <pre className="text-emerald-400">
{`┌─────────────────────────────────────────────────────────────┐
│                       USER QUERY                            │
│  "Calculate total cropland in hectares & segment plots"     │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│       INTENT CLASSIFIER (DistilBERT Multi-Class)            │
│  Category: 'grounding' | 'vqa_numeric' | 'captioning'       │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            GEO-VISION BACKBONE (Qwen VLM + SAM 3)           │
│  • Visual Reasoning Monologue (SSE Streaming)               │
│  • High-Precision Oriented Vector Polygons                  │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          GEOSCOUT SPATIAL SENSOR TELEMETRY (Frontend)       │
│  • Shoelace Theorem: Pixel Area Calculation                 │
│  • GSD Resolution Sensor Factor: Area (ha) = Px * GSD² / 10k│
│  • Real-Time Unit Transformation: Hectares & Acres          │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             GIS INSPECTION COCKPIT & EXPORT                 │
│  • Before/After Curtain  • GeoJSON  • PNG  • PDF Report     │
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
