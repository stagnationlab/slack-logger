import * as style from "ansi-styles";
// tslint:disable-next-line:no-submodule-imports
import { EscapeCode } from "ansi-styles/escape-code";
import chalk from "chalk";
import * as yaml from "js-yaml";
import moment from "moment";
import * as path from "path";
import { Transform } from "stream";

export enum LogLevel {
  TRACE = "trace",
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
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
  // tslint:disable-next-line:no-any
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

export type TokenMapKey = keyof TokensMap;

export enum ColorGroup {
  NAME,
  COMPONENT,
}

export default class ConsoleLog extends Transform {
  // order of colors to use for component names
  private static readonly componentColors: EscapeCode.CodePair[] = [
    style.green,
    style.green,
    style.magenta,
    style.cyan,
    style.red,
    style.blue,
    style.white,
    style.yellow,
    style.gray,
  ];

  // level background colors map
  private static readonly levelColorMap: LevelColorMap = {
    [LogLevel.FATAL]: [style.bgMagenta, style.white],
    [LogLevel.ERROR]: [style.bgRed, style.white],
    [LogLevel.WARN]: [style.bgYellow, style.black],
    [LogLevel.INFO]: [style.reset, style.white],
    [LogLevel.DEBUG]: [style.bgCyan, style.black],
    [LogLevel.TRACE]: [style.bgBlack, style.white],
  };

  // numeric level names map
  private static readonly levelNameMap: LevelNameMap = {
    10: LogLevel.TRACE,
    20: LogLevel.DEBUG,
    30: LogLevel.INFO,
    40: LogLevel.WARN,
    50: LogLevel.ERROR,
    60: LogLevel.FATAL,
  };

  // mapping from component name to color index
  private readonly groupColorIndexMap: ColorIndexMap = {};
  private readonly groupColorMap: ColorNameMap = {};
  private readonly options: Required<Options>;

  public constructor(options: Options = {}) {
    super();

    this.options = {
      namePadding: 20,
      componentPadding: 20,
      filenamePadding: 30,
      showUserData: true,
      showError: true,
      whitelist: [],
      blacklist: [],
      dateFormat: "HH:mm:ss",
      messageFormat: "%time %level %filename %component %message",
      basePath: path.join(__dirname, "..", ".."),
      ...options,
    };
  }

  private static formatUserData(data: Data): string {
    // render user data as yaml making it easier to read by humans
    const formattedData = yaml.safeDump(data, {
      skipInvalid: true,
      noRefs: true,
      noCompatMode: true,
    });

    return chalk.gray(formattedData);
  }

  private static pad(str: string, padding = 20) {
    const padLength = Math.max(padding - str.length, 0);

    let result = new Array(padLength + 1).join(" ") + str;

    // make sure the total length does not succeed the requested padding
    if (result.length > padding) {
      result = `..${result.substring(result.length - padding + 2)}`;
    }

    return result;
  }

  private static formatLevel(level: number) {
    // format level text and background color
    const levelName = ConsoleLog.levelNameMap[level];
    const [levelBgColor, levelTextColor] = ConsoleLog.levelColorMap[levelName];
    const renderedLevelName = ` ${levelName.toUpperCase()} `;
    const levelPadding = 7;

    return `${levelBgColor.open}${levelTextColor.open}${ConsoleLog.pad(renderedLevelName, levelPadding)}${
      levelTextColor.close
    }${levelBgColor.close}`;
  }

  public write(data: {}): boolean {
    const message = this.formatMessage(data as Data);

    if (message !== undefined) {
      this.emit("data", message);
    }

    // write to standard output
    process.stdout.write(`${message}\n`);

    return true;
  }

  public end(): boolean {
    this.emit("end");

    return true;
  }

  private formatMessage(data: Data): string | undefined {
    const {
      name,
      component,
      level,
      msg,
      time,
      hostname,
      pid,
      v,
      version,
      err,
      error: err2,
      filename,
      src,
      ...userData
    } = data;

    // use component as the filtered name if exists, name otherwise
    const filteredName = component || name;
    const error = err || err2;

    // filter by whitelist
    if (
      Array.isArray(this.options.whitelist) &&
      this.options.whitelist.length > 0 &&
      this.options.whitelist.indexOf(filteredName) === -1
    ) {
      return undefined;
    }

    // filter by blacklist
    if (
      Array.isArray(this.options.blacklist) &&
      this.options.blacklist.length > 0 &&
      this.options.blacklist.indexOf(filteredName) !== -1
    ) {
      return undefined;
    }

    // use the src with filename and line if available (dev only)
    const filenameToFormat = src ? `${src.file}:${src.line}` : filename;

    // format values
    const formattedTime = moment(time).format(this.options.dateFormat);
    const formattedLevel = ConsoleLog.formatLevel(level);
    const formattedName = this.formatName(name);
    const formattedComponent = this.formatComponent(component !== undefined ? component : "n/a");
    const formattedFilename = this.formatFilename(this.options.basePath, filenameToFormat);

    // tokens available for building the log message
    const tokensMap: TokensMap = {
      time: formattedTime,
      level: formattedLevel,
      name: formattedName,
      component: formattedComponent,
      filename: formattedFilename,
      message: msg,
      hostname,
      pid,
      version,
      v,
    };

    // replace the tokens in the message format
    const tokenNames = Object.keys(tokensMap);

    let message = tokenNames.reduce((formattedMessage: string, tokenName: string) => {
      const regexp = new RegExp(`%${tokenName}`, "g");
      const replacement = tokensMap[tokenName as TokenMapKey];

      return formattedMessage.replace(regexp, replacement);
    }, `${this.options.messageFormat}\n`);

    // append error if exists and enabled
    if (this.options.showError && error) {
      if (error.stack) {
        message += `${chalk.bgRed(chalk.white(error.stack))}\n`;
      }

      // handle details from DetailedError
      if (error.details) {
        message += `${ConsoleLog.formatUserData(error.details)}\n`;
      }
    }

    // append user data if exists and enabled
    if (this.options.showUserData && Object.keys(userData).length > 0) {
      message += `${ConsoleLog.formatUserData(userData)}\n`;
    }

    return message;
  }

  private getColor(group: ColorGroup, name: string): EscapeCode.CodePair {
    const id = `${group}.${name}`;
    const escapeCodePair = this.groupColorMap[id];

    // return the color if already exists
    if (escapeCodePair !== undefined) {
      return escapeCodePair;
    }

    let groupColorIndex = this.groupColorIndexMap[group];

    // create color index map entry if does not already exist
    if (groupColorIndex === undefined) {
      groupColorIndex = 0;
      this.groupColorIndexMap[group] = groupColorIndex;
    }

    // pick next color from the list, start over if out of new ones
    const color = ConsoleLog.componentColors[groupColorIndex];
    this.groupColorIndexMap[group] = (groupColorIndex + 1) % ConsoleLog.componentColors.length;
    this.groupColorMap[id] = color;

    return color;
  }

  private formatName(name: string): string {
    const color = this.getColor(ColorGroup.NAME, name);

    return `${color.open}${ConsoleLog.pad(name, this.options.namePadding)}${color.close}`;
  }

  private formatComponent(component: string): string {
    const color = this.getColor(ColorGroup.COMPONENT, component);

    return `${color.open}${ConsoleLog.pad(component, this.options.componentPadding)}${color.close}`;
  }

  private formatFilename(basePath: string, filename: string): string {
    return ConsoleLog.pad(path.relative(basePath, filename).replace(/\\/g, "/"), this.options.filenamePadding);
  }
}
