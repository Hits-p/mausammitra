
"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { sectorRiskData } from "../app/data/sector-risk";
import { calculateWaterStress } from "../app/data/calculate-risk";

const sectors = [
  { name: "Sector 6", position: [28.592, 77.055] as [number, number] },
  { name: "Sector 7", position: [28.592, 77.065] as [number, number] },
  { name: "Sector 8", position: [28.592, 77.075] as [number, number] },
  { name: "Sector 10", position: [28.578, 77.065] as [number, number] },
  { name: "Sector 11", position: [28.578, 77.055] as [number, number] },
  { name: "Sector 12", position: [28.578, 77.045] as [number, number] },
  { name: "Sector 14", position: [28.568, 77.035] as [number, number] },
  { name: "Sector 21", position: [28.558, 77.035] as [number, number] },
] as const;

type SectorName = (typeof sectors)[number]["name"];

function getRisk(name: SectorName): number | null {
  const data = sectorRiskData[name];

  if (!data) return null;

  const scores: number[] = [];

  if (data.floodSusceptibility !== null) {
    scores.push(data.floodSusceptibility);
  }

  const water = calculateWaterStress(data);

  if (water.score !== null) {
    scores.push(water.score);
  }

  if (scores.length === 0) return null;

  return Math.round(
    scores.reduce((sum, score) => sum + score, 0) / scores.length
  );
}

function getColor(score: number | null) {
  if (score === null) return "#64748b";
  if (score >= 70) return "#ef4444";
  if (score >= 40) return "#f59e0b";
  return "#10b981";
}

function getLabel(score: number | null) {
  if (score === null) return "Data unavailable";
  if (score >= 70) return "High risk";
  if (score >= 40) return "Moderate risk";
  return "Low risk";
}

export default function DelhiRiskMap() {
  const [selected, setSelected] = useState<SectorName>("Sector 10");

  const selectedScore = getRisk(selected);
  const selectedData = sectorRiskData[selected];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Hyperlocal view
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Sector-wise Environmental Risk
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Select a marker or sector to view its risk estimate.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-600">
          <span>🔴 High: 70–100</span>
          <span>🟠 Moderate: 40–69</span>
          <span>🟢 Low: 0–39</span>
        </div>
      </div>

      {/* Real street map */}
      <div
  className="relative z-0 w-full"
  style={{ height: "380px", minHeight: "380px" }}
>
        <MapContainer
          center={[28.578, 77.055]}
          zoom={13}
          scrollWheelZoom={false}
          style={{
  height: "380px",
  minHeight: "380px",
  width: "100%",
  display: "block",
}}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {sectors.map((sector) => {
            const score = getRisk(sector.name);
            const color = getColor(score);
            const active = selected === sector.name;

            return (
              <CircleMarker
                key={sector.name}
                center={sector.position}
                radius={active ? 12 : 9}
                pathOptions={{
                  color: "#ffffff",
                  weight: active ? 4 : 2,
                  fillColor: color,
                  fillOpacity: 0.9,
                }}
                eventHandlers={{
                  click: () => setSelected(sector.name),
                }}
              >
                <Tooltip>
                  <strong>{sector.name}</strong>
                  <br />
                  {score === null ? "Score unavailable" : `Risk score: ${score}/100`}
                  <br />
                  {getLabel(score)}
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Sector selector */}
      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4">
        {sectors.map((sector) => {
          const score = getRisk(sector.name);
          const color = getColor(score);
          const active = selected === sector.name;

          return (
            <button
              key={sector.name}
              type="button"
              onClick={() => setSelected(sector.name)}
              aria-pressed={active}
              className="rounded-xl border p-3 text-left transition hover:shadow-sm"
              style={{
                borderColor: active ? color : "#e2e8f0",
                backgroundColor: active ? `${color}18` : "#ffffff",
                borderWidth: active ? 2 : 1,
              }}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {sector.name}
              </span>

              <span className="mt-2 block text-lg font-bold text-slate-900">
                {score === null ? "—" : `${score}/100`}
              </span>

              <span className="text-xs" style={{ color }}>
                {getLabel(score)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-100 bg-slate-50 p-4">
        <h3 className="font-bold text-slate-900">{selected}</h3>
        <p className="mt-1 text-sm text-slate-600">
          {selectedScore === null
            ? "There is not enough local data to calculate a risk score."
            : `${getLabel(selectedScore)} · Estimated score ${selectedScore}/100`}
        </p>

        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
          <span>
            Water supply: {selectedData?.waterSupplyStatus ?? "Unknown"}
          </span>
          <span>
            Shortage reports: {selectedData?.recentWaterShortageReports ?? "Unknown"}
          </span>
        </div>
      </div>

      <p className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
        Map data © OpenStreetMap contributors. Sector coordinates and risk scores
        are illustrative prototype data, not verified sector boundaries or official warnings.
      </p>
    </section>
  );
}
