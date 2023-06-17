import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import logger from "./Utils/Logger";
import {config} from "./config";
import koaLogger from "koa-logger";
import healthcheckRouters from "./Routes/HealthCheck.router";
import noteRouter from "./Routes/Note.router";

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

const server = app.listen(config.port, async () => {
  logger.info(`
  Server listening on port: ${config.port}, environment: ${config.environment}
  Please visit http://localhost:${config.port}/ping to check the health of the server
  `);


}).on("error", err => {
  logger.error(err);
})

export default server;