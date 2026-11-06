import React, { useState } from 'react';
import { IoSearchOutline, IoWarningOutline, IoCheckmarkCircleOutline, IoAlertCircleOutline } from 'react-icons/io5';

/**
 * Interactive Per-Field Submersion Table
 * Displays crop parcel telemetry, flooded hectare share, and triggers map focus.
 */
export default function FieldSubmersionTable({ 
  fields = [], 
  selectedFieldId, 
  onSelectField 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');

  const filtered = fields.filter((f) => {
    const matchesSearch = f.field_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || f.risk_level === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
            <IoWarningOutline className="text-xs" /> Critical
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
            <IoAlertCircleOutline className="text-xs" /> Moderate
          </span>
        );
      case 'marginal':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <IoAlertCircleOutline className="text-xs" /> Marginal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <IoCheckmarkCircleOutline className="text-xs" /> Intact
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header & Filter Controls */}
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/40">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🌾 Per-Field Agricultural Submersion Table</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono">
              {fields.length} Parcels
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Click any parcel row to highlight and inspect vector boundary on satellite canvas
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <IoSearchOutline className="absolute left-2.5 top-2.5 text-xs text-slate-400" />
            <input
              type="text"
              placeholder="Search ID or crop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs rounded-xl bg-slate-950/80 border border-white/15 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-36 sm:w-44"
            />
          </div>

          {/* Risk Filter */}
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-950/80 border border-white/15 text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="all">All Risks</option>
            <option value="critical">Critical (&gt;60%)</option>
            <option value="moderate">Moderate (20-60%)</option>
            <option value="marginal">Marginal (5-20%)</option>
            <option value="safe">Intact (&lt;5%)</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 bg-slate-950/95 backdrop-blur-md text-slate-400 border-b border-white/10 z-10 font-mono">
            <tr>
              <th className="py-2.5 px-3">Field ID</th>
              <th className="py-2.5 px-3">Parcel Description</th>
              <th className="py-2.5 px-3 text-right">Total (ha)</th>
              <th className="py-2.5 px-3 text-right">Flooded (ha)</th>
              <th className="py-2.5 px-3">Submersion %</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {filtered.map((f) => {
              const isSelected = selectedFieldId === f.field_id;

              return (
                <tr
                  key={f.field_id}
                  onClick={() => onSelectField(f.field_id)}
                  className={`transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 border-l-4 border-cyan-400'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-200">
                    {f.field_id}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-medium">
                    {f.name}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                    {f.area_ha} ha
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-red-300">
                    {f.flooded_ha} ha
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(f.submersion_percent, 100)}%`,
                            backgroundColor: f.color
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-200 w-10 text-right">
                        {f.submersion_percent}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {getRiskBadge(f.risk_level)}
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-500 font-mono">
                  No crop parcels match the active search filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
