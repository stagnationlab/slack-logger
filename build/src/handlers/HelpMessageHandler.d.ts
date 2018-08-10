import { SlackBotNormalMessage } from "slackbots";
import SlackLogger, { MessageHandler } from "..";
export default class HelpMessageHandler implements MessageHandler {
    getName(): string;
    getDescription(): string;
    handleMessage(_message: SlackBotNormalMessage, logger: SlackLogger): Promise<void>;
}
