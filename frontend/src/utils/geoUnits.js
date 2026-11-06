/**
 * Spatial Mathematics & Unit Conversions for GeoScout
 * Converts pixel geometries and bounding polygons into real-world geographic metrics.
 */

/**
 * Calculates pixel area of an 8-point polygon or standard bounding box
 */
export function calculatePolygonPixelArea(points) {
  if (!points || points.length < 3) return 0;

  // Shoelace formula for arbitrary polygon
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

/**
 * Converts a bounding box definition into pixel area
 */
export function getBoxPixelArea(box, naturalWidth, naturalHeight) {
  if (!box) return 0;

  // 8-coordinate polygon
  if (Array.isArray(box) && box.length === 8) {
    let [x1, y1, x2, y2, x3, y3, x4, y4] = box;
    // Scale normalized coordinates
    if (x1 <= 1 && y1 <= 1 && x2 <= 1 && y2 <= 1) {
      x1 *= naturalWidth; y1 *= naturalHeight;
      x2 *= naturalWidth; y2 *= naturalHeight;
      x3 *= naturalWidth; y3 *= naturalHeight;
      x4 *= naturalWidth; y4 *= naturalHeight;
    }
    const points = [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
      { x: x3, y: y3 },
      { x: x4, y: y4 }
    ];
    return calculatePolygonPixelArea(points);
  }

  // 5-coordinate oriented bounding box: [cx, cy, w, h, angle]
  if (Array.isArray(box) && box.length === 5) {
    let [, , w, h] = box;
    if (w <= 1 && h <= 1) {
      w *= naturalWidth;
      h *= naturalHeight;
    }
    return w * h;
  }

  // Object structure: { width, height }
  if (typeof box === 'object' && box.width && box.height) {
    let { width, height } = box;
    if (width <= 1 && height <= 1) {
      width *= naturalWidth;
      height *= naturalHeight;
    }
    return width * height;
  }

  return 0;
}

/**
 * Converts pixel area into real-world spatial metrics based on Ground Sample Distance (GSD)
 * @param {number} pixelArea - Total area in pixels
 * @param {number} gsdMetersPerPx - Spatial resolution (meters per pixel, e.g. 0.5)
 * @returns {object} Formatted area metrics
 */
export function convertPixelAreaToRealWorld(pixelArea, gsdMetersPerPx = 0.5) {
  if (!pixelArea || pixelArea <= 0) {
    return {
      squareMeters: 0,
      hectares: 0,
      acres: 0,
      squareKm: 0,
      formattedHa: '0.00 ha',
      formattedAcres: '0.00 ac',
      formattedSqM: '0 m²',
      formattedSqKm: '0.00 km²'
    };
  }

  const effectiveGsd = Math.max(0.01, parseFloat(gsdMetersPerPx) || 0.5);
  const sqMeters = pixelArea * (effectiveGsd * effectiveGsd);
  const hectares = sqMeters / 10000;
  const acres = hectares * 2.47105;
  const squareKm = sqMeters / 1000000;

  return {
    squareMeters: sqMeters,
    hectares: hectares,
    acres: acres,
    squareKm: squareKm,
    formattedHa: hectares < 0.01 ? `${(hectares * 100).toFixed(1)} hundredth ha` : `${hectares.toFixed(2)} ha`,
    formattedAcres: `${acres.toFixed(2)} acres`,
    formattedSqM: sqMeters > 1000 ? `${Math.round(sqMeters).toLocaleString()} m²` : `${sqMeters.toFixed(1)} m²`,
    formattedSqKm: `${squareKm.toFixed(3)} km²`
  };
}

/**
 * Extract or parse numeric count/area from model response text
 */
export function extractMetricsFromText(text = '') {
  if (!text) return null;

  const countMatch = text.match(/(?:found|detected|counted|total of|there are)\s+(\d+)/i) || 
                     text.match(/(\d+)\s+(?:fields?|parcels?|airplanes?|buildings?|objects?|tanks?|ships?)/i);
  
  const areaMatch = text.match(/([\d.,]+)\s*(?:ha|hectares?|acres?|sq\s*km|km2|m2)/i);

  return {
    inferredCount: countMatch ? parseInt(countMatch[1], 10) : null,
    inferredAreaText: areaMatch ? areaMatch[0] : null
  };
}
