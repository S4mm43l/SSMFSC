import { useState, useEffect } from "react";
import InputGroup from "../components/InputGroup";
import api from "../lib/api";
import {
  EnumModel,
  EnumAirTurbulence,
  EnumCalcMethod,
  type RfSystem,
} from "../types";

const SteadyRf = () => {
  const [distance, setDistance] = useState(0.05);
  const [distanceUnit, setDistanceUnit] = useState(0);
  const [calcMethod, setCalcMethod] = useState<EnumCalcMethod>(
    EnumCalcMethod.weatherCondition
  );
  const [visibility, setVisibility] = useState(0.05);
  const [model, setModel] = useState<EnumModel>(EnumModel.Kim);
  const [turbulence, setTurbulence] = useState<EnumAirTurbulence>(
    EnumAirTurbulence.Calm
  );
  const [rain, setRain] = useState(0);
  const [drySnow, setDrySnow] = useState(0);
  const [wetSnow, setWetSnow] = useState(0);
  const [additiveAttenuation, setAdditiveAttenuation] = useState(0);

  const [fsoTxPower, setFsoTxPower] = useState(1.3);
  const [fsoTxPowerUnit, setFsoTxPowerUnit] = useState(0);
  const [fsoRxSensitivity, setFsoRxSensitivity] = useState(-40);
  const [fsoRxLensDiameter, setFsoRxLensDiameter] = useState(20);
  const [fsoDirectivity, setFsoDirectivity] = useState(4);
  const [fsoWavelength, setFsoWavelength] = useState(850);

  const [rfTxPower, setRfTxPower] = useState(0);
  const [rfTxPowerUnit, setRfTxPowerUnit] = useState(0);
  const [rfRxSensitivity, setRfRxSensitivity] = useState(0);
  const [rfFrequency, setRfFrequency] = useState(0);
  const [rfGain, setRfGain] = useState(0);

  const [systems, setSystems] = useState<RfSystem[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<number | string>("");

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      const res = await api.get("/systems/rf");
      setSystems(res.data);
    } catch (err) {
      console.error("Failed to fetch systems", err);
    }
  };

  const handleSystemChange = (id: string) => {
    setSelectedSystemId(id);
    const sys = systems.find((s) => s.id === parseInt(id));
    if (sys) {
      setRfTxPower(sys.txPower);

      setRfTxPowerUnit(sys.txPowerUnit === "W" ? 0 : 1);
      setRfRxSensitivity(sys.rxSensitivity);
      setRfFrequency(sys.frequency);
      setRfGain(sys.gain);
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const payload = {
        model,
        airTurbulence: turbulence,
        adtUtlmMethod: calcMethod,
        vykon: fsoTxPower,
        jednotkaVykonu: fsoTxPowerUnit,
        citlivost: fsoRxSensitivity,
        priemer: fsoRxLensDiameter,
        smerovost: fsoDirectivity,
        vlnovaDlzka: fsoWavelength,
        vzdialenost: distance,
        jednotkaVzdialenosti: distanceUnit,
        viditelnost: visibility,
        dazd: rain,
        suchySneh: drySnow,
        mokrySneh: wetSnow,
        aditivnyUtlm: 0,

        txPowerRF: rfTxPower,
        unitTxPowerRF: rfTxPowerUnit,
        rxSensitivityRF: rfRxSensitivity,
        frequencyRF: rfFrequency,
        gainRF: rfGain,
      };

      const res = await api.post("/rf/calculate", payload);
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
              <InputGroup
                label="Visibility"
                value={visibility}
                onChange={setVisibility}
                unit="km"
                compact
              />

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


        <div className="w-full lg:w-3/4 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-center p-4 relative overflow-hidden">
           <h3 className="absolute top-4 left-4 text-xl font-bold text-gray-800">
            Hybrid FSO/RF Link Visualization
          </h3>
          <div className="w-full max-w-3xl">
            <img 
              src="/src/assets/FSORFImage.png" 
              alt="Hybrid FSO/RF Link Diagram" 
              className="w-full h-auto object-contain max-h-[400px]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-1/2">
     
        <div className="w-full lg:w-1/4 bg-white p-3 rounded-lg shadow border border-gray-200 text-sm">
          <h3 className="font-bold text-gray-700 mb-2 border-b pb-1 text-xs uppercase">
            FSO System (Primary)
          </h3>
          <div className="space-y-2">
            <InputGroup
              label="Tx Power"
              value={fsoTxPower}
              onChange={setFsoTxPower}
              unitOptions={[
                { label: "mW", value: 0 },
                { label: "dBm", value: 1 },
              ]}
              selectedUnit={fsoTxPowerUnit}
              onUnitChange={setFsoTxPowerUnit}
              compact
            />
            <InputGroup
              label="Rx Sensitivity"
              value={fsoRxSensitivity}
              onChange={setFsoRxSensitivity}
              unit="dBm"
              compact
            />
            <InputGroup
              label="Rx Lens Diameter"
              value={fsoRxLensDiameter}
              onChange={setFsoRxLensDiameter}
              unit="cm"
              compact
            />
            <InputGroup
              label="Directivity"
              value={fsoDirectivity}
              onChange={setFsoDirectivity}
              unit="mrad"
              compact
            />
            <InputGroup
              label="Wavelength"
              value={fsoWavelength}
              onChange={setFsoWavelength}
              unit="nm"
              compact
            />
          </div>
        </div>

     
        <div className="w-full lg:w-1/4 bg-white p-3 rounded-lg shadow border border-gray-200 text-sm">
          <h3 className="font-bold text-gray-700 mb-2 border-b pb-1 text-xs uppercase">
            RF System (Backup)
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
              value={rfTxPower}
              onChange={setRfTxPower}
              unitOptions={[
                { label: "W", value: 0 },
                { label: "dBm", value: 1 },
              ]}
              selectedUnit={rfTxPowerUnit}
              onUnitChange={setRfTxPowerUnit}
              compact
            />
            <InputGroup
              label="Rx Sensitivity"
              value={rfRxSensitivity}
              onChange={setRfRxSensitivity}
              unit="dBm"
              compact
            />
            <InputGroup
              label="Frequency"
              value={rfFrequency}
              onChange={setRfFrequency}
              unit="MHz"
              compact
            />
            <InputGroup
              label="Gain"
              value={rfGain}
              onChange={setRfGain}
              unit="dB"
              compact
            />
          </div>
        </div>

        <div className="w-full lg:w-2/4 bg-white p-3 rounded-lg shadow border border-gray-200 text-sm flex flex-col">
           <h3 className="font-bold text-gray-700 mb-2 border-b pb-1 text-xs uppercase">
            Results
          </h3>
          
          <div className="flex-1">
          {results ? (
            <div className="grid grid-cols-2 gap-4">
           
              <div className="space-y-1">
                 <h4 className="font-bold text-gray-600 text-xs border-b">FSO</h4>
                 <div className="flex justify-between text-xs">
                   <span>Link Margin:</span>
                   <span className="font-mono font-bold">{formatValue(results.fso.linkMargin)} dB</span>
                 </div>
                 <div className="flex justify-between text-xs">
                   <span>Total Atten.:</span>
                   <span className="font-mono">{formatValue(results.fso.alfaAddTotalNorm)} dB/km</span>
                 </div>
                 <div className="flex justify-between text-xs">
                   <span>Max Dist.:</span>
                   <span className="font-mono">{results.fso.maxLinkDistance.toFixed(2)} m</span>
                 </div>
                 
                 <div className="mt-2 flex items-center justify-between bg-gray-50 p-1 rounded">
                   <span className="text-xs font-medium">Status:</span>
                   {results.fso.linkStatus === "Link OK" ? (
                      <span className="text-green-600 font-bold text-xs">✓ OK</span>
                    ) : (
                      <span className="text-red-600 font-bold text-xs">✗ DOWN</span>
                    )}
                 </div>
              </div>

             
              <div className="space-y-1">
                 <h4 className="font-bold text-gray-600 text-xs border-b">RF</h4>
                 <div className="flex justify-between text-xs">
                   <span>Si (Rx Power):</span>
                   <span className="font-mono font-bold">{formatValue(results.rf?.si)} dBm</span>
                 </div>
                 <div className="flex justify-between text-xs">
                   <span>FSL:</span>
                   <span className="font-mono">{formatValue(results.rf?.fsl)} dB</span>
                 </div>
                 <div className="flex justify-between text-xs">
                   <span>Weather Att.:</span>
                   <span className="font-mono">{formatValue(results.rf?.weatherAttenuation)} dB</span>
                 </div>
                  <div className="flex justify-between text-xs">
                   <span>Max Dist.:</span>
                   <span className="font-mono">{results.rf?.maxLinkDistance?.toFixed(2) || "0.00"} m</span>
                 </div>
                 
                 <div className="mt-2 flex items-center justify-between bg-gray-50 p-1 rounded">
                   <span className="text-xs font-medium">Status:</span>
                   {results.rf?.linkStatus === "Link OK" ? (
                      <span className="text-green-600 font-bold text-xs">✓ OK</span>
                    ) : (
                      <span className="text-red-600 font-bold text-xs">✗ DOWN</span>
                    )}
                 </div>
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

export default SteadyRf;
