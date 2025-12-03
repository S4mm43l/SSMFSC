import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../lib/api';

interface DataRow {
  time: string;
  visibility?: number;
  temp?: number;
  wind?: number;
}

const DataPage = () => {
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState('');
  const [data, setData] = useState<DataRow[]>([]);
  const [showData, setShowData] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoadData = async () => {
    if (!selectedDate) {
      alert(language === 'sk' ? "Prosím, vyberte dátum." : "Please select a date.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post('/statistical/table-data', { date: selectedDate });
      setData(res.data);
      setShowData(true);
    } catch (err) {
      console.error("Failed to load data", err);
      alert("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!selectedDate || data.length === 0) return;
    
    let csv = "Čas,Viditeľnosť (km),Teplota (°C),Rýchlosť vetra (m/s)\n";
    data.forEach(row => {
      csv += `${row.time},${row.visibility || ''},${row.temp || ''},${row.wind || ''}\n`;
    });
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `data_${selectedDate}.csv`;
    link.click();
  };

  return (
    <div className="flex items-center min-h-[calc(100vh-200px)] bg-linear-to-br from-[#1043b3] to-[#1455e2] text-white p-6">
      <section className="w-full max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-16 grid gap-10 md:grid-cols-2 items-start">
     
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold mb-6">
            {t('data_title')}
          </h1>
          <p className="text-sm md:text-base leading-relaxed max-w-xl text-slate-100">
            {t('data_intro')}
          </p>
        </div>

     
        <div className="w-full bg-white/10 rounded-3xl p-5 md:p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <h2 className="text-lg md:text-xl font-semibold mb-4">{t('data_select_title')}</h2>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1455e2]"
            />
            <button
              onClick={handleLoadData}
              disabled={loading}
              className="rounded-full bg-linear-to-r from-[#1043b3] to-[#1455e2] px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50"
            >
              {loading ? "Loading..." : t('loadDataBtn')}
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl bg-white/5">
            <table className="min-w-full text-left text-xs md:text-sm">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-3 py-2 font-semibold">{t('th_time')}</th>
                  <th className="px-3 py-2 font-semibold">{t('th_vis')}</th>
                  <th className="px-3 py-2 font-semibold">{t('th_temp')}</th>
                  <th className="px-3 py-2 font-semibold">{t('th_wind')}</th>
                </tr>
              </thead>
              <tbody>
                {showData ? (
                  data.length > 0 ? (
                    data.map((row, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 border-t border-white/10">{row.time}</td>
                        <td className="px-3 py-2 border-t border-white/10">{row.visibility !== undefined ? row.visibility : '-'}</td>
                        <td className="px-3 py-2 border-t border-white/10">{row.temp !== undefined ? row.temp : '-'}</td>
                        <td className="px-3 py-2 border-t border-white/10">{row.wind !== undefined ? row.wind : '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-white/80">
                        No data found for this date.
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-white/80">
                      {t('data_placeholder')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleDownload}
            disabled={!showData || data.length === 0}
            className="mt-4 rounded-full border border-white/50 px-4 py-2 text-xs md:text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition"
          >
            {t('downloadBtn')}
          </button>
        </div>
      </section>
    </div>
  );
};

export default DataPage;
