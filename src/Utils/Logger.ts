import log4js from 'log4js';
import {config, Environment} from "../Config";

// Create a global logger instance
const logger = log4js.getLogger();

// Configure the logger to write to the console
log4js.configure({
  appenders: {
    console: {type: "console"},
    file: {type: "file", filename: "logs/app.log"}
  },
  categories: {
    default: {
      appenders: config.environment === Environment.PROD ? ["file"] : ["console"],
      level: config.environment === Environment.TEST ? "debug" : "info"
    }
  }
});

export default logger;
