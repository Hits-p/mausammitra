
export type SectorRiskData = {
  sector: string;

  drainageCondition: "good" | "moderate" | "poor" | null;
  historicalWaterlogging: "none" | "occasional" | "frequent" | null;
  floodSusceptibility: number | null;

  groundwaterDepthM: number | null;
  groundwaterObservedAt: string | null;
  waterSupplyStatus: "normal" | "intermittent" | "shortage" | null;
  recentWaterShortageReports: number | null;

  source: string | null;
  lastVerifiedAt: string | null;
  demoMode: boolean;
};

export const sectorRiskData: Record<string, SectorRiskData> = {
  "Sector 6": {
    sector: "Sector 6",
    drainageCondition: "good",
    historicalWaterlogging: "none",
    floodSusceptibility: 20,
    groundwaterDepthM: null,
    groundwaterObservedAt: null,
    waterSupplyStatus: "normal",
    recentWaterShortageReports: 1,
    source: "Illustrative demo data",
    lastVerifiedAt: null,
    demoMode: true,
  },

  "Sector 7": {
    sector: "Sector 7",
    drainageCondition: "moderate",
    historicalWaterlogging: "occasional",
    floodSusceptibility: 45,
    groundwaterDepthM: null,
    groundwaterObservedAt: null,
    waterSupplyStatus: "intermittent",
    recentWaterShortageReports: 3,
    source: "Illustrative demo data",
    lastVerifiedAt: null,
    demoMode: true,
  },

  "Sector 8": {
    sector: "Sector 8",
    drainageCondition: "poor",
    historicalWaterlogging: "frequent",
    floodSusceptibility: 75,
    groundwaterDepthM: null,
    groundwaterObservedAt: null,
    waterSupplyStatus: "shortage",
    recentWaterShortageReports: 6,
    source: "Illustrative demo data",
    lastVerifiedAt: null,
    demoMode: true,
  },

  "Sector 10": {
    sector: "Sector 10",
    drainageCondition: "moderate",
    historicalWaterlogging: "occasional",
    floodSusceptibility: 50,
    groundwaterDepthM: null,
    groundwaterObservedAt: null,
    waterSupplyStatus: "normal",
    recentWaterShortageReports: 2,
    source: "Illustrative demo data",
    lastVerifiedAt: null,
    demoMode: true,
  },

  "Sector 11": {
    sector: "Sector 11",
    drainageCondition: "poor",
    historicalWaterlogging: "occasional",
    floodSusceptibility: 65,
    groundwaterDepthM: null,
    groundwaterObservedAt: null,
    waterSupplyStatus: "intermittent",
    recentWaterShortageReports: 4,
    source: "Illustrative demo data",
    lastVerifiedAt: null,
    demoMode: true,
  },

  "Sector 12": {
    sector: "Sector 12",
    drainageCondition: "good",
    historicalWaterlogging: "none",
    floodSusceptibility: 25,
    groundwaterDepthM: null,
    groundwaterObservedAt: null,
    waterSupplyStatus: "normal",
    recentWaterShortageReports: 0,
    source: "Illustrative demo data",
    lastVerifiedAt: null,
    demoMode: true,
  },

  "Sector 14": {
    sector: "Sector 14",
    drainageCondition: "moderate",
    historicalWaterlogging: "occasional",
    floodSusceptibility: 40,
    groundwaterDepthM: null,
    groundwaterObservedAt: null,
    waterSupplyStatus: "intermittent",
    recentWaterShortageReports: 2,
    source: "Illustrative demo data",
    lastVerifiedAt: null,
    demoMode: true,
  },

  "Sector 21": {
    sector: "Sector 21",
    drainageCondition: "poor",
    historicalWaterlogging: "frequent",
    floodSusceptibility: 80,
    groundwaterDepthM: null,
    groundwaterObservedAt: null,
    waterSupplyStatus: "shortage",
    recentWaterShortageReports: 7,
    source: "Illustrative demo data",
    lastVerifiedAt: null,
    demoMode: true,
  },
};
