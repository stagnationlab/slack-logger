declare module "slackbots" {
  export interface SlackBotOptions {
    token: string;
    name?: string;
    as_user?: boolean;
  }

  export interface SlackBotTypingMessage {
    type: "user_typing";
    channel: string;
    user: string;
  }

  export interface SlackBotNormalMessage {
    type: "message";
    channel: string;
    user: string;
    text: string;
    team: string;
    client_message_id: string;
    event_ts: string;
    ts: string;
  }

  // there are actually more types https://api.slack.com/events/message
  export type SlackBotMessage = SlackBotTypingMessage | SlackBotNormalMessage;

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

  export interface SlackBotChannelsResponse {
    channels: SlackBotChannel[];
  }

  export interface SlackBotGroupsResponse {
    groups: SlackBotChannel[];
  }

  export interface SlackBotChannel {
    id: string;
    name: string;
  }

  export type SlackBotStartEvent = () => any;
  export type SlackBotOpenEvent = () => any;
  export type SlackBotCloseEvent = () => any;
  export type SlackBotMessageEvent = (message: SlackBotMessage) => any;

  export default class SlackBot {
    public constructor(options: SlackBotOptions);

    public on(event: "start", callback: SlackBotStartEvent): void;
    public on(event: "open", callback: SlackBotOpenEvent): void;
    public on(event: "close", callback: SlackBotCloseEvent): void;
    public on(event: "message", callback: SlackBotMessageEvent): void;

    public postMessageToChannel(channel: string, message: string, params?: PostMessageParams): void;
    public postMessageToGroup(channel: string, message: string, params?: PostMessageParams): void;
    public postTo(channel: string, message: string, params?: PostMessageParams): void;
    public postMessage(id: string, message: string, params?: PostMessageParams): void;

    public getChannels(): Promise<SlackBotChannelsResponse>;
    public getGroups(): Promise<SlackBotGroupsResponse>;
  }

  // export default SlackBot;
}
