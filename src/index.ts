import * as yaml from "js-yaml";
import moment from "moment";
import * as path from "path";
import SlackBot, { PostMessageParams, SlackBotOptions } from "slackbots";
import { Transform } from "stream";

// tslint:disable-next-line:no-require-imports no-var-requires
const stripAnsi = require("strip-ansi");

/**
 * Supported log levels.
 *
 * Match the standard options provided by console.
 */
export enum LogLevel {
  TRACE = "TRACE",
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  FATAL = "FATAL",
}

/**
 * Map of log level icon urls.
 */
export type LevelIconUrlMap = { [level in keyof typeof LogLevel]: string | undefined };

/**
 * Map of log level colors.
 */
export type LevelColorMap = { [level in keyof typeof LogLevel]: string | undefined };

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

export interface BunyanLogMessage {
  name?: string;
  component?: string;
  level?: number;
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
  // tslint:disable-next-line:no-any
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
  // tslint:disable-next-line:no-any
  userData?: { [x: string]: undefined | any };
}

export const levelNameMap: LevelNameMap = {
  10: LogLevel.TRACE,
  20: LogLevel.DEBUG,
  30: LogLevel.INFO,
  40: LogLevel.WARN,
  50: LogLevel.ERROR,
  60: LogLevel.FATAL,
};

export const levelColorMap: LevelColorMap = {
  [LogLevel.TRACE]: "#EEEEEE",
  [LogLevel.DEBUG]: "#666666",
  [LogLevel.INFO]: "#2B72B5",
  [LogLevel.WARN]: "#EDBC13",
  [LogLevel.ERROR]: "#DE3B43",
  [LogLevel.FATAL]: "#DE3B43",
};

export default class SlackLogger extends Transform {
  public readonly isEnabled: boolean;
  private isOpen = false;
  private readonly options: Required<SlackLogOptions>;
  private readonly bot: SlackBot | undefined;

  public constructor(options: SlackLogOptions) {
    super();

    // build options
    this.options = {
      version: "",
      token: "",
      name: "Slack Logger",
      channel: "general",
      iconUrl: "https://image.ibb.co/iOSThT/log_local.png",
      basePath: path.join(__dirname, "..", ".."),
      levelIconUrlMap: {
        TRACE: "https://image.ibb.co/bx33bd/log_trace.png",
        DEBUG: "https://image.ibb.co/i64n2J/log_debug.png",
        INFO: "https://image.ibb.co/muqycJ/log_info.png",
        WARN: "https://image.ibb.co/eZsJ9y/log_warn.png",
        ERROR: "https://image.ibb.co/f06Obd/log_error.png",
        FATAL: "https://image.ibb.co/hyAibd/log_fatal.png",
      },
      as_user: false,
      ...options,
    };

    // don't attempt to create the bot if no token is provided
    if (typeof this.options.token !== "string" || this.options.token.length === 0) {
      this.isEnabled = false;

      return;
    }

    // create slack-bot
    this.bot = new SlackBot(this.options);

    this.bot.on("open", () => {
      this.isOpen = true;
    });

    this.bot.on("close", () => {
      this.isOpen = false;
    });

    this.isEnabled = true;

    // post startup message
    this.post(`--- Server v${this.options.version} started ${this.getDateTime()} ---`);
  }

  public get isConnected() {
    return this.isOpen;
  }

  public sendMessage(userInfo: MessageInfo) {
    // just ignore messages if no bot was created
    if (!this.bot) {
      return;
    }

    const info = {
      level: LogLevel.INFO,
      userData: {},
      component: "unknown component",
      ...userInfo,
    };

    // resolve message details
    const messageIconUrl = this.options.levelIconUrlMap[info.level]
      ? this.options.levelIconUrlMap[info.level]
      : this.options.levelIconUrlMap[LogLevel.INFO];
    const color = levelColorMap[info.level] ? levelColorMap[info.level] : levelColorMap[LogLevel.INFO];
    const rawSource = info.src ? `${info.src.file}:${info.src.line ? `:${info.src.line}` : ""}` : undefined;
    const formattedSource = rawSource ? this.formatSource(this.options.basePath, rawSource) : undefined;

    // add date to footer
    let footer = this.getDateTime();

    // add source to footer if exists
    if (formattedSource) {
      footer += ` • ${formattedSource}`;
    }

    // use either version provided in the method call or in the options
    const version = info.version || this.options.version;

    // add version if set
    if (version.length > 0) {
      footer += ` • v${version}`;
    }

    // add hostname if set
    if (typeof info.hostname === "string" && info.hostname.length > 0) {
      footer += ` • ${info.hostname}`;
    }

    // convert user data to YAML
    const userDataYaml =
      Object.keys(info.userData).length > 0
        ? yaml.safeDump(info.userData, {
            skipInvalid: true,
            noRefs: true,
            noCompatMode: true,
          })
        : "";

    // set text to formatted yaml
    let text = `\`\`\`${userDataYaml}\`\`\``;

    // add stack trace if available
    if (info.error && info.error.stack) {
      text += `\n${info.error.stack
        .split("\n")
        .map(line => `> ${line}`)
        .join("\n")}`;
    }

    // post the message
    this.post("", {
      attachments: [
        {
          fallback: info.text,
          color,
          author_name: info.component ? info.component : undefined,
          title: info.text,
          text,
          image_url: "http://my-website.com/path/to/image.jpg",
          thumb_url: "http://example.com/path/to/thumb.png",
          footer,
          footer_icon: messageIconUrl,
        },
      ],
    });
  }

  /**
   * This stream method is called by Bunyan.
   *
   * @param data Data to log
   */
  public write(data: {}): boolean {
    // just ignore messages if no bot was created
    if (!this.bot) {
      return true;
    }

    // extract known data and the rest as user data
    const {
      name,
      component,
      level: lvl,
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
    } = data as BunyanLogMessage;

    // resolve error
    const error = err || err2;
    const text = stripAnsi(msg || "");

    // ignore if the message and error are missing
    if (text.length === 0 && error === undefined) {
      return false;
    }

    // resolve error level
    let level = lvl && levelNameMap[lvl] ? levelNameMap[lvl] : LogLevel.INFO;

    if (level === undefined) {
      level = LogLevel.INFO;
    }

    // send the message
    this.sendMessage({
      component,
      hostname,
      src: src !== undefined ? src : filename !== undefined ? { file: filename, line: undefined } : undefined,
      version: this.options.version,
      error,
      text,
      level,
      userData,
    });

    return true;
  }

  public end(): boolean {
    this.emit("end");

    return true;
  }

  protected post(message: string, options: PostMessageParams = {}) {
    // just ignore post requests if no bot was created
    if (!this.bot) {
      return;
    }

    try {
      this.bot.postTo(this.options.channel, message, {
        username: this.options.name,
        icon_url: this.options.iconUrl,
        ...options,
      });
    } catch (error) {
      console.warn(`posting "${message}" to slack failed (${error.message})`);
    }
  }

  protected formatSource(basePath: string, source: string) {
    return path.relative(basePath, source).replace(/\\/g, "/");
  }

  protected getDateTime() {
    return moment().format("DD.MM HH:mm:ss");
  }
}
