# SSMFSC Detailed Documentation

This file contains comprehensive documentation for the SSMFSC project, covering both backend and frontend components, their structure, APIs, logic, and setup instructions.

---

## 🚀 Project Overview

**SSMFSC** (Statistical and System Modelling for Free‑Space Communications) is a full‑stack application designed to model and analyse Free‑Space Optical (FSO) and Radio Frequency (RF) links, gather sensor data, and perform statistical analysis using a Supabase backend. The system includes:

- **Backend** – a NestJS server with REST endpoints for calculations, statistics, device/system profiles, and sensor integration.
- **Frontend** – a React + Vite + Tailwind CSS application allowing users to input parameters, invoke the backend, and visualise results.

A serially connected fog sensor can stream data to the backend, which averages and persists the readings in a Supabase "iot" schema.

---

## 🗂 Repository Layout

```
SSMFSC/
├── prezentacia_diplomova_praca.md   ← project presentation
├── README.md                        ← setup instructions
├── README.txt                       ← this detailed documentation
├── backend/                         ← NestJS server
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── controllers/             ← HTTP controllers
│   │   ├── services/                ← business logic
│   │   ├── dto/                     ← request/response shapes
│   │   ├── logic/                   ← math engines (FSO, RF, stats)
│   │   ├── modules/                 ← Nest modules (Supabase, FSO, …)
│   │   ├── database/                ← SQL migrations & seeds
│   │   ├── utils/                   ← helpers (serialise NaN/∞)
│   │   └── …                        ← config files, tests
│   └── package.json
└── frontend/                        ← Vite + React application
    ├── src/
    │   ├── pages/                   ← FSO/RF/statistical UIs
    │   ├── components/              ← shared UI pieces
    │   ├── lib/api.ts               ← axios instance
    │   ├── context/                 ← language selector
    │   └── …                        ← styles, translations
    └── package.json
```

---

## 🛠 Backend – NestJS Details

### 📦 Modules & Wiring

- `SupabaseModule` (global) initializes two Supabase clients: default and one scoped to the `iot` schema using `SUPABASE_URL`/`API_KEY` from environment variables.
- Feature modules: `FsoModule`, `RfModule`, `StatisticalModule`, `SystemsModule` each provide controllers/services.
- `AppModule` aggregates all modules and also registers `SensorController` and `SensorService` directly.
- `MigrationService` executes raw SQL migrations at startup if a `DATABASE_URL` is defined.

### 🌀 Controllers & Endpoints

| Controller              | Route prefix      | Methods                                                       |
|-------------------------|-------------------|---------------------------------------------------------------|
| `FsoController`         | `/fso`            | `POST /calculate`                                             |
| `RfController`          | `/rf`             | `POST /calculate`                                             |
| `StatisticalController` | `/statistical`    | `POST /calculate`, `POST /graph-data`, `POST /table-data`     |
| `SystemsController`     | `/systems`        | `GET /fso`, `GET /rf`                                         |
| `SensorController`      | `/sensor`         | `GET /ports`, `POST /connect`, `POST /disconnect`             |
| `AppController`         | `/`               | `GET /` (hello world)                                         |

All POST endpoints expect JSON conforming to DTOs in `src/dto`.

### 📐 Data Transfer Objects

- `CalculateFsoDto` – parameters for FSO propagation calculation (model, turbulence, power, wavelength, distance, visibility, precipitation, etc.).
- `CalculateRfDto` extends FSO DTO with RF‑specific fields (tx power, frequency, gain, sensitivity).
- `CalculateStatisticalDto` wraps a date range, max fog density, plus FSO calculation parameters.
- `GetGraphDataDto` – date range and a type (`fog`, `temperature`, `humidity`).
- `GetTableDataDto` – a single date for daily tabular data.
- `FsoSystemDto` / `RfSystemDto` – static configuration objects used by `/systems` endpoints.

### 🔢 Core Logic

- **`FsoMathLogic`** – implements atmospheric attenuation formulas, geometric loss, link margin, and maximum distance calculations for FSO links; supports `Kim`/`Kruse` models and additive vs. weather conditions attenuation methods.
- **`RfMathLogic`** – builds on the FSO logic to compute free‑space loss (FSL), SI (signal level), weather attenuation, and RF maximum distance.
- **`StatisticalMathLogic`** – converts raw sensor readings to fog density, counts unavailability seconds, computes fade probability and link availability percentages.

