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
  dbPassword: string;
}
export const config: IConfig = {
  port: process.env.PORT || "7654",
  environment: Environment[process.env.ENVIRONMENT as keyof typeof Environment] || Environment.DEV,
  dbHost: process.env.DB_HOST || "postgres_host",
  dbPassword: process.env.DB_PASSWORD || "postgres_password",
}
