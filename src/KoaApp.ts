import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import logger from "./Utils/Logger";
import {config} from "./Config";
import koaLogger from "koa-logger";
import healthCheckRouters from "./Routes/HealthCheck.router";
import noteRouter from "./Routes/Note.router";
import {DataSourceUtils} from "./DataSource/DataSourceUtils";
import authRouter from "./Routes/Auth.router";
import {Server} from "http";
import dotenv from "dotenv";


export default class KoaApp {

  app: Koa;

  private server?: Server;

  constructor() {
    dotenv.config();
    this.app = new Koa();

    this.app.use(bodyParser());
    this.app.use(
      cors({
        origin: "*"
      })
    );

    this.app.use(koaLogger());

    this.app.use(healthCheckRouters.routes());
    this.app.use(noteRouter.routes());
    this.app.use(authRouter.routes());
  }

  async start() {
    try {
      const dataSource = await DataSourceUtils.getDataSource().initialize();
      logger.info(`Data source ${dataSource.name} has been initialized!`);
    } catch (err) {
      logger.error("Error during data source initialization: " + err);
      throw err;  // if database initialization failed, then we should not start the server
    }
    this.server = this.app.listen(config.port, () => {
      logger.info(`Server listening on port: ${config.port}, environment: ${config.environment}. Please visit http://localhost:${config.port}/ping to check the health of the server`);
    }).on("error", err => {
      logger.error(err);
    });
    return this.server;
  }

  stop() {
    DataSourceUtils.getDataSource().destroy().then(() => {
      logger.info("Data source has been destroyed!");
    }).catch(err => {
      logger.error("Error during data source destroy: " + err);
    });
    this.server?.close();
  }
}
