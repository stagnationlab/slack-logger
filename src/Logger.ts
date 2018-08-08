import * as Bunyan from "bunyan";
import { LogLevel } from ".";

export interface LoggerMap {
  [x: string]: Bunyan | undefined;
}

export default class Logger {
  private readonly logger: Bunyan;
  private readonly componentLoggers: LoggerMap = {};

  public constructor(options: Bunyan.LoggerOptions = { name: "app" }) {
    this.logger = Bunyan.createLogger({
      streams: [],
      serializers: Bunyan.stdSerializers,
      ...options,
    });
  }

  public get(component: string, filename = ""): Bunyan {
    // return existing component logger if exists
    let componentLogger = this.componentLoggers[component];

    if (componentLogger) {
      return componentLogger;
    }

    // create a new child component logger
    componentLogger = this.logger.child({
      component,
      filename,
    });

    this.componentLoggers[component] = componentLogger;

    return componentLogger;
  }

  public addStream(stream: Bunyan.Stream) {
    this.logger.addStream(stream);
  }

  public addSerializers(serializers: Bunyan.Serializers) {
    this.logger.addSerializers(serializers);
  }

  public setLevel(level: LogLevel) {
    const bunyanLevel = level.toLowerCase() as Bunyan.LogLevel;

    // set main logger level
    this.logger.level(bunyanLevel);

    // also update component logger levels
    Object.keys(this.componentLoggers).forEach(componentLoggerName => {
      const componentLogger = this.componentLoggers[componentLoggerName];

      if (!componentLogger) {
        return;
      }

      componentLogger.level(bunyanLevel);
    });
  }
}
