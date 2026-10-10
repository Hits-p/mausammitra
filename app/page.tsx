'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CloudRain,
  Droplets,
  Flame,
  Gauge,
  LocateFixed,
  MapPin,
  Menu,
  Send,
  ShieldCheck,
  Users,
  Waves,
  Wind,
  Zap,
} from 'lucide-react';
import { sectorRiskData } from "./data/sector-risk";
import {
  calculateFloodRisk,
  calculateWaterStress,
} from "./data/calculate-risk";
import dynamic from "next/dynamic";

const DelhiRiskMap = dynamic(
  () => import("../components/DelhiRiskMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[380px] animate-pulse rounded-2xl bg-slate-100" />
    ),
  }
);

const sectors = [
  'Sector 6',
  'Sector 7',
  'Sector 8',
  'Sector 10',
  'Sector 11',
  'Sector 12',
  'Sector 14',
  'Sector 21',
];

const scenarios = [
  'Heavy Rainfall',
  '3-Day Heatwave',
  'Water Shortage',
  'Tanker Disruption',
];

const impacts: Record<string, any> = {
  'Heavy Rainfall': {
    before: 71,
    after: 89,
    waterBefore: '60%',
    waterAfter: '85%',
    roads: '3 → 7',
    text: 'Heavy rainfall may increase waterlogging in low-lying areas and near congested roads.',
  },
  '3-Day Heatwave': {
    before: 84,
    after: 96,
    waterBefore: '55%',
    waterAfter: '78%',
    roads: '2 → 5',
    text: 'Persistent heat can intensify heat stress and increase local water demand.',
  },
  'Water Shortage': {
    before: 55,
    after: 76,
    waterBefore: '55%',
    waterAfter: '82%',
    roads: '0 → 0',
    text: 'Reduced supply can increase tanker dependence and household water stress.',
  },
  'Tanker Disruption': {
    before: 55,
    after: 70,
    waterBefore: '55%',
    waterAfter: '74%',
    roads: '0 → 0',
    text: 'A tanker disruption can amplify short-term water stress in affected pockets.',
  },
};

