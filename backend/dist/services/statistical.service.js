"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticalService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../modules/supabase/supabase.service");
const statistical_math_logic_1 = require("../logic/statistical-math.logic");
const fso_math_logic_1 = require("../logic/fso-math.logic");
let StatisticalService = class StatisticalService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async calculate(dto) {
        const client = this.supabase.getIotClient();
        console.log('=== Statistical Calculate (IOT Schema) ===');
        console.log('Date Range:', dto.beginDate, 'to', dto.endDate);
        const { data, error } = await client
            .from('raw_meteo')
            .select('value')
            .eq('key', 'fog')
            .gte('ts', dto.beginDate)
            .lte('ts', dto.endDate);
        if (error) {
            console.error('Query Error:', error);
            throw new Error(error.message);
        }
        console.log('Data Count:', data?.length || 0);
        const fogValues = data.map((d) => d.value);
        const statLogic = new statistical_math_logic_1.StatisticalMathLogic(dto.maxDensityOfFog);
        const statResult = statLogic.calculate(fogValues);
        const fsoDto = {
            model: dto.model,
            airTurbulence: dto.airTurbulence,
            adtUtlmMethod: dto.adtUtlmMethod,
            vykon: dto.vykon,
            jednotkaVykonu: dto.jednotkaVykonu,
            citlivost: dto.citlivost,
            priemer: dto.priemer,
            smerovost: dto.smerovost,
            vlnovaDlzka: dto.vlnovaDlzka,
            vzdialenost: dto.vzdialenost,
            jednotkaVzdialenosti: dto.jednotkaVzdialenosti,
            viditelnost: dto.viditelnost,
            dazd: dto.dazd,
            suchySneh: dto.suchySneh,
            mokrySneh: dto.mokrySneh,
            aditivnyUtlm: dto.aditivnyUtlm
        };
        const fsoLogic = new fso_math_logic_1.FsoMathLogic(fsoDto);
        const fsoResult = {
            alfaAtm: fsoLogic.calculateAttenuationParticles(),
            alfaTurb: fsoLogic.calculateAttenuationTurbulence(),
            alfaGeom: fsoLogic.calculateGeometricAttenuation(),
            alfaClearTotal: fsoLogic.calculateClearAtmosphereAttenuation(),
            linkMargin: fsoLogic.calculateLinkMargin(),
            normLinkMargin: fsoLogic.calculateNormalizedLinkMargin(),
        };
        return {
            ...statResult,
            ...fsoResult
        };
    }
    async getGraphData(dto) {
        const client = this.supabase.getIotClient();
        console.log('=== Graph Data (IOT Schema) ===');
        console.log('Type:', dto.type);
        const dbKey = dto.type;
        const { data, error } = await client
            .from('raw_meteo')
            .select('ts, value')
            .eq('key', dbKey)
            .gte('ts', dto.beginDate)
            .lte('ts', dto.endDate)
            .order('ts', { ascending: true });
        if (error) {
            console.error('Query Error:', error);
            throw new Error(error.message);
        }
        return data.map((d) => ({
            time: d.ts,
            [dto.type]: d.value,
        }));
    }
    async getDataForTable(date) {
        const client = this.supabase.getIotClient();
        const start = `${date}T00:00:00.000Z`;
        const end = `${date}T23:59:59.999Z`;
        console.log('=== Get Data For Table ===');
        console.log('Date:', date);
        const { data, error } = await client
            .from('raw_meteo')
            .select('ts, key, value')
            .gte('ts', start)
            .lte('ts', end)
            .in('key', ['fog', 'temperature', 'wind_speed', 'humidity']);
        if (error) {
            console.error('Query Error:', error);
            throw new Error(error.message);
        }
        const grouped = {};
        data.forEach((row) => {
            const timeKey = new Date(row.ts).toISOString();
            if (!grouped[timeKey]) {
                grouped[timeKey] = {
                    time: new Date(row.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    timestamp: row.ts
                };
            }
            if (row.key === 'fog')
                grouped[timeKey].visibility = row.value;
            else if (row.key === 'temperature')
                grouped[timeKey].temp = row.value;
            else if (row.key === 'wind_speed')
                grouped[timeKey].wind = row.value;
            else if (row.key === 'humidity')
                grouped[timeKey].humidity = row.value;
        });
        return Object.values(grouped).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
};
exports.StatisticalService = StatisticalService;
exports.StatisticalService = StatisticalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], StatisticalService);
//# sourceMappingURL=statistical.service.js.map