import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MigrationService implements OnModuleInit {
  private readonly logger = new Logger(MigrationService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const dbUrl = this.configService.get<string>('DATABASE_URL');
    if (!dbUrl) {
      this.logger.warn(
        'DATABASE_URL not found in .env. Skipping automatic migrations.',
      );
      this.logger.warn(
        'Please add DATABASE_URL=postgres://user:pass@host:port/db to .env for auto-migrations.',
      );
      return;
    }

    const client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    });

    try {
      await client.connect();

      const migrationsPath = path.resolve(
        process.cwd(),
        'src/database/migrations',
      );
      if (!fs.existsSync(migrationsPath)) {
        this.logger.warn(`Migrations directory not found: ${migrationsPath}`);
        return;
      }

      this.logger.log(`Loading SQL migrations from: ${migrationsPath}`);
      const files = fs.readdirSync(migrationsPath).sort();

      for (const file of files) {
        if (!file.endsWith('.sql')) continue;

        const filePath = path.join(migrationsPath, file);
        const content = fs.readFileSync(filePath, 'utf8');

        this.logger.log(`Executing migration: ${file}`);

        try {
          await client.query(content);
          this.logger.log(`✔ Successfully executed ${file}`);
        } catch (err) {
          this.logger.error(`✖ Error executing ${file}: ${err.message}`);
        }
      }
    } catch (err) {
      this.logger.error(
        `Failed to connect to database for migrations: ${err.message}`,
      );
    } finally {
      await client.end();
    }
  }
}
