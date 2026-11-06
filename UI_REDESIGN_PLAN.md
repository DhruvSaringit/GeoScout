# UI Redesign & Architecture Plan
**Project:** GeoNLI Modern Frontend Re-architecture  
**Focus:** Agriculture-First Satellite Imagery Analysis & General Remote Sensing Intelligence  
**Target:** Major Project Defense, Academic Evaluation & Professional Production-grade UI  
**Author:** Pair Programming Assistant & Frontend Architecture Lead  
**Status:** PROPOSED & READY FOR APPROVAL  

---

## Executive Summary & System Philosophy

This plan details the full frontend redesign of the **GeoNLI** geospatial vision-language system. The current frontend is an early-stage prototype using direct ISRO branding and a monolithic layout. The redesigned frontend transforms this into a modern Earth Observation (EO) intelligence application—inspired by industry standards like **Sentinel Hub EO Browser, Felt, Planet Explorer, and modern AI interfaces (ChatGPT/Claude)**.

### Core Architectural Principles
1. **Zero Backend Regression:** The backend, Python microservices (Qwen VLM, SAM 3, DistilBERT), and API contracts remain untouched unless explicitly approved.
2. **Strict Ground-Truth Integrity:** No model hallucination or simulated results in live mode. Any pre-computed sample mode will be explicitly flagged with an ambient banner: `Demo mode: pre-computed results`.
3. **Domain Modality:** Agriculture is elevated as the primary headline workflow (field extraction, crop parcel area in hectares/acres, yield/damage tracking), while preserving general satellite intelligence (urban infrastructure, maritime tracking, airports, roads, holistic captioning).
4. **Academic Transparency:** Dedicated Credits and Project Heritage documentation detailing the transition from the base Inter-IIT ISRO challenge work to this advanced analytical platform.

---

## 1. Product Naming & Brand Identity (Pending User Selection)

To replace all ISRO branding, logos, and government references, here are **5 short, memorable name options** with rationale and taglines:

| # | Name | Rationale | Tagline |
|---|---|---|---|
| 1 | **TerraLens** | Grounded in Earth (*Terra*) and optics/precision (*Lens*); sounds scientific yet commercial. | *"Natural Language Intelligence for Earth & Agriculture"* |
| 2 | **AgriAcre** (or **AgriOrbit**) | Strongly signals the primary agriculture focus while retaining planetary remote sensing scale. | *"Orbital Precision for Every Field & Acre"* |
| 3 | **GeoScout** | Action-oriented, friendly, memorable, and communicates intelligent surveying and reconnaissance. | *"Conversational Satellite Vision from Crop to City"* |
| 4 | **VerdantAI** | *Verdant* signifies lush agricultural growth and vitality, paired with cutting-edge spatial AI. | *"From Orbit to Harvest: Geospatial Vision Redefined"* |
| 5 | **CanopyIQ** | Evokes the earth canopy (cropland and forests) combined with high-level cognitive reasoning (IQ). | *"Intelligent Field Intelligence from Satellite Imagery"* |

> **Logo Placeholder:** A sleek SVG icon representing an orbital satellite sensor aperture merged with a sprouting agricultural leaf grid (rendered in crisp geometric SVG with Emerald & Electric Indigo gradients).

---

## 2. Two Modes: Architecture & Implementation

The application operates in two distinct operational modes sharing the same core engine, viewer, image upload pipeline, and persistence layer:

### Mode Profiles

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SHARED CORE PLATFORM                            │
│  - Image Upload & MinIO S3 Storage     - Canvas & Vector Overlay Engine│
│  - SSE Streaming Reasoning Parser      - Chat Session History & Auth   │
│  - Qwen VLM + SAM 3 Inference Pipeline - Export Engine (PNG/JSON/PDF)  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌─────────────────────────────────┐ ┌─────────────────────────────────┐
│        AGRICULTURE MODE         │ │          GENERAL MODE           │
│   (Headline / Primary Focus)    │ │    (Comprehensive Satellite)    │
│ • Accent: Emerald / Leaf Green  │ │ • Accent: Cyan / Electric Blue  │
│ • Units: Hectares (ha), Acres   │ │ • Units: Metric (m², km²), Count│
│ • Metric GSD: Resolution calc   │ │ • Objects: Buildings, Runways,  │
│ • Targets: Fields, Canals, Crops│ │   Storage Tanks, Ships, Roads   │
│ • Preset Chips: Cropland Share, │ │ • Preset Chips: Describe Scene, │
│   Count Fields, Crop Health     │ │   Detect Urban, Airport Assets  │
│ • Report: Agronomic Field Memo  │ │ • Report: Geospatial Intelligence│
└─────────────────────────────────┘ └─────────────────────────────────┘
```

### Mode Portrayal & Switcher Proposals

#### Alternative A: Top Navigation Pill Switcher with Dynamic Ambient Accent (RECOMMENDED)
- **Design:** Centered in the top navigation bar is a segmented glassmorphism pill toggle:
  `[ 🌾 Agriculture | 🛰️ General ]` with a subtle badge for future extensions (`+ More`).
- **Visual Feedback:** 
  - Switching to **Agriculture** shifts the application's active primary accent to **Emerald Green** (`#10b981`), switches the suggested chip marquee to agricultural queries, updates empty-state illustrations to farm field contours, and defaults spatial calculations to **Hectares (ha) and Acres**.
  - Switching to **General** shifts the accent to **Electric Cyan/Blue** (`#0ea5e9`), loads urban/maritime sample chips, and defaults units to **m² / km²**.
- **Result & Export Badging:** Every result card and exported PDF/PNG displays an ambient badge in the corner: `MODE: AGRICULTURE (GSD: 0.5m/px)` or `MODE: GENERAL`.
- **Extensibility:** The mode configuration schema is written as an extensible registry (`ModeConfig`), allowing future modes like `Disaster Response` (Crimson `#ef4444`) or `Urban Planning` (Amber `#f59e0b`) to be registered by adding a single config file.

#### Alternative B: Left Workspace Mode Rail
- A vertical rail on the far left with large icon tabs for `Agriculture`, `General Infrastructure`, `Disaster Assessment` (disabled placeholder).
- *Downside:* Consumes horizontal screen real estate which is critical for side-by-side map inspection and chat cards.

#### Alternative C: Contextual Dropdown in Chat Query Bar
- The mode switcher resides inside the prompt input bar, acting as a "Prompt Persona".
- *Downside:* Disconnects the viewer presets (resolution, overlays) from the top-level application state.

**Recommendation:** **Alternative A** offers the highest visual clarity, maintains immediate user awareness, and makes switching instantaneous without cognitive overload.

---

## 3. Step 1: Frontend Codebase Analysis (Read-Only Audit)

### 3.1 Tech Stack & Dependencies
- **Core Framework:** React 19.2.0 with React DOM 19.2.0.
- **Build Tool:** Vite 7.2.2 with `@vitejs/plugin-react` and `babel-plugin-react-compiler`.
- **Styling:** TailwindCSS 4.1.17 via `@tailwindcss/vite`.
- **Routing:** React Router DOM 7.9.5 (`createBrowserRouter` / `RouterProvider`).
- **Icons:** React Icons 5.5.0 (`react-icons/io5`, `react-icons/ri`, `react-icons/bi`, `react-icons/ai`, `react-icons/hi2`).
- **HTTP Client:** Axios 1.13.2 with `withCredentials: true` for HTTP-only cookies.

