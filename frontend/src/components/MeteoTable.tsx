import { useEffect, useState } from "react";
import { getMeteoData, runMeteoEtl } from "../lib/api";

type MeteoRow = {
  created_at: string;
  date_key: number;
  node: string;
  temperature_c: number | null;
  humidity_pct: number | null;
  pressure_hpa: number | null;
  rain_mm_h: number | null;
  wind_speed_ms: number | null;
  dust_conc: number | null;
  rssi_dbm: number | null;
};

export default function MeteoTable() {
  const [rows, setRows] = useState<MeteoRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMeteoData(30);
      setRows(data || []);
    } catch (err: any) {
      setError(err?.message || "Chyba pri načítaní dát");
    } finally {
      setLoading(false);
    }
  };

  const handleRunEtl = async () => {
    try {
      setRunning(true);
      setError("");
      await runMeteoEtl();
      await loadData();
    } catch (err: any) {
      setError(err?.message || "Chyba pri spustení ETL");
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <button onClick={handleRunEtl} disabled={running}>
          {running ? "Spúšťam ETL..." : "Spustiť ETL"}
        </button>

        <button onClick={loadData} disabled={loading}>
          {loading ? "Načítavam..." : "Obnoviť dáta"}
        </button>
      </div>

      {error && <p>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Čas</th>
            <th>Node</th>
            <th>Teplota</th>
            <th>Vlhkosť</th>
            <th>Tlak</th>
            <th>Dážď</th>
            <th>Vietor</th>
            <th>Prach/Fog</th>
            <th>RSSI</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.created_at}_${row.node}`}>
              <td>{new Date(row.created_at).toLocaleString()}</td>
              <td>{row.node}</td>
              <td>{row.temperature_c ?? "-"}</td>
              <td>{row.humidity_pct ?? "-"}</td>
              <td>{row.pressure_hpa ?? "-"}</td>
              <td>{row.rain_mm_h ?? "-"}</td>
              <td>{row.wind_speed_ms ?? "-"}</td>
              <td>{row.dust_conc ?? "-"}</td>
              <td>{row.rssi_dbm ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}