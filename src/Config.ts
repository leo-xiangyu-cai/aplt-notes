import dotenv from "dotenv";

dotenv.config();

export enum Environment {
  DEV = "DEV",
  PROD = "PROD",
  TEST = "TEST",
}

interface IConfig {
  port: string;
  environment: Environment
  dbHost: string;
  dbPort: string;
  dbUser: string;
  dbPassword: string;
}
export const config: IConfig = {
  port: process.env.PORT || "7654",
  environment: Environment[process.env.ENVIRONMENT as keyof typeof Environment] || Environment.DEV,
  dbHost: process.env.DB_HOST || "postgres_host",
  dbUser: process.env.DB_USER || 'user',
  dbPort: process.env.DB_PORT || "5432",
  dbPassword: process.env.DB_PASSWORD || "postgres_password",
}
