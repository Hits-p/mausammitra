
import type { SectorRiskData } from "./sector-risk";

export function calculateFloodRisk(
  rainfallNext24HoursMm: number | null,
  sector: SectorRiskData
) {
  if (rainfallNext24HoursMm === null) {
    return {
      score: null as number | null,
      status: "Insufficient weather data",
    };
  }

  if (sector.floodSusceptibility === null) {
    return {
      score: null as number | null,
      status: "Insufficient local data",
    };
  }

  // Prototype estimate using forecast rainfall and
  // illustrative sector susceptibility data.
  const rainfallScore = Math.min(
    100,
    Math.max(0, rainfallNext24HoursMm)
  );

  const score = Math.round(
    rainfallScore * 0.4 +
      sector.floodSusceptibility * 0.6
  );

  return {
    score,
    status:
      score >= 70
        ? "High"
        : score >= 40
          ? "Moderate"
          : "Low",
  };
}

export function calculateWaterStress(
  sector: SectorRiskData
) {
  if (
    sector.waterSupplyStatus === null &&
    sector.recentWaterShortageReports === null
  ) {
    return {
      score: null as number | null,
      status: "Insufficient local data",
    };
  }

  const supplyScore =
    sector.waterSupplyStatus === "shortage"
      ? 80
      : sector.waterSupplyStatus === "intermittent"
        ? 50
        : sector.waterSupplyStatus === "normal"
          ? 15
          : 0;

  const reportScore = Math.min(
    100,
    (sector.recentWaterShortageReports ?? 0) * 10
  );

  const score = Math.round(
    supplyScore * 0.7 + reportScore * 0.3
  );

  return {
    score,
    status:
      score >= 70
        ? "High"
        : score >= 40
          ? "Moderate"
          : "Low",
  };
}
