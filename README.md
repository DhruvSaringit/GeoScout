# GeoScout: AI-Powered Multi-Sensor Earth Observation & Geospatial Intelligence Platform

GeoScout is an end-to-end geospatial intelligence system that bridges high-resolution satellite imagery with natural language understanding. It decouples high-level visual reasoning from deterministic pixel measurement through a specialized 3-stage AI pipeline, enabling reliable agricultural parcel telemetry and cadastral flood disaster assessment.

---

## Key Highlights

- **3-Stage Decoupled Pipeline**:
  - **Stage 1 (Reasoning & VQA)**: Fine-tuned `Qwen3-VL` with Group Sequence Policy Optimization (GSPO) for satellite context reasoning and chain-of-thought `<think>` traces.
  - **Stage 2 (Pixel Grounding & Segmentation)**: Fine-tuned `SAM 3` (Segment Anything Model 3) with LoRA ($r=8$) and an RL-inspired IoU Preference Loss ($L_{RL}$), Non-Maximum Suppression (NMS), and Oriented Bounding Box (OBB) extraction.
  - **Stage 3 (Deterministic Measurement)**: `DistilBERT` intent router directing queries to classical `OpenCV` pixel integration and quadratic Ground Sampling Distance (GSD) conversion.
- **Physical Accuracy (No LLM Pixel Hallucinations)**:
  $$\text{Area (m}^2) = N_{\text{pixels}} \times (\text{GSD})^2$$
  $$\text{Area (hectares)} = \frac{\text{Area (m}^2)}{10,000}, \quad \text{Area (acres)} = \text{Area (ha)} \times 2.47105$$
- **Interactive GIS Workspace**: React 19 canvas with sub-pixel pan, 1x–8x zoom, interactive SVG rotated bounding boxes, and dynamic mask opacity.
- **Sensor Mode Architecture**:
  - **Agriculture Mode**: GSD = $0.5\text{ m/px}$ (High-resolution multispectral crop parcels).
  - **Flood Mode**: GSD = $1.0\text{ m/px}$ (Sentinel-1 SAR Radar specular backscatter thresholding).
  - **General Mode**: GSD = $0.5\text{ m/px}$ (Standard satellite/aerial optical).
- **Cadastral Disaster Assessment**: Bi-temporal radar analysis with 12 land parcels, percentage submersion tracking, and bilingual (English / हिंदी) government relief audit reports.
- **Zero-Backend Offline Demo Mode**: Fully functional offline fallback with instant replay of multi-sensor sample data.

---

## Architecture

```text
[ Browser Frontend: React 19 / Vite GIS Canvas ]
                 │  (HTTP / REST)
                 ▼
[ Backend API: Express / Node.js Router ]
     ├── MinIO / S3  (Presigned Raw Image Storage)
     ├── MongoDB     (Telemetry & Conversation History)
     └── Cloudflare Secure Tunnels
                 │
                 ├── Stage 1: Qwen3-VL (GSPO Reasoning & VQA)
                 ├── Stage 2: SAM 3 (LoRA Visual Grounding & OBB Masks)
                 └── Stage 3: DistilBERT Router + OpenCV (Area / Count / Perimeter)
```

Interactive architecture diagrams and data flows are available in [`docs/architecture_diagrams/`](docs/architecture_diagrams/).

---

## Documentation

- **[Master Academic Dossier (PDF)](docs/GeoScout_Project_Dossier.pdf)**: Complete 27-page academic report with system comparisons, mathematical formulations, and engineering ledger.
- **[Master Academic Dossier (Word DOCX)](docs/GeoScout_Project_Dossier.docx)**: Editable Microsoft Word format.
- **[System Architecture Guide](PROJECT_EXPLAINED.md)**: Detailed breakdown of components and modes.
- **[Deployment & Run Guide](RUN_GUIDE.md)**: Cloudflare tunnel setup and microservice execution.

---

## Repository Structure

```text
geoscout/
├── backend/            # Express.js REST API, MinIO & MongoDB controllers, flood route
├── frontend/           # React 19 / Vite GIS workspace, SVG overlays, bilingual reports
├── inference/          # AI inference services (Qwen3-VL, SAM 3, DistilBERT, OpenCV utils)
├── docs/               # 27-page Dossier (PDF & DOCX), 6 interactive Archify architecture diagrams
├── deployment/         # Docker Compose scripts, Cloudflare tunnel configurations
├── PROJECT_EXPLAINED.md # Plain-English architecture walkthrough
├── RUN_GUIDE.md        # Step-by-step local & tunnel execution guide
└── README.md           # Master project overview
```

---

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Author
**Dhruv Sarin**  
GitHub: [@DhruvSaringit](https://github.com/DhruvSaringit)  
Project: Major Project - GeoScout
