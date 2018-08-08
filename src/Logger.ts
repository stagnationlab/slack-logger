import * as Bunyan from "bunyan";
import { LogLevel } from ".";

export default class Logger {
  private readonly logger: Bunyan;

  public constructor(options: Bunyan.LoggerOptions = { name: "app" }) {
    this.logger = Bunyan.createLogger({
      streams: [],
      serializers: Bunyan.stdSerializers,
      ...options,
    });
  }

  public get(component: string, filename = ""): Bunyan {
    return this.logger.child({
      component,
      filename,
    });
  }

  public addStream(stream: Bunyan.Stream) {
    this.logger.addStream(stream);
  }

  public addSerializers(serializers: Bunyan.Serializers) {
    this.logger.addSerializers(serializers);
  }

  public setLevel(level: LogLevel) {
    this.logger.level(level.toLowerCase() as Bunyan.LogLevel);
  }
}
