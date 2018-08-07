import * as Bunyan from "bunyan";

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
}
