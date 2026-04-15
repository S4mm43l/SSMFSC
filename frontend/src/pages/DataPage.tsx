import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getMeteoDataByDate } from '../lib/api';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface MeteoRow {
  created_at: string;
  node: string;
  temperature_c?: number | null;
  humidity_pct?: number | null;
  pressure_hpa?: number | null;
  rain_mm_h?: number | null;
  wind_speed_ms?: number | null;
  dust_conc?: number | null;
  rssi_dbm?: number | null;
}

type MetricKey =
  | 'temp'
  | 'humidity'
  | 'pressure'
  | 'rain'
  | 'wind'
  | 'dust'
  | 'rssi';

type ChartPoint = {
  time: string;
  datetime: string;
  temp: number;
  humidity: number;
  pressure: number;
  rain: number;
  wind: number;
  dust: number;
  rssi: number;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color?: string;
    payload: {
      datetime: string;
    };
  }>;
  label?: string;
  unit?: string;
  decimals?: number;
  title: string;
};

function CustomChartTooltip({
  active,
  payload,
  unit,
  decimals = 2,
  title,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];
  const rawValue = item?.value;
  const datetime = item?.payload?.datetime;

  return (
    <div
      className="rounded-xl border border-white/20 bg-[#1e3f91]/95 px-4 py-3 shadow-xl backdrop-blur-md"
      style={{ minWidth: 180 }}
    >
      <div className="text-xs text-white/70 mb-1">
        {datetime ? new Date(datetime).toLocaleString() : ''}
      </div>

      <div className="text-sm font-semibold text-white mb-2">
        {title}
      </div>

      <div className="text-lg font-bold text-cyan-200">
        {Number(rawValue).toFixed(decimals)}
        {unit ? ` ${unit}` : ''}
      </div>
    </div>
  );
}

const ALL_METRICS: { key: MetricKey; labelKey: string }[] = [
  { key: 'temp', labelKey: 'metric_temp' },
  { key: 'humidity', labelKey: 'metric_humidity' },
  { key: 'pressure', labelKey: 'metric_pressure' },
  { key: 'rain', labelKey: 'metric_rain' },
  { key: 'wind', labelKey: 'metric_wind' },
  { key: 'dust', labelKey: 'metric_dust' },
  { key: 'rssi', labelKey: 'metric_rssi' },
];

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value);
}

