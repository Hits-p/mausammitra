# 🌦️ MausamMitra — Hyperlocal Environmental Risk Intelligence

**Safer Cities, Smarter Decisions.**

MausamMitra is a hyperlocal environmental risk intelligence platform designed to help communities understand and respond to heat and water-related risks. It combines weather information, sector-level risk estimates, and community reporting to make environmental information more actionable.

## 🎯 Problem Statement

Urban communities face environmental challenges such as extreme heat, flooding, monsoon waterlogging, water shortages, and water leakage. Information about these risks can be scattered or difficult to translate into local action.

MausamMitra aims to bring relevant environmental information together in one place and help users understand potential risks in their area.

## ✨ Key Features

- **🌤️ Weather Dashboard:** Displays weather information retrieved from the Open-Meteo API.
- **🗺️ Sector-wise Risk View:** Presents estimated environmental risk scores for selected sectors.
- **🔥 Heat Risk Awareness:** Helps users understand heat-related environmental concerns.
- **🌧️ Flood and Waterlogging Risk:** Estimates flood risk using rainfall information and sector susceptibility data.
- **💧 Water Stress Assessment:** Estimates water stress using water supply status and reported shortages.
- **🚨 Risk Alerts:** Highlights selected environmental conditions that may require attention.
- **📢 Community Reporting:** Supports reporting and displaying local environmental issues.
- **📍 Hyperlocal Perspective:** Organizes information around sectors rather than only city-wide conditions.

> **Note:** Some sector-level risk values are illustrative prototype data. They are not official government warnings or verified measurements. Weather values come from the configured weather API.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Weather Data | Open-Meteo API |
| Mapping | Leaflet, React Leaflet, OpenStreetMap |
| Risk Assessment | Custom TypeScript calculations |
| Version Control | Git and GitHub |

## ⚙️ Getting Started

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

### 1. Clone the repository

```bash
git clone https://github.com/Hits-p/mausammitra.git
cd mausammitra
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

### 4. Open the application

Visit:

`http://localhost:3000`

If another port is shown in the terminal, open the URL displayed there.

## 📁 Project Structure

```text
mausammitra/
├── app/
│   ├── api/
│   │   └── weather/
│   │       └── route.ts
│   ├── data/
│   │   ├── sector-risk.ts
│   │   └── calculate-risk.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── DelhiRiskMap.tsx
├── public/
├── .gitignore
├── package.json
├── package-lock.json
├── tailwind.config.ts
└── tsconfig.json
```

*This structure highlights the main files; additional files may exist in the repository.*

## 🧮 Risk Assessment

MausamMitra uses prototype calculations to estimate environmental risks.

- **Flood risk:** Combines rainfall information with sector flood susceptibility.
- **Water stress:** Combines water supply status with recent reported shortages.

The scores are intended for demonstration and comparison, not as validated predictions. Their reliability depends on the quality and availability of the underlying data.

## 🤝 Contributing

Contributions from teammates are welcome!

1. Clone the repository.
2. Create a separate branch for your changes:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make and test your changes locally.
4. Commit your work:

   ```bash
   git add .
   git commit -m "Describe your changes"
   ```

5. Push your branch:

   ```bash
   git push -u origin feature/your-feature
   ```

6. Open a pull request on GitHub for review.

Please do not commit `node_modules`, `.next`, `.env`, or other files containing secrets.

## 🗺️ Map and Data Disclaimer

Map tiles are provided by OpenStreetMap contributors. Sector coordinates and illustrative risk values may not represent official sector boundaries or current ground conditions. Environmental risk estimates should not replace official weather alerts or emergency guidance.

## 🚀 Vision

MausamMitra aims to make local environmental risks easier to understand, communicate, and act upon—supporting safer and more resilient communities.

---

**Built as a civic-tech project focused on environmental awareness and urban resilience.**
