import {DataSource} from 'typeorm';
import {config} from "../Config";

export const ApltNotesDataSource = new DataSource({
  type: 'postgres',
  host: config.dbHost,
  port: Number(config.dbPort),
  username: config.dbUser,
  password: config.dbPassword,
  database: 'aplt-notes',
  entities: ['src/DataSource/Entities/*.ts'],
  synchronize: true,
  logging: false,
  name: 'aplt-notes-rds-data-source'
});
