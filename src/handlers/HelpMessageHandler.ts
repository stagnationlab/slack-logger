import { SlackBotNormalMessage } from "slackbots";
import SlackLogger, { MessageHandler } from "..";

export default class HelpMessageHandler implements MessageHandler {
  public getName(): string {
    return "help";
  }

  public getDescription(): string {
    return "provides help about available commands";
  }

  public async handleMessage(_message: SlackBotNormalMessage, logger: SlackLogger) {
    const messageHandlers = logger.getMessageHandlers();

    const response = messageHandlers
      .map((messageHandler, index) => `${index + 1}. *${messageHandler.getName()}:* ${messageHandler.getDescription()}`)
      .join("\n");

    logger.post(response);
  }
}