export default function Home() {
  const [sector, setSector] = useState('Sector 10');
  const [scenario, setScenario] = useState('Heavy Rainfall');
  const [simulated, setSimulated] = useState(false);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(false);

  const [panel, setPanel] = useState<string | null>(null);
  const [issue, setIssue] = useState('Waterlogging');
  const [description, setDescription] = useState('');

  const [reports, setReports] = useState([
    ['Waterlogging', 'Sector 10', '30 mins ago', 'Verified'],
    ['No Water Supply', 'Sector 12', '2 hours ago', 'Unverified'],
    ['Extreme Heat', 'Sector 6', '4 hours ago', 'Verified'],
    ['Tanker Request', 'Sector 21', '5 hours ago', 'Verified'],
    ['Leakage', 'Sector 14', '6 hours ago', 'Unverified'],
  ]);

  useEffect(() => {
    setLoading(true);

    fetch(`/api/weather?sector=${encodeURIComponent(sector)}`)
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sector]);

  const goTo = (target: string) => {
    if (
      ['dashboard', 'sector-map', 'what-if', 'community'].includes(target)
    ) {
      document
        .getElementById(target)
        ?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setPanel(target);
    }
  };

  const submitReport = () => {
    if (!description.trim()) return;

    setReports((old) => [
      [issue, sector, 'Just now', 'Unverified'],
      ...old,
    ]);

    setDescription('');
    setPanel('success');
  };

  const impact = impacts[scenario];
  const selectedSector = sectorRiskData[sector];

const floodRisk = calculateFloodRisk(
  weather?.rainfallNext24HoursMm ?? null,
  selectedSector
);

const waterStress = calculateWaterStress(selectedSector);
  const currentTemp = Number(weather?.temperature ?? 0);
const feelsLike = Number(weather?.feelsLike ?? currentTemp);
const humidity = Number(weather?.humidity ?? 0);

const heatRisk = weather
  ? Math.min(
      100,
      Math.max(
        0,
        Math.round(
          Math.max(0, currentTemp - 25) * 3 +
          Math.max(0, feelsLike - 25) * 2 +
          Math.max(0, humidity - 40) * 0.25
        )
      )
    )
  : null;


  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* STEP 1–2: HEADER + HERO */}

      <header className="relative overflow-hidden bg-gradient-to-r from-white via-white to-sky-50">
        <div className="mx-auto max-w-[1500px] px-8 py-5">
          <nav className="flex items-center justify-between">
            <button
              onClick={() => goTo('dashboard')}
              className="flex items-center gap-3 text-left"
            >
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
                <Droplets size={25} />
              </div>

              <div>
                <b className="text-2xl">MausamMitra</b>
                <p className="text-xs text-slate-500">
                  Safer Neighbourhoods, Healthier Tomorrows.
                </p>
              </div>
            </button>

            <div className="hidden gap-8 text-sm md:flex">
              <button
                onClick={() => goTo('dashboard')}
                className="rounded-xl bg-emerald-50 px-4 py-2 font-semibold text-emerald-800"
              >
                Home
              </button>

              <button onClick={() => goTo('dashboard')}>
                About
              </button>

              <button onClick={() => goTo('what-if')}>
                Features
              </button>

              <button onClick={() => goTo('community')}>
                Community
              </button>

              <button onClick={() => goTo('resources')}>
                Resources
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMenu(!menu)}
                className="rounded-xl border p-2 md:hidden"
              >
                <Menu />
              </button>

              <button
                onClick={() => setPanel('report')}
                className="hidden rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white md:block"
              >
                Report an Issue
              </button>
            </div>
          </nav>

          {menu && (
            <div className="mt-4 rounded-xl border bg-white p-4 shadow-lg md:hidden">
              <div className="flex flex-col gap-3 text-sm">
                <button onClick={() => goTo('dashboard')}>
                  Home
                </button>

                <button onClick={() => goTo('dashboard')}>
                  About
                </button>

                <button onClick={() => goTo('what-if')}>
                  Features
                </button>

                <button onClick={() => goTo('community')}>
                  Community
                </button>

                <button onClick={() => goTo('resources')}>
                  Resources
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-8 py-12 md:grid-cols-[1.15fr_.85fr]">
            <section>
              <div className="mb-4 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-800">
                Heat • Floods • Waterlogging • Droughts • Tankers •
                Leaks • Groundwater
              </div>

              <h1 className="max-w-2xl text-5xl font-extrabold leading-tight md:text-6xl">
                Know Your{' '}
                <span className="text-emerald-700">
                  Environmental Risk
                </span>
                <br />
                Before It Becomes a Problem
              </h1>

              <p className="mt-4 max-w-xl text-lg text-slate-600">
                Real-time insights on heat, water and climate risks
                across your neighbourhood.
              </p>

              <div className="mt-6 flex max-w-2xl overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-1 shadow-sm">
                <div className="flex flex-1 items-center gap-3 px-4">
                  <MapPin size={20} />

                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-transparent py-3 outline-none"
                  >
                    {sectors.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => goTo('dashboard')}
                  className="rounded-xl bg-emerald-800 px-7 font-semibold text-white"
                >
                  Check My Risk →
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {sectors.slice(0, 5).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSector(s)}
                    className={`rounded-full border px-4 py-2 text-xs ${
                      sector === s
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : 'bg-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>

            <section className="flex justify-end">
              <div className="w-72 rounded-2xl bg-white/90 p-5 shadow-xl">
                <div className="flex justify-between">
                  <div>
                    <b>Dwarka, Delhi</b>
                    <p className="text-xs text-slate-500">
                      {sector}
                    </p>
                  </div>

                  <CloudRain className="text-sky-500" />
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="text-4xl">🌤️</div>

                  <div>
                    <b className="text-3xl">
                      {loading
                        ? '--°C'
                        : `${Math.round(
                            weather?.temperature ?? 0
                          )}°C`}
                    </b>

                    <p className="text-sm">
                      Feels like{' '}
                      {loading
                        ? '--'
                        : `${Math.round(
                            weather?.feelsLike ?? 0
                          )}°C`}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
                  <span>
                    🌧️{' '}
                    {loading
                      ? '--'
                      : `${weather?.rainProbability ?? 0}%`}
                  </span>

                  <span>
                    💧{' '}
                    {loading
                      ? '--'
                      : `${weather?.humidity ?? 0}%`}
                  </span>

                  <span>
                    💨{' '}
                    {loading
                      ? '--'
                      : `${Math.round(
                          weather?.windSpeed ?? 0
                        )} km/h`}
                  </span>
                </div>

                <p className="mt-4 text-center text-[10px] text-slate-400">
                  Live weather • {sector}
                </p>
              </div>
            </section>
          </div>

          <div className="grid gap-3 pb-5 sm:grid-cols-2 lg:grid-cols-6">
            {[
              ['Weather', CloudRain],
              ['Sector Risk', Gauge],
              ['Community', Users],
              ['AI Insights', ShieldCheck],
              ['What-If', Zap],
              ['Hyperlocal', LocateFixed],
            ].map(([title, Icon]: any) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-xl border bg-white/90 px-4 py-3 text-xs shadow-sm"
              >
                <Icon
                  size={22}
                  className="text-emerald-600"
                />

                <span>
                  {title}
                  <br />
                  <b>
                    {title === 'What-If'
                      ? 'Scenario Simulator'
                      : 'Insights'}
                  </b>
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>
      
      {/* DWARKA SECTOR RISK MAP */}
      
      {/* DWARKA SECTOR RISK MAP */}
     
{/* SECTOR-WISE RISK MAP */}
<section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
  <DelhiRiskMap />
</section>




      {/* STEP 3: DASHBOARD */}

      <section
        id="dashboard"
        className="mx-auto max-w-[1500px] px-8 py-12"
      >
        <div className="mb-8">
          <p className="text-sm font-semibold text-emerald-700">
            HYPERLOCAL RISK DASHBOARD
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Environmental Risk in {sector}
          </h2>

          <p className="mt-2 max-w-2xl text-slate-600">
            Understand the current environmental conditions around
            your neighbourhood and prepare before risks become
            emergencies.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Overall Risk
              </span>

              <Gauge className="text-orange-500" />
            </div>

           <div className="mt-4 text-4xl font-extrabold">
  {floodRisk.score !== null && waterStress.score !== null
    ? Math.round((floodRisk.score + waterStress.score) / 2)
    : floodRisk.score ?? waterStress.score ?? "—"}
</div>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
  <div
    className="h-2 rounded-full bg-orange-500"
    style={{
      width: `${
        floodRisk.score !== null && waterStress.score !== null
          ? Math.round((floodRisk.score + waterStress.score) / 2)
          : floodRisk.score ?? waterStress.score ?? 0
      }%`,
    }}
  />
</div>

            <p className="mt-3 text-xs text-orange-600">
              High environmental risk
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Heat Risk
              </span>

              <Flame className="text-red-500" />
            </div>

            <div className="mt-4 text-4xl font-extrabold">
              {heatRisk === null ? '--' : heatRisk}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Elevated heat stress
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-500">
      Flood Risk
    </span>

    <Waves className="text-blue-500" />
  </div>

  <div className="mt-4 text-2xl font-extrabold">
  {weather?.rainfallNext24HoursMm === null ||
   weather?.rainfallNext24HoursMm === undefined
    ? "—"
    : weather.rainfallNext24HoursMm === 0
      ? "Low rainfall"
      : `${weather.rainfallNext24HoursMm} mm`}
</div>

  <p className="mt-3 text-xs text-slate-500">
  {floodRisk.score === null
    ? "Local flood data unavailable"
    : `${floodRisk.status} estimated risk · Demo data`}
</p>
</div>

<div className="rounded-2xl border bg-white p-6 shadow-sm">
  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-500">
      Water Stress
    </span>

    <Droplets className="text-cyan-500" />
  </div>

  <div className="mt-4 text-4xl font-extrabold">
   {waterStress.score === null ? "—" : `${waterStress.score}/100`}
  </div>
<p className="mt-3 text-xs text-slate-500">
  {waterStress.status === "Insufficient local data"
  ? "Local water-supply data unavailable"
  : `${waterStress.status} water stress · Demo estimate`}
</p>
</div>
</div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  Risk Breakdown
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Current risk indicators for {sector}
                </p>
              </div>

              <ShieldCheck className="text-emerald-600" />
            </div>

            <div className="mt-6 space-y-5">
              {[
                [
  'Heat Exposure',
  heatRisk ?? 0,
  heatRisk === null
    ? 'Loading'
    : heatRisk >= 75
      ? 'High'
      : heatRisk >= 50
        ? 'Moderate'
        : 'Low',
],
                ['Waterlogging', 71, 'Moderate'],
                ['Water Availability', 63, 'Moderate'],
                ['Groundwater Stress', 58, 'Moderate'],
              ].map(([name, value, level]: any) => (
                <div key={name}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium">
                      {name}
                    </span>

                    <span className="font-semibold">
                      {value} · {level}
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-emerald-500"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-900 p-6 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle />

              <h3 className="text-xl font-bold">
                AI Risk Insight
              </h3>
            </div>

            <p className="mt-5 text-sm leading-6 text-emerald-50">
              {sector} is currently showing elevated environmental
              risk. Heat exposure is the strongest contributor, while
              waterlogging remains an important monsoon-related
              concern.
            </p>

            <div className="mt-6 rounded-xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-wide text-emerald-200">
                Recommended Action
              </p>

              <p className="mt-2 text-sm font-medium">
                Stay hydrated, monitor local alerts and report
                waterlogging or supply issues early.
              </p>
            </div>
          </div>
        </div>
      </section>
            {/* STEP 4: SECTOR MAP */}

      <section
        id="sector-map"
        className="mx-auto max-w-[1500px] px-8 py-10"
      >
        <div className="mb-6">
          <p className="text-sm font-semibold text-emerald-700">
            SECTOR MAP
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Compare Risk Across Dwarka
          </h2>

          <p className="mt-2 text-slate-600">
            Select a sector to view its hyperlocal weather and
            environmental risk.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map((s, index) => {
            const sectorData = sectorRiskData[s];
const sectorFloodRisk = calculateFloodRisk(
  weather?.rainfallNext24HoursMm ?? null,
  sectorData
);
const sectorWaterStress = calculateWaterStress(sectorData);

const risk =
  sectorFloodRisk.score !== null && sectorWaterStress.score !== null
    ? Math.round(
        (sectorFloodRisk.score + sectorWaterStress.score) / 2
      )
    : sectorFloodRisk.score ?? sectorWaterStress.score ?? null;

            return (
              <button
                key={s}
                onClick={() => {
                  setSector(s);
                  goTo('dashboard');
                }}
                className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                  sector === s
                    ? 'border-emerald-500 ring-2 ring-emerald-100'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin
                      size={18}
                      className="text-emerald-600"
                    />
                    <b>{s}</b>
                  </div>

                  <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">
                    {risk}
                  </span>
                </div>

                <div className="mt-4 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${risk ?? 0}%` }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>Overall Risk</span>
                  <span>
                   {risk === null
  ? 'Data unavailable'
  : risk >= 75
    ? 'High'
    : risk >= 40
      ? 'Moderate'
      : 'Low'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* STEP 5: WHAT-IF SIMULATOR */}

      <section
        id="what-if"
        className="mx-auto max-w-[1500px] px-8 py-12"
      >
        <div className="mb-6">
          <p className="text-sm font-semibold text-emerald-700">
            WHAT-IF SIMULATOR
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            What Happens If Conditions Change?
          </h2>

          <p className="mt-2 max-w-2xl text-slate-600">
            Simulate an environmental event and see how it could
            affect your neighbourhood.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold">
              Choose a scenario
            </h3>

            <div className="mt-5 grid gap-3">
              {scenarios.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setScenario(item);
                    setSimulated(false);
                  }}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    scenario === item
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {item === 'Heavy Rainfall' && (
                    <CloudRain className="text-sky-500" />
                  )}

                  {item === '3-Day Heatwave' && (
                    <Flame className="text-red-500" />
                  )}

                  {item === 'Water Shortage' && (
                    <Droplets className="text-cyan-500" />
                  )}

                  {item === 'Tanker Disruption' && (
                    <Waves className="text-indigo-500" />
                  )}

                  <span className="font-medium">{item}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setSimulated(true)}
              className="mt-6 w-full rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900"
            >
              Run Simulation →
            </button>
          </div>

          <div className="rounded-2xl border bg-slate-900 p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Scenario
                </p>

                <h3 className="mt-1 text-2xl font-bold">
                  {scenario}
                </h3>
              </div>

              <Zap className="text-yellow-400" />
            </div>

            {!simulated ? (
              <div className="mt-10 rounded-2xl bg-white/10 p-8 text-center">
                <Gauge
                  className="mx-auto text-emerald-400"
                  size={38}
                />

                <p className="mt-4 font-semibold">
                  Simulation ready
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Choose a scenario and run the simulation to see its
                  predicted impact on {sector}.
                </p>
              </div>
            ) : (
              <div className="mt-7">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="text-xs text-slate-400">
                      Risk Score
                    </p>

                    <div className="mt-2 text-3xl font-bold">
                      {impact.before} → {impact.after}
                    </div>

                    <p className="mt-1 text-xs text-red-300">
                      Increased risk
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="text-xs text-slate-400">
                      Waterlogging
                    </p>

                    <div className="mt-2 text-3xl font-bold">
                      {impact.waterBefore} → {impact.waterAfter}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="text-xs text-slate-400">
                      Disrupted Roads
                    </p>

                    <div className="mt-2 text-3xl font-bold">
                      {impact.roads}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
                  <div className="flex gap-3">
                    <AlertTriangle className="shrink-0 text-yellow-400" />

                    <div>
                      <p className="font-semibold">
                        Predicted Impact
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {impact.text}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                  Simulation for {sector} • Scenario-based estimate
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STEP 6: COMMUNITY REPORTS */}

      <section
        id="community"
        className="mx-auto max-w-[1500px] px-8 py-12"
      >
        <div className="mb-6">
          <p className="text-sm font-semibold text-emerald-700">
            COMMUNITY
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Recent Community Reports
          </h2>

          <p className="mt-2 text-slate-600">
            Local reports help MausamMitra understand what is
            happening on the ground.
          </p>
        </div>

        
<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <div className="mb-5 flex items-center justify-between">
    <div>
      <h3 className="text-lg font-bold text-slate-900">
        Recent Community Reports
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Local issues reported by the community
      </p>
    </div>

    <button
      onClick={() => setPanel("report")}
      className="flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
    >
      Report an Issue <span>→</span>
    </button>
  </div>

  <div className="divide-y divide-slate-100">
    {reports.map((report, index) => {
      
const reportImages: Record<string, string> = {
  Waterlogging:
    "https://feeds.abplive.com/onecms/images/uploaded-images/2024/06/27/42dbc60dd535e71e5fcdba56231ed25a1719471855715645_original.jpeg",

  "No Water Supply":
    "https://images.nobroker.in/images/8a9f8785978df0c501978e300fe50cc7/8a9f8785978df0c501978e300fe50cc7_22340_original.jpg",

  "Extreme Heat":
    "https://images.herzindagi.info/image/2022/Aug/dwarka-sector-6-market.jpg",

  "Tanker Request":
    "https://files.yappe.in/place/full/dwarka-sector-21-metro-station-8951382.webp",

  Leakage:
    "https://img.staticmb.com/mbphoto/locality/cropped_images/2022/Jun/7/Photo_h470_w1080/77725_IMG_20220429_130614---Vivek-Kumar_470_1080.jpg",
};


      return (
        <div
          key={`${report[0]}-${index}`}
          className="flex items-center gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4"
        >
          <img
            src={
              reportImages[report[0]] ??
              "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=240&q=80"
            }
            alt={`${report[0]} community issue`}
            className="h-16 w-20 shrink-0 rounded-xl object-cover sm:h-[76px] sm:w-28"
          />

          <div className="min-w-0 flex-1">
            <h4 className="truncate font-semibold text-slate-900">
              {report[0]}
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              📍 {report[1]}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Reported {report[2]}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs ${
              report[3] === "Verified"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {report[3]}
          </span>
        </div>
      );
    })}
  </div>
</div>

        {/* STEP 8: RISK ALERTS */}
<div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
  <div className="flex items-center gap-3">
    <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-50">
      <ShieldCheck size={20} className="text-amber-600" />
    </div>

    <div>
      <h2 className="text-xl font-bold">Risk Alerts</h2>
      <p className="text-sm text-slate-500">
        Weather-based alerts for {sector}
      </p>
    </div>
  </div>

  <div className="mt-5 space-y-3">
    {weather?.temperature == null ||
    weather?.rainfallNext24HoursMm == null ? (
      <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        Weather data is unavailable. Please try again shortly.
      </p>
    ) : (
      <>
        {weather.temperature >= 40 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-800">
              Extreme Heat Alert
            </p>
            <p className="mt-1 text-sm text-red-700">
              Temperature is {weather.temperature}°C. Stay hydrated
              and avoid prolonged outdoor activity.
            </p>
          </div>
        )}

        {weather.rainfallNext24HoursMm >= 50 && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="font-semibold text-blue-800">
              Heavy Rainfall Watch
            </p>
            <p className="mt-1 text-sm text-blue-700">
              Forecast rainfall is {weather.rainfallNext24HoursMm} mm
              over the next 24 hours. Check local advisories.
            </p>
          </div>
        )}

        {weather.temperature < 40 &&
          weather.rainfallNext24HoursMm < 50 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="font-semibold text-emerald-800">
                No Weather Thresholds Triggered
              </p>
              <p className="mt-1 text-sm text-emerald-700">
                No heat or heavy-rainfall alert threshold has been
                triggered for {sector}. Other local risks may still exist.
              </p>
            </div>
          )}
      </>
    )}
  </div>

  <p className="mt-4 text-xs text-slate-400">
    Prototype alerts based on forecast data, not official emergency warnings.
  </p>
