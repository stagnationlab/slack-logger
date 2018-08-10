// tslint:disable-next-line:no-reference
/// <reference path="./@types/slackbots/index.d.ts" />

import * as yaml from "js-yaml";
import moment from "moment";
import * as path from "path";
import SlackBot, {
  PostMessageParams,
  SlackBotChannel,
  SlackBotMessage,
  SlackBotNormalMessage,
  SlackBotOptions,
} from "slackbots";
import { Transform } from "stream";
import HelpMessageHandler from "./handlers/HelpMessageHandler";

// export public resources
export { default as Logger } from "./Logger";
export { default as HelpMessageHandler } from "./handlers/HelpMessageHandler";
export { default as LevelMessageHandler } from "./handlers/LevelMessageHandler";
export { default as ConsoleLog } from "./ConsoleLog";

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

export interface MessageHandler {
  getName(): string;
  getDescription(): string;
  handleMessage(message: SlackBotNormalMessage, logger: SlackLogger): Promise<void>;
}

// tslint:disable-next-line:max-classes-per-file
export default class SlackLogger extends Transform {
  public readonly isEnabled: boolean;
  public readonly objectMode = true;
  private isOpen = false;
  private readonly options: Required<SlackLogOptions>;
  private readonly bot: SlackBot | undefined;
  private readonly messageHandlers: MessageHandler[] = [];
  private channels: SlackBotChannel[] | undefined;

  public constructor(options: SlackLogOptions) {
    super({
      objectMode: true,
    });

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

    // slack logger is enabled if a token was provided
    this.isEnabled = typeof this.options.token === "string" && this.options.token.length > 0;

    // don't attempt to create the bot if no token is provided
    if (!this.isEnabled) {
      return;
    }

    // create slack-bot
    this.bot = new SlackBot(this.options);

    // listen for open event
    this.bot.on("open", async () => {
      this.isOpen = true;

      // give up if bot is not available
      if (!this.bot) {
        return;
      }

      // fetch list of channels and groups
      const { channels } = await this.bot.getChannels();
      const { groups } = await this.bot.getGroups();

      // save list of channels including groups
      this.channels = [...channels, ...groups];
    });

    // listen for close event
    this.bot.on("close", () => {
      this.isOpen = false;
    });

    // register built-in message handlers
    this.addMessageHandler(new HelpMessageHandler());

    // listen for incoming messages
    this.bot.on("message", async message => this.onMessage(message));
  }

  public get isConnected() {
    return this.isOpen;
  }

  public addMessageHandler(messageHandler: MessageHandler) {
    this.messageHandlers.push(messageHandler);
  }

  public getMessageHandlerByName(name: string): MessageHandler | undefined {
    return this.messageHandlers.find(item => item.getName() === name);
  }

  public getMessageHandlers(): MessageHandler[] {
    return this.messageHandlers;
  }

  public getChannelById(id: string): SlackBotChannel | undefined {
    if (!this.channels) {
      return undefined;
    }

    return this.channels.find(channel => channel.id === id);
  }

  public getChannelByName(name: string): SlackBotChannel | undefined {
    if (!this.channels) {
      return undefined;
    }

    return this.channels.find(channel => channel.name === name);
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
    let text = userDataYaml.length > 0 ? `\`\`\`${userDataYaml}\`\`\`` : "";

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
      message: msg2,
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
    } = data as StreamLogMessage;

    // resolve error
    const error = err || err2;
    const message = msg || msg2;
    const text = stripAnsi(message || "");

    // ignore if the message and error are missing
    if (text.length === 0 && error === undefined) {
      return false;
    }

    // resolve error level
    let level = LogLevel.INFO;

    // winston gives string levels such as info, warn, bunyan gives numbers sucks as 10, 20
    if (typeof lvl === "string") {
      if (Object.keys(LogLevel).indexOf(lvl.toUpperCase()) !== -1) {
        level = lvl.toUpperCase() as LogLevel;
      }
    } else if (typeof lvl === "number") {
      const mappedLevel = levelNameMap[lvl];

      level = mappedLevel ? mappedLevel : LogLevel.INFO;
    }

    // send the message
    this.sendMessage({
      component: component || name,
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

  public post(message: string, options: PostMessageParams = {}) {
    // just ignore post requests if no bot was created
    if (!this.bot) {
      return;
    }

    // attempt to post the message
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

  public async onMessage(message: SlackBotMessage) {
    // only handle normal messages
    if (message.type !== "message" || typeof message.text !== "string") {
      return;
    }

    // attempt to get channel info by name
    const channel = this.getChannelById(message.channel);

    // ignore message if no such channel was found
    if (!channel) {
      return;
    }

    // ignore messages from wrong channels
    if (channel.name !== this.options.channel) {
      return;
    }

    // split the message into tokens and use the first word as the name of the command
    const tokens = message.text.split(" ");
    const name = tokens[0];

    // attempt to find the message handler
    const messageHandler = this.getMessageHandlerByName(name);

    // ignore unsupported messages
    if (!messageHandler) {
      return;
    }

    // handle supported messages
    await messageHandler.handleMessage(message, this);
  }

  protected formatSource(basePath: string, source: string) {
    return path.relative(basePath, source).replace(/\\/g, "/");
  }

  protected getDateTime() {
    return moment().format("DD.MM HH:mm:ss");
  }
}
