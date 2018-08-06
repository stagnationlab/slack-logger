declare module "slackbots" {
  export interface SlackBotOptions {
    token: string;
    name?: string;
    as_user?: boolean;
  }

  export interface SlackBotMessage {}

  export interface AttachmentInfo {
    text: string;
    [x: string]: any;
  }

  export interface PostMessageParams {
    icon_url?: string;
    icon_emoji?: string;
    username?: string;
    attachments?: AttachmentInfo[];
    // TODO: add all from https://api.slack.com/methods/chat.postMessage
  }

  export type SlackBotStartEvent = () => any;
  export type SlackBotOpenEvent = () => any;
  export type SlackBotCloseEvent = () => any;
  export type SlackBotMessageEvent = (message: SlackBotMessage) => any;

  class SlackBot {
    public ws: WebSocket;

    public constructor(options: SlackBotOptions);

    public on(event: "start", callback: SlackBotStartEvent): void;
    public on(event: "open", callback: SlackBotOpenEvent): void;
    public on(event: "close", callback: SlackBotCloseEvent): void;
    public on(event: "message", callback: SlackBotMessageEvent): void;

    public postMessageToChannel(channel: string, message: string, params?: PostMessageParams): void;
    public postMessageToGroup(channel: string, message: string, params?: PostMessageParams): void;
    public postTo(channel: string, message: string, params?: PostMessageParams): void;
  }

  export default SlackBot;
}
