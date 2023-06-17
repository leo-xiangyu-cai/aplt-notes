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
}
export const config: IConfig = {
  port: process.env.PORT || "7654",
  environment: Environment[process.env.ENVIRONMENT as keyof typeof Environment] || Environment.DEV
}
