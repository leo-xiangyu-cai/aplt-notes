import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import logger from "./Utils/Logger";
import {config} from "./Config";
import koaLogger from "koa-logger";
import healthcheckRouters from "./Routes/HealthCheck.router";
import noteRouter from "./Routes/Note.router";
import {DataSourceUtils} from "./DataSource/DataSourceUtils";

const app = new Koa();

app.use(bodyParser());
app.use(
  cors({
    origin: "*"
  })
);

app.use(koaLogger());

app.use(healthcheckRouters.routes());
app.use(noteRouter.routes());

DataSourceUtils.getDataSource().initialize()
  .then(async (x) => {
    logger.info(`Data source ${x.name} has been initialized!`);
  })
  .catch(err => {
    logger.error("Error during data source initialization: " + err);
  })

const server = app.listen(config.port, async () => {
  logger.info(`Server listening on port: ${config.port}, environment: ${config.environment}. Please visit http://localhost:${config.port}/ping to check the health of the server`);
}).on("error", err => {
  logger.error(err);
})

export default server;