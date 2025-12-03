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
var MigrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const fs = require("fs");
const path = require("path");
const config_1 = require("@nestjs/config");
let MigrationService = MigrationService_1 = class MigrationService {
    configService;
    logger = new common_1.Logger(MigrationService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        const dbUrl = this.configService.get('DATABASE_URL');
        if (!dbUrl) {
            this.logger.warn('DATABASE_URL not found in .env. Skipping automatic migrations.');
            this.logger.warn('Please add DATABASE_URL=postgres://user:pass@host:port/db to .env for auto-migrations.');
            return;
        }
        const client = new pg_1.Client({
            connectionString: dbUrl,
            ssl: { rejectUnauthorized: false },
        });
        try {
            await client.connect();
            const migrationsPath = path.resolve(process.cwd(), 'src/database/migrations');
            if (!fs.existsSync(migrationsPath)) {
                this.logger.warn(`Migrations directory not found: ${migrationsPath}`);
                return;
            }
            this.logger.log(`Loading SQL migrations from: ${migrationsPath}`);
            const files = fs.readdirSync(migrationsPath).sort();
            for (const file of files) {
                if (!file.endsWith('.sql'))
                    continue;
                const filePath = path.join(migrationsPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                this.logger.log(`Executing migration: ${file}`);
                try {
                    await client.query(content);
                    this.logger.log(`✔ Successfully executed ${file}`);
                }
                catch (err) {
                    this.logger.error(`✖ Error executing ${file}: ${err.message}`);
                }
            }
        }
        catch (err) {
            this.logger.error(`Failed to connect to database for migrations: ${err.message}`);
        }
        finally {
            await client.end();
        }
    }
};
exports.MigrationService = MigrationService;
exports.MigrationService = MigrationService = MigrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MigrationService);
//# sourceMappingURL=migration.service.js.map