### 3.2 Current Folder Structure
```
frontend/
├── index.html                 # Contains hardcoded ISRO logo favicon & "GeoNLI" title
├── package.json
├── src/
│   ├── assets/                # isro_logo.png, earth_image_2.jpg/png, react.svg
│   ├── components/
│   │   ├── ChatWindow.jsx     # Monolithic 998-line component handling image, SVG, chat & input
│   │   ├── ImageUpload.jsx    # Drag and drop upload zone
│   │   ├── ParticleBackground.jsx # Canvas particle effect for Auth screen
│   │   ├── ProtectedRoute.jsx # Admin route guard
│   │   ├── ShareModal.jsx     # Share link generator with view/edit options
│   │   └── chat/              # 11 sub-components (Sidebar, ChatList, UserMenu, etc.)
│   ├── context/
│   │   └── AuthContext.jsx    # Session state, user data, login/logout actions
│   ├── pages/
│   │   ├── AdminDashboard.jsx # Whitelist management & user role administration
│   │   ├── Auth.jsx           # Tabbed login/signup screen with ISRO logo
│   │   ├── Login.jsx / Signup.jsx
│   │   ├── MainChat.jsx       # 621-line orchestrator for upload, SSE streaming, and chat
│   │   ├── SharedChat.jsx     # Public read/write shared chat view
│   │   └── StreamChat.jsx     # Experimental streaming test page
│   └── services/
│       └── api.js             # Centralized Axios API client and SSE factory
```

### 3.3 Backend API Routes & Request/Response Contracts

| Endpoint | Method | Params / Payload | Expected Response |
|---|---|---|---|
| `/api/chat` | `POST` | `multipart/form-data`: `image` (File) | `{ chat_id: string, message: string }` |
| `/api/chat/:id` | `GET` | Route param `id` | `{ chat: { _id, user, image_key, chats: [...] }, image_url: string }` |
| `/api/chat/sidebar` | `GET` | Cookie Auth | `Array<{ _id, description, createdAt, updatedAt }>` |
| `/api/chat/describe/:id` | `GET` | Route param `id` | `{ message: string, description: string }` |
| `/api/classify` | `POST` | `{ query: string, image_url: string }` | `{ category: "captioning" | "grounding" | "vqa_numeric" | "vqa_binary" | "vqa_semantic", transformed_query: string }` |
| `/api/chat/completion` | `GET` | Query params: `chat_id`, `query`, `category`, `transformed_query` | `{ response: string, bounding_boxes: Array, response_time: string, task_type: string }` |
| `/api/chat/completion_stream` | `GET` | Query params: `chat_id`, `query`, `category` (SSE) | Server-Sent Events: `reasoning` chunk, `solution` chunk, `end` `{ response_time, bounding_boxes }`, `error` |
| `/api/chat/update-times/:id`| `PUT` | `{ message_index: number, response_time: number, reasoning_time: number }` | `{ message: string }` |
| `/api/chat/share/:id` | `POST` | `{ permission: 'view' | 'edit' }` | `{ shareToken: string, permission: string }` |
| `/api/chat/shared/:token` | `GET` | Route param `token` | `{ chat: Object, image_url: string, permission: string }` |

### 3.4 Key Limitations in Current Codebase
1. **Monolithic Components:** `ChatWindow.jsx` (998 lines) and `MainChat.jsx` (621 lines) tightly couple image rendering, mouse events, SVG geometry, chat scrolling, input handling, and network requests. Any UI enhancement risks regressions without modularization.
2. **Missing Landing Page:** The root URL `/` directs to the Auth page (`Auth.jsx`). A new visitor sees a login box instead of a modern product showcase.
3. **Hardcoded Branding:** ISRO logo PNG files and text are embedded in `SidebarHeader.jsx`, `Auth.jsx`, `Login.jsx`, `Signup.jsx`, and `index.html`.
4. **Bounding Box Data Model:** SAM 3 and Qwen currently output oriented bounding boxes (8-coordinate polygons `[x1,y1, x2,y2, x3,y3, x4,y4]` or 5-coordinate boxes `[cx, cy, w, h, angle]`). There are no raster mask overlays, opacity sliders, or object-level toggles in the frontend.
5. **No Ground Sample Distance (GSD) / Unit Configuration:** The backend accepts an optional `resolution` parameter, but the frontend hardcodes `NaN` or ignores it. Converting raw pixel areas to hectares, acres, or square meters requires an interactive GSD input in the UI.

