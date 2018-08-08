/// <reference types="node" />
import { EscapeCode } from "ansi-styles/escape-code";
import { Transform } from "stream";
export declare enum LogLevel {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal"
}
export interface ColorIndexMap {
    [x: string]: number | undefined;
}
export interface ColorNameMap {
    [x: string]: EscapeCode.CodePair | undefined;
}
export interface LevelColorMap {
    [x: string]: [EscapeCode.CodePair, EscapeCode.CodePair];
}
export interface LevelNameMap {
    [x: number]: string;
}
export interface Options {
    basePath?: string;
    namePadding?: number;
    componentPadding?: number;
    filenamePadding?: number;
    showUserData?: boolean;
    showError?: boolean;
    whitelist?: string[];
    blacklist?: string[];
    dateFormat?: string;
    messageFormat?: string;
}
export interface Data {
    [x: string]: any;
}
export interface TokensMap {
    time: string;
    level: string;
    name: string;
    component: string;
    message: string;
    hostname: string;
    filename: string;
    pid: string;
    version: string;
    v: string;
}
export declare type TokenMapKey = keyof TokensMap;
export declare enum ColorGroup {
    NAME = 0,
    COMPONENT = 1
}
export default class ConsoleLog extends Transform {
    private static readonly componentColors;
    private static readonly levelColorMap;
    private static readonly levelNameMap;
    private readonly groupColorIndexMap;
    private readonly groupColorMap;
    private readonly options;
    constructor(options?: Options);
    private static formatUserData;
    private static pad;
    private static formatLevel;
    write(data: {}): boolean;
    end(): boolean;
    private formatMessage;
    private getColor;
    private formatName;
    private formatComponent;
    private formatFilename;
}
