"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseService = class SupabaseService {
    supabase;
    iotSupabase;
    onModuleInit() {
        const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
        const supabaseKey = process.env.API_KEY ||
            process.env.SUPABASE_KEY ||
            process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase URL and Key must be provided in .env');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        this.iotSupabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
            db: { schema: 'iot' },
        });
    }
    getClient() {
        return this.supabase;
    }
    getIotClient() {
        return this.iotSupabase;
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)()
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map