import { Injectable } from '@nestjs/common';
import Knex from 'knex';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { execSync } from 'child_process';

@Injectable()
export class KnexService {
  private knex: Knex.Knex;
  private knexConfig: Knex.Knex.Config;

  constructor(private readonly configService: ConfigService) {
    this.printNpmPath();
    this.initializeKnex();
  }

  private initializeKnex(): void {
    const migrationsDirectory = path.resolve(
      path.join(__dirname, './migrations'),
    );
    const seedsDirectory = path.resolve(path.join(__dirname, './seeds'));
    const baseConfig: Knex.Knex.Config = {
      migrations: {
        tableName: 'knex_migrations',
        directory: migrationsDirectory,
      },
      seeds: {
        directory: seedsDirectory,
      },
    };
    const databaseurl = this.configService.get<string>('DATABASE_URL', '');
    if (databaseurl.length > 0) {
      this.knexConfig = {
        ...baseConfig,
        client: 'mysql2',
        connection: databaseurl,
      };
    } else {
      const filename = 'agency_db.sqlite';
      this.knexConfig = {
        ...baseConfig,
        client: 'sqlite3',
        connection: { filename },
        useNullAsDefault: true,
      };
    }
    this.knex = Knex(this.knexConfig);
  }

  private printNpmPath() {
    try {
      const npmPath = execSync('which npm').toString().trim(); // Use 'where npm' on Windows
      console.log('NPM Path:', npmPath);
    } catch (error) {
      console.error('Error fetching npm path:', error.message);
    }
  }

  async runMigrations(): Promise<boolean> {
    try {
      const connection = this.knexConfig.connection;
      if (typeof connection === 'string') {
        console.log(
          'Running knexfile.js with process.env.DATABASE_URL = ',
          this.obfuscateDatabaseString(connection),
        );
      } else {
        const filename = (connection as Knex.Knex.Sqlite3ConnectionConfig)
          .filename;
        if (filename?.length > 0) {
          console.log(
            'Running knexfile.js with process.env.DATABASE_FILE =',
            (connection as Knex.Knex.Sqlite3ConnectionConfig).filename,
          );
        } else {
          console.error('Knex configuration not provided');
          return false;
        }
      }
      console.log('Running migrations...');
      await this.knex.migrate.latest({ loadExtensions: ['.js'] }); // Run latest migrations
      console.log('Migrations completed');
      return true;
    } catch (error) {
      console.error('Error running migrations:', error);
      return false;
    }
  }

  private obfuscateDatabaseString(connectionString) {
    return connectionString.replace(/:\/\/(.*?):(.*?)@/, (match, user) => {
      return `://${user}:*****@`;
    });
  }

  async seedDatabase(): Promise<boolean> {
    try {
      console.log('Running seeds...');
      await this.knex.seed.run(); // Run seeds
      console.log('Seeds completed');
      return true;
    } catch (error) {
      console.error('Error running seeds:', error);
      return false;
    }
  }
}
