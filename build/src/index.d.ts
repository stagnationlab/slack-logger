/// <reference path="../../src/@types/slackbots/index.d.ts" />
/// <reference types="node" />
import { PostMessageParams, SlackBotChannel, SlackBotMessage, SlackBotNormalMessage, SlackBotOptions } from "slackbots";
import { Transform } from "stream";
export { default as Logger } from "./Logger";
export { default as HelpMessageHandler } from "./handlers/HelpMessageHandler";
export { default as LevelMessageHandler } from "./handlers/LevelMessageHandler";
export { default as ConsoleLog } from "./ConsoleLog";
/**
 * Supported log levels.
 *
 * Match the standard options provided by console.
 */
export declare enum LogLevel {
    TRACE = "TRACE",
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
    FATAL = "FATAL"
}
/**
 * Map of log level icon urls.
 */
export declare type LevelIconUrlMap = {
    [level in keyof typeof LogLevel]: string | undefined;
};
/**
 * Map of log level colors.
 */
export declare type LevelColorMap = {
    [level in keyof typeof LogLevel]: string | undefined;
};
/**
 * Map of numeric log levels to log level enumeration values.
 */
export interface LevelNameMap {
    [x: number]: LogLevel | undefined;
}
/**
 * Represents a message source.
 */
export interface MessageSource {
    file: string;
    line: number | undefined;
}
export interface SlackLogOptions extends SlackBotOptions {
    version?: string;
    channel?: string;
    iconUrl?: string;
    basePath?: string;
    levelIconUrlMap?: LevelIconUrlMap;
}
export interface StreamLogMessage {
    name?: string;
    component?: string;
    level?: number | string;
    msg?: string;
    time?: string;
    hostname?: string;
    pid?: string;
    v?: string;
    version?: string;
    err?: Error;
    error?: Error;
    filename?: string;
    src?: MessageSource;
    [x: string]: undefined | any;
}
export interface MessageInfo {
    text: string;
    level?: LogLevel;
    component?: string;
    hostname?: string;
    version?: string;
    src?: MessageSource;
    error?: Error;
    userData?: {
        [x: string]: undefined | any;
    };
}
export declare const levelNameMap: LevelNameMap;
export declare const levelColorMap: LevelColorMap;
export interface MessageHandler {
    getName(): string;
    getDescription(): string;
    handleMessage(message: SlackBotNormalMessage, logger: SlackLogger): Promise<void>;
}
export default class SlackLogger extends Transform {
    readonly isEnabled: boolean;
    readonly objectMode: boolean;
    private isOpen;
    private readonly options;
    private readonly bot;
    private readonly messageHandlers;
    private channels;
    constructor(options: SlackLogOptions);
    readonly isConnected: boolean;
    addMessageHandler(messageHandler: MessageHandler): void;
    getMessageHandlerByName(name: string): MessageHandler | undefined;
    getMessageHandlers(): MessageHandler[];
    getChannelById(id: string): SlackBotChannel | undefined;
    getChannelByName(name: string): SlackBotChannel | undefined;
    sendMessage(userInfo: MessageInfo): void;
    /**
     * This stream method is called by Bunyan.
     *
     * @param data Data to log
     */
    write(data: {}): boolean;
    end(): boolean;
    post(message: string, options?: PostMessageParams): void;
    onMessage(message: SlackBotMessage): Promise<void>;
    protected formatSource(basePath: string, source: string): string;
    protected getDateTime(): string;
}
