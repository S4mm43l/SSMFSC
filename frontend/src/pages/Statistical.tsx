import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import InputGroup from "../components/InputGroup";
import api from "../lib/api";
import {
  EnumModel,
  EnumAirTurbulence,
  EnumCalcMethod,
  type FsoSystem,
} from "../types";

const Statistical = () => {

  const [distance, setDistance] = useState(50);
  const [distanceUnit, setDistanceUnit] = useState(1); 
  const [maxDensity, setMaxDensity] = useState(0);
  

  const [beginDate, setBeginDate] = useState("2015-01-01");
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  
  const [systems, setSystems] = useState<FsoSystem[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<number | string>("");
  
  const [txPower, setTxPower] = useState(1.3);
  const [txPowerUnit, setTxPowerUnit] = useState(0); 
  const [rxSensitivity, setRxSensitivity] = useState(0);
  const [rxLensDiameter, setRxLensDiameter] = useState(0);
  const [directivity, setDirectivity] = useState(0);
  const [wavelength, setWavelength] = useState(0);

 
  const [model] = useState<EnumModel>(EnumModel.Kim);
  const [turbulence] = useState<EnumAirTurbulence>(EnumAirTurbulence.VeryWeak); 
  const [calcMethod] = useState<EnumCalcMethod>(EnumCalcMethod.weatherCondition);
  const [rain] = useState(0);
  const [drySnow] = useState(0);
  const [wetSnow] = useState(0);


  const [graphType, setGraphType] = useState<"fog" | "temperature" | "humidity">("fog");
  const [graphData, setGraphData] = useState<any[]>([]);
  const [results, setResults] = useState<any>(null);
  const [loadingCalc, setLoadingCalc] = useState(false);
  const [loadingGraph, setLoadingGraph] = useState(false);

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      const res = await api.get("/systems/fso");
      setSystems(res.data);
    } catch (err) {
      console.error("Failed to fetch systems", err);
    }
  };

  const handleSystemChange = (id: string) => {
    setSelectedSystemId(id);
    const sys = systems.find((s) => s.id === parseInt(id));
    if (sys) {
      setTxPower(sys.txPower);
      setTxPowerUnit(sys.txPowerUnit === "mW" ? 0 : 1);
      setRxSensitivity(sys.rxSensitivity);
      setRxLensDiameter(sys.rxLensDiameter);
      setDirectivity(sys.directivity);
      setWavelength(sys.wavelength);
    }
  };

  const handleCalculate = async () => {
    setLoadingCalc(true);
    try {
      const payload = {
        beginDate,
        endDate,
        maxDensityOfFog: maxDensity,

        model,
        airTurbulence: turbulence,
        adtUtlmMethod: calcMethod,
        vykon: txPower,
        jednotkaVykonu: txPowerUnit,
        citlivost: rxSensitivity,
        priemer: rxLensDiameter,
        smerovost: directivity,
        vlnovaDlzka: wavelength,
        vzdialenost: distance,
        jednotkaVzdialenosti: distanceUnit,
        viditelnost: 0,
        dazd: rain,
        suchySneh: drySnow,
        mokrySneh: wetSnow,
        aditivnyUtlm: 0,
      };

      const res = await api.post("/statistical/calculate", payload);
      setResults(res.data);

      await handleLoadGraph('fog');
    } catch (err) {
      console.error("Calculation failed", err);
      alert("Calculation failed. Check console.");
    } finally {
      setLoadingCalc(false);
    }
  };

  const handleLoadGraph = async (type: "fog" | "temperature" | "humidity") => {
    setGraphType(type);
    setLoadingGraph(true);
    try {
      const res = await api.post("/statistical/graph-data", {
        beginDate,
        endDate,
        type,
      });

      const formatted = res.data.map((d: any) => ({
        ...d,
        time: new Date(d.time).toLocaleDateString(),
      }));

      setGraphData(formatted);
    } catch (err) {
      console.error("Graph load failed", err);
      alert("Failed to load graph data.");
    } finally {
      setLoadingGraph(false);
    }
  };

  const formatValue = (value: number | string | undefined, decimals: number = 4): string => {
    if (value === undefined || value === null) return "NaN";

    if (typeof value === 'string') {
      if (value === 'NaN' || value === 'Infinity' || value === '-Infinity') {
        return value;
      }
   
      const parsed = parseFloat(value);
      if (isNaN(parsed)) return "NaN";
      return parsed.toFixed(decimals);
    }
    

    if (isNaN(value)) return "NaN";
    if (value === Infinity) return "Infinity";
    if (value === -Infinity) return "-Infinity";
    return value.toFixed(decimals);
  };

  return (
    <div className="h-full p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
     
        <div className="lg:col-span-4 space-y-4">
          
         
          <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 border-b pb-1">
              Selection
            </h3>
            <InputGroup
              label="Distance"
              value={distance}
              onChange={setDistance}
              unitOptions={[
                { label: "km", value: 0 },
                { label: "m", value: 1 },
              ]}
              selectedUnit={distanceUnit}
              onUnitChange={setDistanceUnit}
              compact
            />
            <InputGroup
              label="Max. density of fog"
              value={maxDensity}
              onChange={setMaxDensity}
              unit="g/m3"
              compact
            />
            
            <div className="mt-4 border-t pt-2">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Dates for computing</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">Begin Date</label>
                  <input
                    type="date"
                    value={beginDate}
                    onChange={(e) => setBeginDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-xs p-1 border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-xs p-1 border"
                  />
                </div>
              </div>
            </div>
          </div>

         
          <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 border-b pb-1">
              FSO System
            </h3>
            
            <div className="mb-3 p-2 rounded">
              <label className="block text-xs font-medium text-gray-700 mb-1">Select System</label>
              <select
                value={selectedSystemId}
                onChange={(e) => handleSystemChange(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-xs p-1 border"
              >
                <option value="">System not selected</option>
                {systems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.companyName})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-500 mb-1">Device Properties</h4>
              <InputGroup
                label="Tx Power"
                value={txPower}
                onChange={setTxPower}
                unitOptions={[
                  { label: "mW", value: 0 },
                  { label: "dBm", value: 1 },
                ]}
                selectedUnit={txPowerUnit}
                onUnitChange={setTxPowerUnit}
                compact
              />
              <InputGroup
                label="Rx Sensitivity"
                value={rxSensitivity}
                onChange={setRxSensitivity}
                unit="dBm"
                compact
              />
              <InputGroup
                label="Rx Lens Diameter"
                value={rxLensDiameter}
                onChange={setRxLensDiameter}
                unit="cm"
                compact
              />
              <InputGroup
                label="Directivity"
                value={directivity}
                onChange={setDirectivity}
                unit="mrad"
                compact
              />
              <InputGroup
                label="Laser Wavelength"
                value={wavelength}
                onChange={setWavelength}
                unit="nm"
                compact
              />
            </div>
          </div>

        </div>

     
        <div className="lg:col-span-8 flex flex-col gap-4">
          
      
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex-1 min-h-[400px] flex flex-col">
             <div className="flex-1 min-h-0 relative">
               {loadingGraph ? (
                 <div className="absolute inset-0 flex items-center justify-center text-gray-500">Loading...</div>
               ) : graphData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={graphData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} />
                     <XAxis dataKey="time" tick={{fontSize: 10}} />
                     <YAxis tick={{fontSize: 10}} />
                     <Tooltip />
                     <Line type="monotone" dataKey={graphType} stroke="#10b981" dot={false} strokeWidth={1} />
                   </LineChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                   <div className="grid grid-cols-6 grid-rows-6 w-full h-full border border-gray-100">
                 
                   </div>
                 </div>
               )}
             </div>
             <div className="text-center text-xs text-gray-500 mt-2">Date</div>
          </div>

      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         
            <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 border-b pb-1">
                Displaying Graphs
              </h3>
              <div className="flex gap-2">
                <div className="flex flex-col gap-2 w-1/2">
                  <button onClick={() => handleLoadGraph("fog")} className="px-3 py-1 text-xs border rounded hover:bg-gray-50">Fog</button>
                  <button onClick={() => handleLoadGraph("humidity")} className="px-3 py-1 text-xs border rounded hover:bg-gray-50">Humidity</button>
                  <button onClick={() => handleLoadGraph("temperature")} className="px-3 py-1 text-xs border rounded hover:bg-gray-50">Temperature</button>
                </div>
                <div className="w-1/2">
                   <button 
                     onClick={() => setGraphData([])}
                     className="w-full h-full border rounded flex items-center justify-center text-xs hover:bg-gray-50"
                   >
                     Clear graph
                   </button>
                </div>
              </div>
            </div>

       
            <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 border-b pb-1">
                Results
              </h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>α atm:</span>
                  <span className="font-mono">{formatValue(results?.alfaAtm)} dB</span>
                </div>
                <div className="flex justify-between">
                  <span>α turb:</span>
                  <span className="font-mono">{formatValue(results?.alfaTurb)} dB</span>
                </div>
                <div className="flex justify-between">
                  <span>α geom:</span>
                  <span className="font-mono">{formatValue(results?.alfaGeom)} dB</span>
                </div>
                <div className="flex justify-between">
                  <span>α clear total:</span>
                  <span className="font-mono">{formatValue(results?.alfaClearTotal)} dB</span>
                </div>
                <div className="flex justify-between">
                  <span>M (Link Margin):</span>
                  <span className="font-mono">{formatValue(results?.linkMargin)} dB</span>
                </div>
                <div className="flex justify-between">
                  <span>M1 (Normalized M):</span>
                  <span className="font-mono">{formatValue(results?.normLinkMargin)} dB/km</span>
                </div>
                <div className="flex justify-between">
                  <span>Fade probability:</span>
                  <span className="font-mono">{formatValue(results?.fadeProbability, 6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Link availability:</span>
                  <span className="font-mono">{formatValue(results?.linkAvailability, 2)} %</span>
                </div>
                <div className="flex justify-between">
                  <span>Link unavailability:</span>
                  <span className="font-mono">{formatValue(results?.numSecondsUnavailability, 0)} sec</span>
                </div>
              </div>
            </div>

          </div>

          <button
            onClick={handleCalculate}
            disabled={loadingCalc}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded shadow hover:bg-gray-50 text-sm font-medium"
          >
            {loadingCalc ? "Calculating..." : "Calculate"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Statistical;