---

## 4. Step 2: Modern Design Proposal & UX Specification

### 4.1 Aesthetic Design System

Inspired by **Sentinel Hub EO Browser, Felt.com, Planet Labs, and modern AI workspaces (Perplexity, ChatGPT)**:

- **Theme & Mode Palettes:**
  - **Dark Mode (Default & Primary for Geospatial Imagery):**
    - Workspace Canvas: `#0c0f17` (Deep EO Navy-Black)
    - Panels & Cards: `#131826` / `#1a2035` (Translucent Slate Glassmorphism with `backdrop-blur-md`)
    - Borders: `rgba(255, 255, 255, 0.08)`
    - Typography: Text Primary `#f8fafc`, Muted `#94a3b8`
  - **Light Mode (Clean Research / Document Style):**
    - Workspace Canvas: `#f8fafc` (Ultra-light Slate)
    - Panels & Cards: `#ffffff` with subtle elevation shadow `box-shadow: 0 4px 20px -2px rgba(0,0,0,0.06)`
    - Borders: `#e2e8f0`
  - **Accent Colors (Dynamic by Mode):**
    - **Agriculture Mode:** Emerald Green `#10b981` (Glow: `rgba(16, 185, 129, 0.25)`)
    - **General Mode:** Electric Cyan `#0ea5e9` (Glow: `rgba(14, 165, 233, 0.25)`)
    - **Warning / GPU Down:** Amber `#f59e0b` & Coral Red `#ef4444`
- **Typography:**
  - Modern sans-serif: `Plus Jakarta Sans` or `Inter` for interface elements and metrics.
  - Monospace: `JetBrains Mono` or `Fira Code` for coordinates, GSD resolution, and polygon dimensions.
- **Interactive Component Styling:**
  - Glassmorphic floating toolbars over the image canvas.
  - Segmented controls with spring transitions.
  - Micro-animations for thinking monologues, pulse indicators for model reasoning, and smooth SVG hover states.

---

### 4.2 Application Layout Architecture

A dual-pane cockpit layout built for high-density analysis on laptop/desktop and collapsible tabbed navigation on mobile:

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [Brand Logo + Name]  │  Mode Switcher: [ 🌾 Agriculture | 🛰️ General ]  │  Credits  │ Lang: EN │ [User]│
├────────────────────────────────────────────────────────┬──────────────────────────────────────────────┤
│ LEFT PANEL: SATELLITE CANVAS & SPATIAL CONTROLS (60%) │ RIGHT PANEL: CONVERSATIONAL INTELLIGENCE (40%)│
│                                                        │                                              │
│ ┌────────────────────────────────────────────────────┐ │ ┌──────────────────────────────────────────┐ │
│ │ Top Canvas Toolbar:                                │ │ │ Chat Header: Active Image Title & Mode   │ │
│ │ [Zoom + - Fit] [Layer Toggle] [Opacity] [Compare]  │ │ │ Share Chat | Export Report [PNG/JSON/PDF]│ │
│ ├────────────────────────────────────────────────────┤ │ ├──────────────────────────────────────────┤ │
│ │                                                    │ │ │ Structured Result Stream:                │ │
│ │                  MAIN IMAGE VIEW                   │ │ │                                          │ │
│ │           (Pan, Zoom, SVG Vector Boxes,            │ │ │ [User Query Card]                        │ │
│ │              Masks, Hover Highlights)              │ │ │   "Calculate cropland area & count fields"│ │
│ │                                                    │ │ │                                          │ │
│ │                                                    │ │ │ [Pipeline Progress Stage: Segmentation]  │ │
│ │                                                    │ │ │                                          │ │
│ │                                                    │ │ │ [AI Result Card: Structured Metrics]     │ │
│ │                                                    │ │ │   • Fields Detected: 14 parcels          │ │
│ │                                                    │ │ │   • Cropland Area: 34.8 ha (86.0 acres)  │ │
│ │                                                    │ │ │   • Confidence: High (Verified vs Mask)  │ │
│ │                                                    │ │ │   [Per-object parcel list with toggles]  │ │
│ ├────────────────────────────────────────────────────┤ │ ├──────────────────────────────────────────┤ │
│ │ Bottom Canvas Bar:                                 │ │ │ Suggested Query Chips (Mode-specific):   │ │
│ │ Resolution GSD: [ 0.5 ] m/px  | Size: 1024x1024 px │ │ │ [🌾 Count fields] [📐 Cropland ha] [🔎]   │ │
│ │ Coordinates Overlay: Lat/Lon or X/Y Pixel          │ │ ├──────────────────────────────────────────┤ │
│ └────────────────────────────────────────────────────┘ │ │ Input Box: "Ask anything about this image"│ │
│                                                        │ │ [🎙️ Voice] [📎 Upload]              [Send]│ │
└────────────────────────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