### 🔧 Services

- `FsoService.calculate()` wraps `FsoMathLogic` and returns a serialised result object including link status, margins, and conditional attenuation components.
- `RfService.calculate()` invokes `FsoService` and adds RF measurements.
- `StatisticalService.calculate()` queries Supabase `raw_meteo` table in the `iot` schema, runs statistical logic, and merges basic FSO results.
  - Additional endpoints: `getGraphData()` fetches time series for a chosen variable; `getDataForTable()` returns grouped sensor data for a given day.

### 🌡 Sensor Integration

`SensorService` uses the [`serialport`](https://www.npmjs.com/package/serialport) package to: 

1. List available ports (`/sensor/ports`).
2. Connect to a port at 38 400 baud, parse incoming messages into fog/temperature/humidity values.
3. Buffer ten samples, compute averages, and insert them into Supabase `iot.raw_meteo`.
4. Handle disconnects and log errors.

### 🗄 Database

Migration SQL (`src/database/migrations/001_init.sql`) creates tables for measurements and FSO/RF companies & systems. A seed script (`seed-systems.sql`) populates sample hardware data.

> **Note:** The backend currently returns hard‑coded system lists; the database schema is prepared for future dynamic querying.

### 🧪 Testing

Example e2e test located in `backend/src/app.controller.spec.ts` uses Jest. More tests can be added following NestJS conventions.

---

## 🧩 Frontend – React + Vite

### 🔗 API Client

`src/lib/api.ts` exports an Axios instance pointed at `https://ssmfsc.onrender.com`. Update for local development if needed.

### 🧭 Pages & UI Flow

- **Landing pages** route users to the desired calculation (`Home`, `FsoLanding`, `FsoRfLanding`, `StatisticalLanding`).
- **Steady calculators**:
  - `SteadyFso.tsx` – collects FSO parameters, posts to `/fso/calculate`, displays results using `ResultCard`.
  - `SteadyRf.tsx` – similar but posts to `/rf/calculate`.
  - `Statistical.tsx` – date pickers and FSO fields; posts to `/statistical/calculate`, and has tabs to fetch graph (`/graph-data`) and table (`/table-data`) results.

Each page manages loading state, error handling, and result rendering.

### 🎨 Components

- `InputGroup.tsx` – labelled input with unit handling.
- `Layout.tsx` – common layout with header/footer and language selector.
- `ResultCard.tsx` – displays numeric calculation results.

### 🌍 Localization

`src/translations.ts` contains translation strings. `LanguageContext` allows switching between Slovak and English.

### 🎯 Styles & Configuration

- Tailwind CSS for styling (`tailwind.config.js`).
- Vite development server defaults to `http://localhost:5173` (`npm run dev`).

---

## ⚙️ Setup & Running

1. **Backend**

   ```bash
   cd backend
   npm install
   # create .env with SUPABASE_URL, API_KEY, DATABASE_URL (optional)
   npm run start:dev          # http://localhost:3000
   ```

   - To auto-apply SQL migrations set `DATABASE_URL`.
   - Sensor endpoints manage serial connection and data ingestion.
   - Supabase must have `iot.raw_meteo` or change schema via env.

2. **Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev                # http://localhost:5173
   ```

   - Edit `src/lib/api.ts` if using a different backend URL.

---

## 📘 Environment & Dependencies

- **Backend**: Node 18+, NestJS, TypeScript, `@supabase/supabase-js`, `serialport`, `pg`.
- **Frontend**: React 18, Vite, TypeScript, Tailwind, Axios.

---

## 💡 Tips & Extensions

- Add new systems by populating the DB and converting `SystemsService` to query it.
- Expand sensor parsing logic for other devices.
- Implement authentication (JWT guards) for secured endpoints.
- Deploy backend and frontend to any Node‑compatible host; set env vars accordingly.

---

## 📚 Additional Notes

The `prezentacia_diplomova_praca.md` file contains further project description and an API summary intended for a thesis presentation. The migration service is a handy pattern for raw SQL migrations without an ORM.


---

This document aims to make the SSMFSC codebase approachable for developers, maintainers, or reviewers. For more assistance, feel free to ask!