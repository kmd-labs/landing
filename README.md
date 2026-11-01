# KMD Labs — Scientific Data Visualisation & Cartography

[![Deploy to GitHub Pages](https://github.com/kmd-labs/landing/actions/workflows/deploy.yml/badge.svg)](https://github.com/kmd-labs/landing/actions/workflows/deploy.yml)
[![Daily Wind Data Update](https://github.com/kmd-labs/landing/actions/workflows/daily-wind-update.yml/badge.svg)](https://github.com/kmd-labs/landing/actions/workflows/daily-wind-update.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-kmd--labs.github.io%2Flanding-ff6a2e?style=for-the-badge&logo=google-chrome&logoColor=white)](https://kmd-labs.github.io/landing/)
[![Angular](https://img.shields.io/badge/Angular-18-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![Design System](https://img.shields.io/badge/@kmd%2Fdesign--system-v1.17-0ea5e9?style=for-the-badge)](https://github.com/kmd-labs/design-system)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

The official homepage and interactive observatory for **[KMD Labs](https://kmd-labs.org/)**, showcasing scientific data visualization, earth observation, and high-performance interactive cartography.

🔗 **Explore Live Demo:** [https://kmd-labs.github.io/landing/](https://kmd-labs.github.io/landing/)

---

## 🌍 Overview & Key Features

- **Interactive 2D Vortex Canvas & Telemetry HUD**:
  - Full-screen HTML5 Canvas simulation with dynamic vorticity, fluid velocity fields, thermal anomaly gradients, and responsive particle streamlines.
  - Centered observatory viewport with desktop and mobile configuration presets ([`map-viewport.config.ts`](src/app/core/config/map-viewport.config.ts)).
  - Real-time telemetry readouts for observatory lat/lon, ocean dynamics, circulation regime, and streamline metrics.

- **Cartographic Vector Overlays**:
  - Motorways, trunk expressways, populated cities, and administrative boundaries across the UK, Ireland, Western Europe, and North Africa without text or label clutter.
  - Responsive feature density: lightweight `50m` vector data on mobile screens for 60 FPS fluidity, and detailed `10m` precision on desktop.

- **NOAA & Open-Meteo Meteorological Data**:
  - Global wind vectors and sea-surface thermal anomalies updated automatically via daily scheduled GitHub Actions (`daily-wind-update.yml`).

- **KMD Design System (`@kmd/design-system`)**:
  - Standardized frosted glass HUD floating panels (`glass-panel`, `glass-panel--heavy`).
  - Unified typography using Inter (`$font-family: "Inter", sans-serif`).
  - Accessible mobile navigation dropdown (`app-dropdown`) with dynamic `Menu` / `X` icon swapping and high-contrast CTA styling.
  - Interactive KMD brand logotype with collaboration pill expansion (`app-brand`).

- **Internationalization (i18n)**:
  - Complete English (`en`) and Polish (`pl`) type-safe dictionaries with reactive switching via `I18nService`.
  - Zero hardcoded strings and automatic locale persistence in `localStorage`.

- **Project Inquiry & Contact**:
  - Localized direct mail inquiry system prefilled in the visitor's language (`hello@kmd-labs.org`).

---

## 🛠️ Tech Stack

- **Framework**: [Angular 18](https://angular.dev/) (Standalone Components, Signals, Computed, Effects)
- **Styling**: Sass (`SCSS`) Design Tokens (`@kmd/design-system`)
- **Graphics**: HTML5 2D Canvas with sub-pixel rendering and trigonometric flow fields
- **Icons**: [Lucide Angular](https://lucide.dev/)
- **Data Pipeline**: Node.js automated ingestion scripts for GeoJSON features and Open-Meteo REST APIs

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v20 or higher
- **npm**: v10 or higher
- **Git** with submodules support

### Installation

```bash
# Clone the repository including the design system submodule
git clone --recurse-submodules https://github.com/kmd-labs/landing.git
cd landing

# Install dependencies
npm install

# Start development server
npm start
```

Navigate to `http://localhost:4200/` in your browser.

---

## 📦 Build & Deployment

```bash
# Production build with ahead-of-time (AOT) compilation
npm run build
```

Production artifacts are written to `dist/landing/browser/`. The application deploys automatically to **GitHub Pages** on every push to `main` via `.github/workflows/deploy.yml`.

---

## 📄 License & Attribution

- **Cartographic Vector Data**: [Natural Earth](https://www.naturalearthdata.com/) (Public Domain).
- **Meteorological Data**: [Open-Meteo](https://open-meteo.com/) (Licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)) based on NOAA GFS & Marine models.
- **Code & Design System**: © 2026 [KMD Labs](https://kmd-labs.org/). All rights reserved.
