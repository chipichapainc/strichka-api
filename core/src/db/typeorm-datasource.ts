import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions, Logger } from "typeorm";
import 'dotenv/config'
import { configFactoryEnv } from "src/configs/configs";
import { DatabaseEnvConfig } from "src/configs/db.config";

const config = configFactoryEnv(DatabaseEnvConfig)()

export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  username: config.DATABASE_USERNAME,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE_NAME,
  entities: [
    "dist/**/*.entity.js"
  ],
  logger: "simple-console",
  logging: false, // logs are in DB container or use - process.env.NODE_ENV !== "production"
  migrations: ['dist/db/migrations/*.js'],
  ssl: process.env.DATABASE_SSL === 'true',
  extra: {
    ssl:
      process.env.DATABASE_SSL === 'true'
        ? {
            rejectUnauthorized: false,
          }
        : null,
  },
  synchronize: false,
  migrationsRun: true,
}

export const connectionSource = new DataSource(dbConfig as DataSourceOptions);
