import * as Bunyan from "bunyan";
import { LogLevel } from ".";
export default class Logger {
    private readonly logger;
    constructor(options?: Bunyan.LoggerOptions);
    get(component: string, filename?: string): Bunyan;
    addStream(stream: Bunyan.Stream): void;
    addSerializers(serializers: Bunyan.Serializers): void;
    setLevel(level: LogLevel): void;
}