function formatChartTime(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getBucketStart(dateString: string, bucketMinutes = 30) {
  const d = new Date(dateString);
  const result = new Date(d);
  result.setSeconds(0, 0);

  const minutes = result.getMinutes();
  const rounded = Math.floor(minutes / bucketMinutes) * bucketMinutes;
  result.setMinutes(rounded);

  return result;
}

function getBucketKey(dateString: string, bucketMinutes = 30) {
  return getBucketStart(dateString, bucketMinutes).toISOString();
}

function average(values: number[]) {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function sanitizeValue(
  metric: MetricKey,
  value: number | null | undefined
): number | null {
  if (!isValidNumber(value)) return null;

  switch (metric) {
    case 'temp':
      return value >= -50 && value <= 70 ? value : null;

    case 'humidity':
      return value >= 0 && value <= 100 ? value : null;

    case 'pressure':
      return value >= 850 && value <= 1100 ? value : null;

    case 'rain':
      return value >= 0 && value <= 500 ? value : null;

    case 'wind':
      return value >= 0 && value <= 80 ? value : null;

    case 'dust':
      return value >= 0 && value <= 5000 ? value : null;

    case 'rssi':
      return value >= -150 && value <= 0 ? value : null;

    default:
      return null;
  }
}

function fillForwardSeries(
  values: Array<number | null>,
  allowZero: boolean
): number[] {
  let lastValue = 0;

  return values.map((value) => {
    if (isValidNumber(value)) {
      if (allowZero) {
        lastValue = value;
        return value;
      }

      if (value !== 0) {
        lastValue = value;
        return value;
      }
    }

    return lastValue;
  });
}

function buildChartData(rows: MeteoRow[], bucketMinutes = 30): ChartPoint[] {
  if (!rows || rows.length === 0) return [];

  const ordered = [...rows].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const buckets = new Map<
    string,
    {
      datetime: string;
      temp: number[];
      humidity: number[];
      pressure: number[];
      rain: number[];
      wind: number[];
      dust: number[];
      rssi: number[];
    }
  >();

  for (const row of ordered) {
    const key = getBucketKey(row.created_at, bucketMinutes);
    const bucketStart = getBucketStart(row.created_at, bucketMinutes).toISOString();

    if (!buckets.has(key)) {
      buckets.set(key, {
        datetime: bucketStart,
        temp: [],
        humidity: [],
        pressure: [],
        rain: [],
        wind: [],
        dust: [],
        rssi: [],
      });
    }

    const bucket = buckets.get(key)!;

    const temp = sanitizeValue('temp', row.temperature_c);
    const humidity = sanitizeValue('humidity', row.humidity_pct);
    const pressure = sanitizeValue('pressure', row.pressure_hpa);
    const rain = sanitizeValue('rain', row.rain_mm_h);
    const wind = sanitizeValue('wind', row.wind_speed_ms);
    const dust = sanitizeValue('dust', row.dust_conc);
    const rssi = sanitizeValue('rssi', row.rssi_dbm);

    if (temp !== null) bucket.temp.push(temp);
    if (humidity !== null) bucket.humidity.push(humidity);
    if (pressure !== null) bucket.pressure.push(pressure);
    if (rain !== null) bucket.rain.push(rain);
    if (wind !== null) bucket.wind.push(wind);
    if (dust !== null) bucket.dust.push(dust);
    if (rssi !== null) bucket.rssi.push(rssi);
  }

  const rawPoints = Array.from(buckets.values()).sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );

  const tempRaw = rawPoints.map((p) => average(p.temp));
  const humidityRaw = rawPoints.map((p) => average(p.humidity));
  const pressureRaw = rawPoints.map((p) => average(p.pressure));
  const rainRaw = rawPoints.map((p) => average(p.rain));
  const windRaw = rawPoints.map((p) => average(p.wind));
  const dustRaw = rawPoints.map((p) => average(p.dust));
  const rssiRaw = rawPoints.map((p) => average(p.rssi));

  const tempSeries = fillForwardSeries(tempRaw, false);
  const humiditySeries = fillForwardSeries(humidityRaw, false);
  const pressureSeries = fillForwardSeries(pressureRaw, false);
  const rainSeries = fillForwardSeries(rainRaw, true);
  const windSeries = fillForwardSeries(windRaw, false);
  const dustSeries = fillForwardSeries(dustRaw, false);
  const rssiSeries = fillForwardSeries(rssiRaw, false);

  return rawPoints.map((point, index) => ({
    time: formatChartTime(point.datetime),
    datetime: point.datetime,
    temp: tempSeries[index],
    humidity: humiditySeries[index],
    pressure: pressureSeries[index],
    rain: rainSeries[index],
    wind: windSeries[index] * 3.6,
    dust: dustSeries[index],
    rssi: rssiSeries[index],
  }));
}

function axisX(label: string) {
  return {
    dataKey: 'time',
    tick: { fill: '#fff', fontSize: 12 },
    label: {
      value: label,
      position: 'insideBottom' as const,
      offset: -5,
      fill: '#fff',
    },
  };
}

function axisY(unit: string) {
  return {
    tick: { fill: '#fff', fontSize: 12 },
    label: {
      value: unit,
      angle: -90,
      position: 'insideLeft' as const,
      fill: '#fff',
    },
  };
}

const DataPage = () => {
  const { t, language } = useLanguage();

  const [selectedDate, setSelectedDate] = useState('');
  const [data, setData] = useState<MeteoRow[]>([]);
  const [showData, setShowData] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(
    ALL_METRICS.map((metric) => metric.key)
  );

  const showBalloons = selectedDate === '2001-12-18';

  const getTodayLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const availableLocations = useMemo(() => {
    const unique = Array.from(new Set(data.map((row) => row.node))).filter(Boolean);
    return unique.sort();
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedLocation === 'all') return data;
    return data.filter((row) => row.node === selectedLocation);
  }, [data, selectedLocation]);

  const chartData = useMemo(() => {
    return buildChartData(filteredData, 30);
  }, [filteredData]);

  const avgTemp = chartData.length
    ? chartData.reduce((sum, row) => sum + row.temp, 0) / chartData.length
    : 0;

  const avgWind = chartData.length
    ? chartData.reduce((sum, row) => sum + row.wind, 0) / chartData.length
    : 0;

  const showWeatherGroup =
    selectedMetrics.includes('temp') ||
    selectedMetrics.includes('humidity') ||
    selectedMetrics.includes('pressure');

  const showRainWindGroup =
    selectedMetrics.includes('rain') ||
    selectedMetrics.includes('wind');

  const showSignalParticlesGroup =
    selectedMetrics.includes('dust') ||
    selectedMetrics.includes('rssi');

  const weatherCount =
    Number(selectedMetrics.includes('temp')) +
    Number(selectedMetrics.includes('humidity')) +
    Number(selectedMetrics.includes('pressure'));

  const rainWindCount =
    Number(selectedMetrics.includes('rain')) +
    Number(selectedMetrics.includes('wind'));

  const signalParticlesCount =
    Number(selectedMetrics.includes('dust')) +
    Number(selectedMetrics.includes('rssi'));

  const handleLoadData = async (dateOverride?: string) => {
    const dateToLoad = dateOverride || selectedDate;

    if (!dateToLoad) {
      alert(
        language === 'sk'
          ? 'Prosím, vyberte dátum.'
          : 'Please select a date.'
      );
      return;
    }

    setLoading(true);

    try {
      const result = await getMeteoDataByDate(dateToLoad);
      setData(result || []);
      setShowData(true);
      setSelectedLocation('all');
    } catch (err) {
      console.error(err);
      alert(
        language === 'sk'
          ? 'Nepodarilo sa načítať dáta.'
          : 'Failed to load data.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = getTodayLocalDate();
    setSelectedDate(today);
    handleLoadData(today);
  }, []);

  const handleDownload = () => {
    if (!selectedDate || filteredData.length === 0) return;

    let csv =
      'DateTime,Node,Temperature (°C),Humidity (%),Pressure (hPa),Rain (mm/h),Wind speed (m/s),Dust conc,RSSI (dBm)\n';

    filteredData.forEach((row) => {
      csv += `${row.created_at},${row.node},${row.temperature_c ?? ''},${row.humidity_pct ?? ''},${row.pressure_hpa ?? ''},${row.rain_mm_h ?? ''},${row.wind_speed_ms ?? ''},${row.dust_conc ?? ''},${row.rssi_dbm ?? ''}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `meteo_${selectedDate}_${selectedLocation}.csv`;
    link.click();
  };

  const toggleMetric = (metric: MetricKey) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((item) => item !== metric)
        : [...prev, metric]
    );
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-linear-to-br from-[#1043b3] to-[#1455e2] text-white p-8">
      {showBalloons && (
        <div className="balloons-container pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="balloon"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${12 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-14 items-start">
        <div className="space-y-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold mb-6">
              {t('data_title')}
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-slate-100 max-w-xl">
              {t('data_intro')}
            </p>
          </div>

          <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-sm flex flex-col">
            <h2 className="text-lg font-semibold mb-4">
              {t('data_select_title')}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-[auto_auto_1fr_1fr] gap-4 items-start mb-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg px-3 py-2 text-sm text-slate-900 bg-white h-[48px]"
              />

              <button
                onClick={() => handleLoadData()}
                disabled={loading}
                className="rounded-full bg-linear-to-r from-[#1043b3] to-[#1455e2] px-6 py-2 text-sm font-semibold shadow disabled:opacity-50 h-[48px]"
              >
                {loading ? 'Loading...' : t('loadDataBtn')}
              </button>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 min-h-[110px]">
                <label className="block text-sm font-semibold mb-2">
                  {t('data_location')}
                </label>
                <div className="max-h-[120px] overflow-auto space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="location"
                      checked={selectedLocation === 'all'}
                      onChange={() => setSelectedLocation('all')}
                    />
                    <span>{t('data_all_locations')}</span>
                  </label>

                  {availableLocations.map((location) => (
                    <label
                      key={location}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="location"
                        checked={selectedLocation === location}
                        onChange={() => setSelectedLocation(location)}
                      />
                      <span>{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 min-h-[110px]">
                <label className="block text-sm font-semibold mb-2">
                  {t('data_metrics')}
                </label>
                <div className="max-h-[120px] overflow-auto grid grid-cols-1 gap-2">
                  {ALL_METRICS.map((metric) => (
                    <label
                      key={metric.key}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMetrics.includes(metric.key)}
                        onChange={() => toggleMetric(metric.key)}
                      />
                      <span>{t(metric.labelKey)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <div
                className={
                  showData && filteredData.length > 0
                    ? 'max-h-[620px] overflow-auto'
                    : 'overflow-hidden'
                }
              >
                <table className="min-w-full text-left text-xs md:text-sm">
                  <thead className="sticky top-0 z-20 bg-[#4f74c6] border-b border-white/20">
                    <tr>
                      <th className="px-3 py-3 whitespace-nowrap">{t('th_time')}</th>
                      <th className="px-3 py-3 whitespace-nowrap">{t('th_node')}</th>
                      <th className="px-3 py-3 whitespace-nowrap">{t('th_temp')}</th>
                      <th className="px-3 py-3 whitespace-nowrap">{t('th_humidity')}</th>
                      <th className="px-3 py-3 whitespace-nowrap">{t('th_pressure')}</th>
                      <th className="px-3 py-3 whitespace-nowrap">{t('th_rain')}</th>
                      <th className="px-3 py-3 whitespace-nowrap">{t('th_wind')}</th>
                      <th className="px-3 py-3 whitespace-nowrap">{t('th_dust')}</th>
                      <th className="px-3 py-3 whitespace-nowrap">{t('th_rssi')}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {showData ? (
                      filteredData.length > 0 ? (
                        filteredData.map((row, i) => (
                          <tr key={`${row.created_at}-${row.node}-${i}`}>
                            <td className="px-3 py-3 border-t border-white/10 whitespace-nowrap">
                              {new Date(row.created_at).toLocaleString()}
                            </td>
                            <td className="px-3 py-3 border-t border-white/10 whitespace-nowrap">
                              {row.node}
                            </td>
                            <td className="px-3 py-3 border-t border-white/10 whitespace-nowrap">
                              {row.temperature_c != null ? row.temperature_c.toFixed(2) : '-'}
                            </td>
                            <td className="px-3 py-3 border-t border-white/10 whitespace-nowrap">
                              {row.humidity_pct != null ? row.humidity_pct.toFixed(1) : '-'}
                            </td>
                            <td className="px-3 py-3 border-t border-white/10 whitespace-nowrap">
                              {row.pressure_hpa != null ? row.pressure_hpa.toFixed(2) : '-'}
                            </td>
                            <td className="px-3 py-3 border-t border-white/10 whitespace-nowrap">
                              {row.rain_mm_h != null ? row.rain_mm_h.toFixed(2) : '-'}
                            </td>
                            <td className="px-3 py-3 border-t border-white/10 whitespace-nowrap">
                              {row.wind_speed_ms != null ? row.wind_speed_ms.toFixed(2) : '-'}
                            </td>
                            <td className="px-3 py-3 border-t border-white/10 whitespace-nowrap">
                              {row.dust_conc != null ? row.dust_conc.toFixed(2) : '-'}
                            </td>
                            <td className="px-3 py-3 border-t border-white/10 whitespace-nowrap">
                              {row.rssi_dbm != null ? row.rssi_dbm.toFixed(2) : '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={9}
                            className="px-3 py-16 text-center text-white/70"
                          >
                            {t('data_no_data_for_date')}
                          </td>
                        </tr>
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-3 py-16 text-center text-white/70"
                        >
                          {t('data_placeholder')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={!showData || filteredData.length === 0}
              className="mt-4 shrink-0 rounded-full border border-white/40 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-40"
            >
              {t('downloadBtn')}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/15 rounded-2xl p-6">
              <p className="text-xs uppercase text-white/70">{t('avg_temp')}</p>
              <p className="text-3xl font-semibold mt-2">{avgTemp.toFixed(2)} °C</p>
            </div>

            <div className="bg-white/15 rounded-2xl p-6">
              <p className="text-xs uppercase text-white/70">{t('avg_wind')}</p>
              <p className="text-3xl font-semibold mt-2">{avgWind.toFixed(2)} km/h</p>
            </div>
          </div>

          {showWeatherGroup && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white/90">{t('group_weather')}</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {selectedMetrics.includes('temp') && (
                  <div
                    className={`bg-white/10 p-6 rounded-2xl ${
                      weatherCount === 1 ? 'xl:col-span-2' : ''
                    }`}
                  >
                    <h3 className="text-sm font-semibold mb-3">{t('metric_temp')}</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.25)" />
                        <XAxis {...axisX(t('axis_time'))} />
                        <YAxis {...axisY(t('axis_temp'))} />
                        <Tooltip
                          content={
                            <CustomChartTooltip
                              title={t('metric_temp')}
                              unit="°C"
                              decimals={2}
                            />
                          }/>
                          <Line type="monotone" dataKey="temp" stroke="#7dd3fc" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {selectedMetrics.includes('humidity') && (
                  <div
                    className={`bg-white/10 p-6 rounded-2xl ${
                      weatherCount === 1 ? 'xl:col-span-2' : ''
                    }`}
                  >
                    <h3 className="text-sm font-semibold mb-3">{t('metric_humidity')}</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.25)" />
                        <XAxis {...axisX(t('axis_time'))} />
                        <YAxis {...axisY(t('axis_humidity'))} />
                        <Tooltip
                          content={
                            <CustomChartTooltip
                              title={t('metric_humidity')}
                              unit="%"
                              decimals={2}
                            />
                          }
                        />
                        <Line type="monotone" dataKey="humidity" stroke="#86efac" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {selectedMetrics.includes('pressure') && (
                  <div
                    className={`bg-white/10 p-6 rounded-2xl ${
                      weatherCount === 1 || weatherCount === 3 ? 'xl:col-span-2' : ''
                    }`}
                  >
                    <h3 className="text-sm font-semibold mb-3">{t('metric_pressure')}</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.25)" />
                        <XAxis {...axisX(t('axis_time'))} />
                        <YAxis {...axisY(t('axis_pressure'))} domain={[975, 1025]} />
                        <Tooltip
                          content={
                            <CustomChartTooltip
                              title={t('metric_pressure')}
                              unit="hPa"
                              decimals={2}
                            />
                          }
                        />
                        <Line type="monotone" dataKey="pressure" stroke="#f9a8d4" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          )}

          {showRainWindGroup && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white/90">{t('group_rain_wind')}</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {selectedMetrics.includes('rain') && (
                  <div
                    className={`bg-white/10 p-6 rounded-2xl ${
                      rainWindCount === 1 ? 'xl:col-span-2' : ''
                    }`}
                  >
                    <h3 className="text-sm font-semibold mb-3">{t('metric_rain')}</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.25)" />
                        <XAxis {...axisX(t('axis_time'))} />
                        <YAxis {...axisY(t('axis_rain'))} />
                        <Tooltip
                          content={
                            <CustomChartTooltip
                              title={t('metric_rain')}
                              unit="mm/h"
                              decimals={2}
                            />
                          }
                        />
                        <Line type="monotone" dataKey="rain" stroke="#c4b5fd" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {selectedMetrics.includes('wind') && (
                  <div
                    className={`bg-white/10 p-6 rounded-2xl ${
                      rainWindCount === 1 ? 'xl:col-span-2' : ''
                    }`}
                  >
                    <h3 className="text-sm font-semibold mb-3">{t('metric_wind')}</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.25)" />
                        <XAxis {...axisX(t('axis_time'))} />
                        <YAxis {...axisY(t('axis_wind'))} />
                        <Tooltip
                          content={
                            <CustomChartTooltip
                              title={t('metric_wind')}
                              unit="km/h"
                              decimals={2}
                            />
                          }
                        />
                        <Line type="monotone" dataKey="wind" stroke="#fbbf24" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          )}

          {showSignalParticlesGroup && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white/90">{t('group_signal_particles')}</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {selectedMetrics.includes('dust') && (
                  <div
                    className={`bg-white/10 p-6 rounded-2xl ${
                      signalParticlesCount === 1 ? 'xl:col-span-2' : ''
                    }`}
                  >
                    <h3 className="text-sm font-semibold mb-3">{t('metric_dust')}</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.25)" />
                        <XAxis {...axisX(t('axis_time'))} />
                        <YAxis {...axisY(t('axis_dust'))} />
                          <Tooltip
                          content={
                            <CustomChartTooltip
                              title={t('metric_dust')}
                              unit="μg/m³"
                              decimals={2}
                            />
                          }
                        />
                        <Line type="monotone" dataKey="dust" stroke="#fdba74" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {selectedMetrics.includes('rssi') && (
                  <div
                    className={`bg-white/10 p-6 rounded-2xl ${
                      signalParticlesCount === 1 ? 'xl:col-span-2' : ''
                    }`}
                  >
                    <h3 className="text-sm font-semibold mb-3">{t('metric_rssi')}</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.25)" />
                        <XAxis {...axisX(t('axis_time'))} />
                        <YAxis {...axisY(t('axis_rssi'))} />
                        <Tooltip
                          content={
                            <CustomChartTooltip
                              title={t('metric_rssi')}
                              unit="dBm"
                              decimals={2}
                            />
                          }
                        />
                        <Line type="monotone" dataKey="rssi" stroke="#93c5fd" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .balloons-container {
          position: fixed;
          inset: 0;
          overflow: hidden;
          z-index: 50;
        }

        .balloon {
          position: absolute;
          bottom: -120px;
          width: 50px;
          height: 65px;
          background: radial-gradient(circle at 30% 30%, #ffffffaa, #ff4d6d);
          border-radius: 50%;
          animation: floatUp linear infinite;
        }

        .balloon::after {
          content: '';
          position: absolute;
          top: 65px;
          left: 50%;
          width: 2px;
          height: 40px;
          background: rgba(255,255,255,0.6);
          transform: translateX(-50%);
        }

        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0.9; }
          100% { transform: translateY(-120vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default DataPage;