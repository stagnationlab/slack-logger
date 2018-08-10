import { SlackBotNormalMessage } from "slackbots";
import SlackLogger, { LogLevel, MessageHandler } from "..";
export interface LevelMessageHandlerOptions {
    onLevelChange(newLevel: LogLevel): void;
}
export default class LevelMessageHandler implements MessageHandler {
    private readonly options;
    constructor(options: LevelMessageHandlerOptions);
    getName(): string;
    getDescription(): string;
    handleMessage(message: SlackBotNormalMessage, logger: SlackLogger): Promise<void>;
    getSupportedLevels(): string[];
}