</div>
        <button
          onClick={() => setPanel('report')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white"
        >
          <Send size={17} />
          Report an Issue
        </button>
      </section>
            {/* STEP 7: REPORT AN ISSUE PANEL */}

      {panel === 'report' && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Report an Issue
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Help your neighbourhood by reporting a local problem.
                </p>
              </div>

              <button
                onClick={() => setPanel(null)}
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Issue Type
                </label>

                <select
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-emerald-500"
                >
                  <option>Waterlogging</option>
                  <option>No Water Supply</option>
                  <option>Extreme Heat</option>
                  <option>Tanker Request</option>
                  <option>Leakage</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Sector
                </label>

                <div className="mt-2 rounded-xl border bg-slate-50 px-4 py-3 text-sm">
                  {sector}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what is happening..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={submitReport}
                disabled={!description.trim()}
                className="w-full rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 8: SUCCESS MESSAGE */}

      {panel === 'success' && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100">
              <ShieldCheck
                className="text-emerald-600"
                size={30}
              />
            </div>

            <h2 className="mt-4 text-xl font-bold">
              Report Submitted
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Thank you for helping your neighbourhood. Your report
              has been added to the community feed.
            </p>

            <button
              onClick={() => setPanel(null)}
              className="mt-6 w-full rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* STEP 9: RESOURCES */}

      <section
        id="resources"
        className="mx-auto max-w-[1500px] px-8 py-12"
      >
        <div className="rounded-3xl bg-emerald-950 p-8 text-white">
          <p className="text-sm font-semibold text-emerald-300">
            RESOURCES
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Prepare Before the Risk Arrives
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-100">
            Simple actions can reduce the impact of heat, flooding and
            water shortages in your neighbourhood.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-5">
              <Flame className="text-orange-300" />

              <h3 className="mt-4 font-bold">
                During Extreme Heat
              </h3>

              <p className="mt-2 text-sm text-emerald-100">
                Stay hydrated, avoid prolonged outdoor exposure and
                check on vulnerable neighbours.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <Waves className="text-sky-300" />

              <h3 className="mt-4 font-bold">
                During Heavy Rain
              </h3>

              <p className="mt-2 text-sm text-emerald-100">
                Avoid flooded roads, monitor waterlogging reports and
                keep essential items above ground level.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <Droplets className="text-cyan-300" />

              <h3 className="mt-4 font-bold">
                During Water Shortage
              </h3>

              <p className="mt-2 text-sm text-emerald-100">
                Conserve stored water, report supply issues and plan
                for temporary disruptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 10: FOOTER */}

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-8 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            <b className="text-slate-800">MausamMitra</b>
            <p className="mt-1">
              Hyperlocal environmental intelligence for safer
              neighbourhoods.
            </p>
          </div>

          <div className="flex gap-5">
            <button onClick={() => goTo('dashboard')}>
              Dashboard
            </button>

            <button onClick={() => goTo('what-if')}>
              What-If
            </button>

            <button onClick={() => goTo('community')}>
              Community
            </button>

            <button onClick={() => goTo('resources')}>
              Resources
            </button>
          </div>
        </div>
      </footer>

    </main>
  );
}