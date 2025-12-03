import { useState, useEffect } from "react";
import InputGroup from "../components/InputGroup";
import api from "../lib/api";
import {
  EnumModel,
  EnumAirTurbulence,
  EnumCalcMethod,
  type FsoSystem,
} from "../types";

const SteadyFso = () => {
  const [distance, setDistance] = useState(0.05);
  const [distanceUnit, setDistanceUnit] = useState(0);

  const [calcMethod, setCalcMethod] = useState<EnumCalcMethod>(
    EnumCalcMethod.weatherCondition
  );

  const [visibility, setVisibility] = useState(0.05);

  const [additiveAttenuation, setAdditiveAttenuation] = useState(0);

  const [model, setModel] = useState<EnumModel>(EnumModel.Kim);
  const [turbulence, setTurbulence] = useState<EnumAirTurbulence>(
    EnumAirTurbulence.Calm
  );

  const [rain, setRain] = useState(0);
  const [drySnow, setDrySnow] = useState(0);
  const [wetSnow, setWetSnow] = useState(0);

  const [txPower, setTxPower] = useState(1.3);
  const [txPowerUnit, setTxPowerUnit] = useState(0);
  const [rxSensitivity, setRxSensitivity] = useState(-40);
  const [rxLensDiameter, setRxLensDiameter] = useState(20);
  const [directivity, setDirectivity] = useState(4);
  const [wavelength, setWavelength] = useState(850);

  const [systems, setSystems] = useState<FsoSystem[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<number | string>("");

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const payload = {
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
        viditelnost: visibility,
        dazd: rain,
        suchySneh: drySnow,
        mokrySneh: wetSnow,
        aditivnyUtlm: additiveAttenuation,
      };

      const res = await api.post("/fso/calculate", payload);
      setResults(res.data);
    } catch (err) {
      console.error("Calculation failed", err);
      alert("Calculation failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const [showVisibilityTable, setShowVisibilityTable] = useState(false);

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
    <div className="h-full p-4 flex flex-col gap-4">
    
      {showVisibilityTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowVisibilityTable(false)}>
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-auto relative">
            <button 
              onClick={() => setShowVisibilityTable(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-xl"
            >
              &times;
            </button>
            <img src="/src/assets/tableVisibilityCode.png" alt="Visibility Codes" className="max-w-full h-auto" />
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 h-1/2">
 
        <div className="w-full lg:w-1/4 bg-white p-3 rounded-lg shadow border border-gray-200 text-sm">
          <h3 className="font-bold text-gray-700 mb-2 border-b pb-1 text-xs uppercase">
            Channel Properties
          </h3>

          <div className="space-y-2">
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

            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Calculation Method
              </label>
              <div className="flex flex-col space-y-0.5">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-green-600 h-3 w-3"
                    checked={calcMethod === EnumCalcMethod.weatherCondition}
                    onChange={() =>
                      setCalcMethod(EnumCalcMethod.weatherCondition)
                    }
                  />
                  <span className="ml-2 text-xs">Weather Conditions</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-green-600 h-3 w-3"
                    checked={calcMethod === EnumCalcMethod.additiveAttenuation}
                    onChange={() =>
                      setCalcMethod(EnumCalcMethod.additiveAttenuation)
                    }
                  />
                  <span className="ml-2 text-xs">Additive Attenuation</span>
                </label>
              </div>
            </div>

            {calcMethod === EnumCalcMethod.weatherCondition ? (
              <>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <InputGroup
                      label="Visibility"
                      value={visibility}
                      onChange={setVisibility}
                      unit="km"
                      compact
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value as EnumModel)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-xs p-1 border"
                    >
                      <option value={EnumModel.Kim}>Kim</option>
                      <option value={EnumModel.Kruse}>Kruse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Turbulence
                    </label>
                    <select
                      value={turbulence}
                      onChange={(e) =>
                        setTurbulence(e.target.value as EnumAirTurbulence)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-xs p-1 border"
                    >
                      <option value={EnumAirTurbulence.Calm}>Calm</option>
                      <option value={EnumAirTurbulence.VeryWeak}>
                        Very Weak
                      </option>
                      <option value={EnumAirTurbulence.Weak}>Weak</option>
                    </select>
                  </div>
                </div>

                <InputGroup
                  label="Rain"
                  value={rain}
                  onChange={setRain}
                  unit="mm/h"
                  compact
                />
                <InputGroup
                  label="Dry Snow"
                  value={drySnow}
                  onChange={setDrySnow}
                  unit="mm/h"
                  compact
                />
                <InputGroup
                  label="Wet Snow"
                  value={wetSnow}
                  onChange={setWetSnow}
                  unit="mm/h"
                  compact
                />
              </>
            ) : (
              <div className="flex items-end gap-2">
                <div className="flex-1">
                   <InputGroup
                    label="Attenuation"
                    value={additiveAttenuation}
                    onChange={setAdditiveAttenuation}
                    unit="dB/km"
                    compact
                  />
                </div>
                <button 
                  onClick={() => setShowVisibilityTable(true)}
                  className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded border border-gray-300 hover:bg-gray-300 mb-1"
                >
                  Show tab
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-3/4 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-center p-4 relative overflow-hidden">
             <h3 className="absolute top-4 left-4 text-xl font-bold text-gray-800">
            FSO Link Visualization
          </h3>
          <div className="w-full max-w-3xl">
            <img 
              src="/src/assets/program1.png" 
              alt="FSO Link Diagram" 
              className="w-full h-auto object-contain max-h-[400px]"
            />
          </div>
        </div>
      </div>

    
      <div className="flex flex-col lg:flex-row gap-4 h-1/2">
   
        <div className="w-full lg:w-1/4 bg-white p-3 rounded-lg shadow border border-gray-200 text-sm">
          <h3 className="font-bold text-gray-700 mb-2 border-b pb-1 text-xs uppercase">
            FSO System
          </h3>

          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Select System
            </label>
            <select
              value={selectedSystemId}
              onChange={(e) => handleSystemChange(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-xs p-1 border"
            >
              <option value="">-- Custom --</option>
              {systems.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.companyName})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
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
              label="Wavelength"
              value={wavelength}
              onChange={setWavelength}
              unit="nm"
              compact
            />
          </div>
        </div>

     
        <div className="w-full lg:w-1/4 bg-white p-3 rounded-lg shadow border border-gray-200 text-sm">
           <h3 className="font-bold text-gray-700 mb-2 border-b pb-1 text-xs uppercase">
            Attenuations
          </h3>
          {results ? (
            <div className="space-y-1">
               <div className="flex justify-between border-b border-gray-100 py-1">
                 <span className="text-gray-600">Atmospheric:</span>
                 <span className="font-mono">{formatValue(results.alfaAtm)} dB</span>
               </div>
               <div className="flex justify-between border-b border-gray-100 py-1">
                 <span className="text-gray-600">Turbulence:</span>
                 <span className="font-mono">{formatValue(results.alfaTurb)} dB</span>
               </div>
               <div className="flex justify-between border-b border-gray-100 py-1">
                 <span className="text-gray-600">Geometric:</span>
                 <span className="font-mono">{formatValue(results.alfaGeom)} dB</span>
               </div>
               <div className="flex justify-between border-b border-gray-100 py-1 font-semibold bg-gray-50">
                 <span className="text-gray-700">Clear Total:</span>
                 <span className="font-mono">{formatValue(results.alfaClearTotal)} dB</span>
               </div>
               
               <div className="pt-2"></div>
               
               <div className="flex justify-between border-b border-gray-100 py-1">
                 <span className="text-gray-600">Scattering:</span>
                 <span className="font-mono">{formatValue(results.alfaAtmAddNorm)} dB</span>
               </div>
               <div className="flex justify-between border-b border-gray-100 py-1">
                 <span className="text-gray-600">Rain:</span>
                 <span className="font-mono">{formatValue(results.alfaRainNorm)} dB/km</span>
               </div>
               <div className="flex justify-between border-b border-gray-100 py-1">
                 <span className="text-gray-600">Dry Snow:</span>
                 <span className="font-mono">{formatValue(results.alfaSnowDryNorm)} dB/km</span>
               </div>
               <div className="flex justify-between border-b border-gray-100 py-1">
                 <span className="text-gray-600">Wet Snow:</span>
                 <span className="font-mono">{formatValue(results.alfaSnowWetNorm)} dB/km</span>
               </div>
               <div className="flex justify-between border-t-2 border-gray-200 py-1 font-bold bg-green-50 mt-1">
                 <span className="text-gray-800">Total Add. Atten.:</span>
                 <span className="font-mono">{formatValue(results.alfaAddTotalNorm)} dB/km</span>
               </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">
              Run calculation to see results
            </div>
          )}
        </div>

      
        <div className="w-full lg:w-2/4 bg-white p-3 rounded-lg shadow border border-gray-200 text-sm flex flex-col">
           <h3 className="font-bold text-gray-700 mb-2 border-b pb-1 text-xs uppercase">
            Results
          </h3>
          
          <div className="flex-1">
          {results ? (
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                   <span className="text-gray-600 font-medium">Link Margin:</span>
                   <span className="font-mono font-bold text-lg">{formatValue(results.linkMargin)} dB</span>
                 </div>
                 <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                   <span className="text-gray-600 font-medium">Max Distance:</span>
                   <span className="font-mono font-bold text-lg">{results.maxLinkDistance.toFixed(2)} m</span>
                 </div>
               </div>
               
               <div className="flex flex-col items-center justify-center bg-gray-50 rounded p-2">
                 <span className="text-gray-600 font-medium mb-1">Link Status</span>
                 {results.linkStatus === "Link OK" ? (
                    <div className="flex flex-col items-center text-green-600">
                      <img src="/src/assets/ok.png" alt="OK" className="h-12 w-12 mb-1" />
                      <span className="font-bold text-lg">OPERATIONAL</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-red-600">
                      <img src="/src/assets/down.png" alt="Down" className="h-12 w-12 mb-1" />
                      <span className="font-bold text-lg">DOWN</span>
                    </div>
                  )}
               </div>
            </div>
          ) : (
             <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">
              Run calculation to see results
            </div>
          )}
          </div>

          <div className="mt-4">
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded shadow hover:bg-gray-50 text-sm font-medium"
            >
              {loading ? "Calculating..." : "Calculate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SteadyFso;
