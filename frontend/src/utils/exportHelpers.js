import { convertPixelAreaToRealWorld, calculatePolygonPixelArea } from './geoUnits';

/**
 * Spatial Export Utilities for GeoScout
 * Generates Annotated PNGs, GeoJSON FeatureCollections, Session JSON, and PDF Reports.
 */

/**
 * Downloads a text or JSON blob
 */
export function downloadFile(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports raw session metadata to machine-readable JSON
 */
export function exportSessionJson({ chatId, mode, gsd, chatTitle, chatHistory }) {
  const exportPayload = {
    application: "GeoScout",
    version: "2.4.0",
    exportTimestamp: new Date().toISOString(),
    session: {
      chatId,
      chatTitle,
      mode,
      sensorGsd: `${gsd} m/px`,
      totalQueries: chatHistory.length,
      history: chatHistory.map((item, idx) => ({
        index: idx + 1,
        query: item.query,
        category: item.task_type || 'unclassified',
        response: item.response,
        reasoning: item.reasoning,
        responseTime: item.response_time,
        reasoningTime: item.reasoning_time,
        timestamp: item.timestamp,
        boundingGeometries: item.bounding_boxes || []
      }))
    }
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  downloadFile(jsonStr, `geoscout_${mode}_${chatId || 'session'}_${Date.now()}.json`, 'application/json');
}

/**
 * Exports detected polygon geometries to standard GeoJSON FeatureCollection
 */
export function exportToGeoJson({ chatId, mode, gsd, boxes = [], naturalWidth = 1000, naturalHeight = 1000 }) {
  const features = boxes.map((box, idx) => {
    let coordinates = [];
    let pixelArea = 0;

    if (Array.isArray(box) && box.length === 8) {
      let [x1, y1, x2, y2, x3, y3, x4, y4] = box;
      if (x1 <= 1 && y1 <= 1) {
        x1 *= naturalWidth; y1 *= naturalHeight;
        x2 *= naturalWidth; y2 *= naturalHeight;
        x3 *= naturalWidth; y3 *= naturalHeight;
        x4 *= naturalWidth; y4 *= naturalHeight;
      }
      coordinates = [
        [ [x1, y1], [x2, y2], [x3, y3], [x4, y4], [x1, y1] ]
      ];
      pixelArea = calculatePolygonPixelArea([
        { x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }, { x: x4, y: y4 }
      ]);
    } else if (Array.isArray(box) && box.length === 5) {
      let [cx, cy, w, h] = box;
      if (cx <= 1 && cy <= 1) {
        cx *= naturalWidth; cy *= naturalHeight;
        w *= naturalWidth; h *= naturalHeight;
      }
      const x1 = cx - w / 2, y1 = cy - h / 2;
      const x2 = cx + w / 2, y2 = cy + h / 2;
      coordinates = [
        [ [x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1] ]
      ];
      pixelArea = w * h;
    }

    const realWorld = convertPixelAreaToRealWorld(pixelArea, gsd);

    return {
      type: "Feature",
      id: `parcel_${idx + 1}`,
      properties: {
        index: idx + 1,
        mode,
        label: mode === 'agriculture' ? `Crop Parcel #${idx + 1}` : `Target #${idx + 1}`,
        area_ha: parseFloat(realWorld.hectares.toFixed(3)),
        area_acres: parseFloat(realWorld.acres.toFixed(3)),
        area_sqm: Math.round(realWorld.squareMeters),
        gsd_m_per_px: gsd
      },
      geometry: {
        type: "Polygon",
        coordinates: coordinates.length ? coordinates : [[[0,0],[1,0],[1,1],[0,1],[0,0]]]
      }
    };
  });

  const geoJson = {
    type: "FeatureCollection",
    properties: {
      generatedBy: "GeoScout Earth Observation AI",
      sessionChatId: chatId || "guest_session",
      mode,
      gsd,
      timestamp: new Date().toISOString()
    },
    features
  };

  downloadFile(JSON.stringify(geoJson, null, 2), `geoscout_${mode}_polygons_${Date.now()}.geojson`, 'application/geo+json');
}

/**
 * Burn-in High-Res PNG with Vector Polygons and Metadata Stamp
 */
export async function exportAnnotatedImage({ imageElement, boxes = [], mode, gsd, naturalWidth, naturalHeight }) {
  if (!imageElement) return;

  const canvas = document.createElement('canvas');
  const w = naturalWidth || imageElement.naturalWidth || 1200;
  const h = naturalHeight || imageElement.naturalHeight || 800;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Draw satellite base image
  try {
    ctx.drawImage(imageElement, 0, 0, w, h);
  } catch (err) {
    console.warn('Canvas direct drawImage failed (likely cross-origin), attempting fallback', err);
  }

  // Draw overlay vector polygons
  const strokeColor = mode === 'agriculture' ? '#10b981' : '#0ea5e9';
  const fillColor = mode === 'agriculture' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(14, 165, 233, 0.25)';

  ctx.lineWidth = Math.max(2, Math.round(w / 400));
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;

  boxes.forEach((box, i) => {
    if (Array.isArray(box) && box.length === 8) {
      let [x1, y1, x2, y2, x3, y3, x4, y4] = box;
      if (x1 <= 1) {
        x1 *= w; y1 *= h; x2 *= w; y2 *= h; x3 *= w; y3 *= h; x4 *= w; y4 *= h;
      }
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Label pin
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(12, Math.round(w / 80))}px sans-serif`;
      ctx.fillText(`#${i + 1}`, x1 + 4, y1 - 4);
      ctx.fillStyle = fillColor;
    }
  });

  // Telemetry lower banner
  const bannerHeight = Math.max(36, Math.round(h * 0.05));
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(0, h - bannerHeight, w, bannerHeight);

  ctx.fillStyle = strokeColor;
  ctx.font = `bold ${Math.max(12, Math.round(bannerHeight * 0.45))}px sans-serif`;
  ctx.fillText(`GEOSCOUT EO PLATFORM  |  MODE: ${mode.toUpperCase()}  |  GSD: ${gsd} m/px  |  TARGETS: ${boxes.length}`, 16, h - (bannerHeight * 0.35));

  // Trigger download
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `geoscout_${mode}_annotated_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error('Export PNG failed (likely CORS on external image):', err);
    alert('Could not export annotated canvas directly due to image domain security. You can export GeoJSON or JSON metadata instead.');
  }
}

/**
 * Printable Executive Report Generator
 */
export function printExecutiveReport({ mode, gsd, chatTitle, chatHistory, imageUrl }) {
  const reportWindow = window.open('', '_blank');
  if (!reportWindow) return;

  const modeBadge = mode.toUpperCase();
  const accentColor = mode === 'agriculture' ? '#10b981' : '#0ea5e9';

  const historyHtml = chatHistory.map((item, idx) => `
    <div style="margin-bottom: 24px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc;">
      <div style="font-weight: 700; color: #0f172a; margin-bottom: 8px;">Query #${idx + 1}: ${item.query}</div>
      <div style="color: #334155; line-height: 1.6; margin-bottom: 12px;"><strong>Finding:</strong> ${item.response}</div>
      ${item.reasoning ? `<div style="background: #ffffff; padding: 12px; border-radius: 6px; font-size: 13px; color: #64748b; font-family: monospace; white-space: pre-wrap;"><strong>Model Reasoning:</strong>\n${item.reasoning}</div>` : ''}
      <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">Response Time: ${item.response_time || 'N/A'} | Geometries: ${(item.bounding_boxes || []).length} objects</div>
    </div>
  `).join('');

  reportWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>GeoScout Analysis Report - ${chatTitle || 'Session'}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 900px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${accentColor}; padding-bottom: 20px; margin-bottom: 30px; }
          .badge { background: ${accentColor}; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; }
          .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 30px; background: #f1f5f9; padding: 16px; border-radius: 8px; }
          @media print { body { padding: 0; } button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 style="margin: 0; font-size: 26px;">GeoScout Executive Intelligence Memo</h1>
            <div style="color: #64748b; margin-top: 4px;">Conversational Satellite Vision & Earth Observation Report</div>
          </div>
          <span class="badge">MODE: ${modeBadge}</span>
        </div>

        <div class="meta-grid">
          <div><strong>Session:</strong> ${chatTitle || 'Geospatial Inspection'}</div>
          <div><strong>Calibrated GSD:</strong> ${gsd} meters/pixel</div>
          <div><strong>Generated:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
        </div>

        ${imageUrl ? `<div style="text-align: center; margin-bottom: 24px;"><img src="${imageUrl}" style="max-height: 240px; border-radius: 8px; border: 1px solid #cbd5e1;" alt="Satellite Target Scene" /></div>` : ''}

        <h3>Inference Transcript & Spatial Telemetry</h3>
        ${historyHtml}

        <div style="margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 16px; font-size: 11px; color: #94a3b8; text-align: center;">
          GeoScout Spatial Intelligence Suite • Multi-Modal Remote Sensing & GIS Telemetry Platform.
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);
  reportWindow.document.close();
}