### 4.3 Key Feature Specifications

1. **Interactive Image & Map Workspace (Left):**
   - **Pan & Zoom:** Smooth wheel zoom up to 10x with smooth boundary constraint and 1:1 pixel reset button.
   - **Vector Mask & Box Overlays:** High-precision SVG polygons with customizable opacity slider (0% to 100%).
   - **Per-Object Toggle List:** A floating overlay panel listing detected parcels or structures (e.g., *Field #1: 4.2 ha, Field #2: 8.1 ha*) with visibility eye toggles.
   - **Before/After Split Slider:** Compare original satellite image against segmented vector overlays with an interactive vertical drag divider.
   - **Bidirectional Focus Highlighting:** Hovering over or clicking a result card highlights the corresponding bounding box/polygon on the canvas with a glowing border; clicking an object on the canvas scrolls to and highlights its result card.

2. **Conversational Intelligence Panel (Right):**
   - **Mode-Specific Suggested Chips:** 
     - *Agriculture:* `"Count the agricultural fields"`, `"Total cropland area in hectares"`, `"Locate irrigation canals"`, `"Segment farm plots"`.
     - *General:* `"Describe the satellite scene"`, `"Count airplanes and hangars"`, `"Locate storage tanks"`, `"Measure runway length"`.
   - **Pipeline Progress Stepper:** Visual stages displaying active inference state:
     `Intent Classification` $\rightarrow$ `VLM Reasoning` $\rightarrow$ `SAM Segmentation` $\rightarrow$ `Spatial Measurement`.
   - **Structured Metric Cards:** Specialized cards for numerical responses with real-world unit conversions:
     - Area: Square meters ($m^2$), Hectares ($ha$), Acres ($ac$).
     - Length: Meters ($m$), Kilometers ($km$).
     - Count: Integer entity count with object badge list.
   - **Ground Sample Distance (GSD) Estimator:** A clean input field in the toolbar allowing the analyst to enter the image resolution (e.g., `0.5` meters/pixel for Cartosat, `10.0` m/pixel for Sentinel-2). When entered, pixel metrics dynamically recompute into metric hectares/acres.
   - **Confidence & Cross-Verification Badge:** Visual verification badge indicating consistency between the Qwen VLM textual count and the SAM 3 mask-derived count (e.g., `Verified: 14 masks match VLM count`).

3. **Multi-Format Export Engine:**
   - **PNG:** High-resolution burn-in canvas export with vector overlays and scale bar.
   - **JSON:** Complete machine-readable session dump (query, reasoning logs, response times, normalized bounding boxes).
   - **GeoJSON:** Geospatial feature collection representing detected polygons with properties (area, class, confidence).
   - **PDF Report:** Professional multi-page analytical report containing:
     - Header with image thumbnail, timestamp, session ID, active mode badge.
     - Cropland/Object statistics summary table.
     - Full conversational transcript and reasoning breakdown.

4. **Landing Page & Navigation:**
   - **Hero Section:** Bold headline showcasing the product (*"Next-Generation Geospatial Vision for Earth & Agriculture"*), live interactive before/after image demo widget, and a direct `"Launch Workspace (Guest or Sign In)"` CTA.
   - **Feature Showcase:** Grid highlighting zero-shot segmentation, natural language measurements, multi-spectral field analysis, and privacy-first local GPU processing.
   - **Credits & Heritage Page (`/credits` or `/about`):** Explicitly honors the original research paper and the Inter-IIT Tech Meet ISRO competition team as the baseline foundation, while documenting the new agricultural workflow engine, metric calculation suite, export generator, and modular UI layer.
   - **Sample Image Gallery:** Instant-load presets with separate tabs:
     - *Agriculture:* Punjab Wheat Fields, Andhra Rice Paddies, California Vineyards.
     - *General:* Delhi International Airport, Mumbai Port Container Terminal, Solar Farm.

5. **Resilience, Accessibility & Internationalization:**
   - **GPU Health Monitor:** Ambient top banner warning if backend endpoints or GPU microservices are unreachable, preventing silent UI hangs.
   - **Language Switcher:** English active; Hindi interface locale scaffolding prepared via structured JSON dictionary.
   - **Voice Input Placeholder:** Mic button with tooltip indicating conversational speech-to-text integration.

---

## 5. Step 3: Phased Implementation Roadmap

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Modern Shell, Landing Page, Core Components & API Parity       │
│ Est: 3 - 4 Days | Focus: Brand overhaul, layout, Landing, clean API   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│ PHASE 2: Advanced Map & Image Viewer Workspace                         │
│ Est: 3 Days | Focus: Opacity slider, before/after, bidirectional link   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│ PHASE 3: Domain Mode System & Agriculture Workflow                     │
│ Est: 2 - 3 Days | Focus: Hectare/Acre calculator, sample gallery, PDF   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│ PHASE 4: Accessibility, Language Scaffolding & Voice Integration       │
│ Est: 1 - 2 Days | Focus: Keyboard nav, Hindi locale dict, Voice UI     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│ PHASE 5: Demo / Replay Mode, Polish, and Academic Defense Prep         │
│ Est: 2 Days | Focus: Pre-computed demo mode, credits page, live polish │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 1: Redesigned UI Shell, Landing Page, Upload, Viewer, Chat Panel
- **Objective:** Replace ISRO branding, build the modern responsive split-screen shell, create the public Landing page, modularize `ChatWindow.jsx`, and ensure 100% parity with existing API endpoints.
- **Files to Create / Modify:**
  - `src/config/brand.js`: Placeholder branding configuration (app name, logo SVG, taglines).
  - `src/pages/LandingPage.jsx`: Public landing page with hero, interactive comparison, feature grid, and "Try it" button.
  - `src/components/navigation/Navbar.jsx`: Universal top navigation with brand logo, mode toggle, theme switcher, and user profile.
  - `src/components/workspace/WorkspaceLayout.jsx`: Split-view workspace container replacing monolithic `ChatWindow.jsx`.
  - `src/components/workspace/ImageViewer.jsx`: Dedicated image canvas handling pan, zoom, and vector overlays.
  - `src/components/workspace/ChatPanel.jsx`: Chat stream, reasoning accordion, and input box.
  - `src/pages/MainChat.jsx`: Updated to utilize the new modular components.
  - `src/App.jsx`: Updated route definitions (`/` -> `LandingPage`, `/workspace` or `/chat` -> `MainChat`).
  - `index.html`: Remove ISRO favicon and title, inject modern typography and clean title.
- **Risk / What Could Break:** 
  - SSE streaming event listeners disconnecting during component remounts.
  - CSS layout height clipping in nested flex containers.
- **Testing Plan:**
  - Verify image upload triggers `/api/chat` and returns valid `chat_id`.
  - Verify SSE streaming prints reasoning monologue and final solution without missing text.
  - Test authentication redirects and guest access flow.
- **Backend Changes Needed:** None.

---

### Phase 2: Map & Overlay Features, History, Multi-Format Exports
- **Objective:** Build professional GIS/EO inspection tools: mask opacity slider, before/after split slider, bidirectional card/polygon highlighting, and full export capabilities (PNG, JSON, GeoJSON, PDF).
- **Files to Create / Modify:**
  - `src/components/workspace/OverlayControls.jsx`: Floating toolbar for zoom, opacity slider, before/after compare toggle.
  - `src/components/workspace/ObjectListOverlay.jsx`: Collapsible drawer listing detected targets with visibility toggles.
  - `src/utils/exportHelpers.js`: PNG canvas stitcher, JSON export, GeoJSON polygon generator, and PDF report builder (using browser print styles / clean HTML-to-PDF).
  - `src/components/workspace/ExportModal.jsx`: Modal to select export formats and preview download.
  - `src/components/chat/Sidebar.jsx`: Enhanced session history with thumbnail previews and search filter.
- **Risk / What Could Break:**
  - Canvas cross-origin tainting when exporting images from MinIO S3 without proper CORS headers.
  - SVG polygon scaling mismatch when panning/zooming.
- **Testing Plan:**
  - Upload test image, run grounding query (`"locate the airplanes"`), test opacity slider from 0% to 100%.
  - Verify clicking polygon #1 scrolls chat to card #1 and vice-versa.
  - Download PNG and verify vector boxes are correctly drawn on the full-resolution image.
- **Backend Changes Needed:**
  - *Optional (No change required for Phase 2):* MinIO S3 CORS policy must allow canvas `toBlob()` / `getImageData()` access.

---

### Phase 3: Mode System & Agriculture Workflow
- **Objective:** Implement the Agriculture vs General mode architecture, metric unit conversions (hectares, acres), GSD resolution input, and agriculture sample presets.
- **Files to Create / Modify:**
  - `src/config/modes.js`: Configuration object defining presets, accent colors, units, and suggested chips for Agriculture and General modes.
  - `src/context/ModeContext.jsx`: Global provider for the active mode state.
  - `src/components/navigation/ModeSwitcher.jsx`: Segmented pill switch component in the top navbar.
  - `src/components/workspace/MetricResolutionInput.jsx`: Ground Sample Distance (GSD) input component (m/px).
  - `src/utils/geoUnits.js`: Pure functions calculating metric surface area:
    $$\text{Area (ha)} = \frac{\text{pixel count} \times (\text{GSD})^2}{10,000}$$
    $$\text{Area (acres)} = \text{Area (ha)} \times 2.47105$$
  - `src/components/workspace/ResultCard.jsx`: Specialized result cards displaying unit pills, parcel counts, and confidence badge.
  - `src/components/workspace/SampleGalleryModal.jsx`: Preloaded sample satellite imagery (farmlands, urban centers, ports) for instant zero-friction testing.
- **Risk / What Could Break:**
  - Parsing errors if model response text does not match expected numeric patterns.
- **Testing Plan:**
  - Switch to Agriculture mode: Verify emerald accent, agricultural suggested chips, and hectare default units.
  - Input GSD `0.5 m/px`, run area query, and verify mathematical accuracy of hectare conversion.
- **Backend Changes Needed:**
  - *Recommendation (Waiting for Approval):* Backend currently passes `resolution: NaN` to inference. Allowing the frontend to pass `resolution` as a query param to `GET /chat/completion?resolution=0.5` would enable the Python SAM 3 pipeline to compute metric area server-side as well. (Frontend can compute it independently from masks/boxes if backend is unchanged).

---

### Phase 4: Hindi Language Support Scaffolding & Voice Input
- **Objective:** Add accessibility enhancements, internationalization framework (English active, Hindi locale dictionary), and a voice input mic component.
- **Files to Create / Modify:**
  - `src/locales/en.json` & `src/locales/hi.json`: Translation dictionaries for all UI text, mode descriptions, and tooltips.
  - `src/context/LanguageContext.jsx`: Language selection provider.
  - `src/components/workspace/VoiceInputButton.jsx`: Microphone button with browser SpeechRecognition API integration (with fallback to placeholder modal if unsupported).
  - `src/components/accessibility/SkipToContent.jsx`: Screen-reader and keyboard accessibility helpers.
- **Risk / What Could Break:**
  - Web Speech API browser compatibility differences between Chrome, Firefox, and Edge.
- **Testing Plan:**
  - Toggle language to Hindi: Check that navigation, chip suggestions, and button labels update seamlessly.
  - Test keyboard navigation (Tab / Shift-Tab) across image toolbar and chat inputs.
- **Backend Changes Needed:** None.

---

### Phase 5: Demo / Replay Mode, About Page & Presentation Polish
- **Objective:** Implement a transparent, clearly labeled pre-computed Demo Mode for flawless viva/evaluation demonstrations, build the Credits page honoring the base paper, and finalize visual polish.
- **Files to Create / Modify:**
  - `src/demo_outputs/`: Curated directory of pre-computed inference results (Agriculture parcel segmentation, urban building counts, high-resolution reasoning chains).
  - `src/components/workspace/DemoModeBanner.jsx`: Persistent amber notice: `⚡ Demo mode: displaying pre-computed results. Real API calls remain active in Live Mode.`
  - `src/pages/AboutCredits.jsx`: Academic credits page detailing:
    - Base Research: GeoNLI paper and Inter-IIT ISRO Tech Meet team.
    - New Additions: Agriculture-first analytical engine, metric conversion suite, dual-mode EO architecture, modern interactive GIS canvas, and multi-format reporting.
  - Complete cross-browser visual QA and responsive testing.
- **Risk / What Could Break:**
  - Confusion between demo results and live results (mitigated by strict visual watermarking and explicit toggle).
- **Testing Plan:**
  - Load demo dataset without backend running: Verify entire UI showcases all capabilities smoothly.
  - Toggle to Live Mode: Verify application connects to live backend and models.
  - Inspect `/about` page for complete attribution.
- **Backend Changes Needed:** None.

---

## 6. Detailed Backend & API Consideration List (For User Approval)

The entire redesign will proceed **strictly on the frontend** without altering backend code. However, the following optional backend enhancements would maximize capabilities if approved:

1. **Pass Resolution Parameter to Completion:**
   - *Current Status:* `backend/controllers/chat.js` passes `category, NaN, transformed_query` to `inference()`.
   - *Proposed Enhancement:* Accept `resolution` query parameter from the frontend and pass it into `inference()`. SAM 3 already supports metric calculation if resolution is provided.
2. **Explicit Bounding Box & Polygon Flagging:**
   - *Current Status:* Backend returns `bounding_boxes` array (either 8 points or 5 points).
   - *Proposed Enhancement:* Return explicit format type tag `{ format: "polygon_8" | "obb_5" | "rle_mask", coordinates: [...] }` to simplify frontend rendering.
3. **Health Check Endpoint:**
   - *Current Status:* Frontend determines failure only when an active request times out or returns 500.
   - *Proposed Enhancement:* Add lightweight `GET /api/health` returning GPU model status (`qwen: online`, `sam3: online`, `minio: online`).

---

## 7. Open Questions for User Approval

Before writing the implementation code, please review and answer the following:

1. **Product Name Selection:** Which of the 5 proposed names do you prefer?
   - `TerraLens`
   - `AgriAcre` (or `AgriOrbit`)
   - `GeoScout`
   - `VerdantAI`
   - `CanopyIQ`
   *(Or would you like to provide a custom name?)*
2. **Landing Page Route Preference:**
   - Option 1 (Recommended): Root `/` opens the new Landing Page with a "Try Live Demo / Open Workspace" button that directs to `/workspace`.
   - Option 2: Root `/` goes straight into the workspace `/chat` with a top-bar link to `/about` and `/credits`.
3. **Mode Switcher Default:**
   - Should the application default to **Agriculture Mode** upon first load, or prompt the user on the landing page?
4. **Backend Changes:**
   - Do you approve keeping backend changes strictly for a later phase (proceeding 100% frontend now), or should we update the `resolution` query parameter immediately?
