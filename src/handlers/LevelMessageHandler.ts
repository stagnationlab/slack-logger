import { SlackBotNormalMessage } from "slackbots";
import SlackLogger, { LogLevel, MessageHandler } from "..";

export interface LevelMessageHandlerOptions {
  onLevelChange(newLevel: LogLevel): void;
}

export default class LevelMessageHandler implements MessageHandler {
  public constructor(private readonly options: LevelMessageHandlerOptions) {}

  public getName(): string {
    return "level";
  }

  public getDescription(): string {
    const supportedLevels = this.getSupportedLevels();

    return `changes the default logging level (one of \`${supportedLevels.join(
      "`, `",
    )}\`, for example \`level trace\`)`;
  }

  public async handleMessage(message: SlackBotNormalMessage, logger: SlackLogger) {
    // split the message text into words and compile list of supported levels
    const tokens = message.text.split(" ");
    const supportedLevels = this.getSupportedLevels();

    // expecting exactly two words
    if (tokens.length !== 2) {
      logger.post(
        `*level* expects the second word to be the new logging level (one of \`${supportedLevels.join("`, `")}\`)`,
      );

      return;
    }

    // extract level name from second word
    const levelName = tokens[1];

    // make sure requested level exists
    if (supportedLevels.indexOf(levelName) === -1) {
      logger.post(`*level* does not support \`${levelName}\`, expected one of \`${supportedLevels.join("`, `")}\``);

      return;
    }

    const newLevel = LogLevel[levelName.toUpperCase() as LogLevel];

    // call the level change handler
    this.options.onLevelChange(newLevel);

    logger.post(`now logging messages with severity of \`${levelName}\` and above`);
  }

  public getSupportedLevels() {
    return Object.keys(LogLevel).map(level => level.toLowerCase());
  }
}
