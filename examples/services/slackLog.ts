import * as dotenv from "dotenv";
import SlackLogger, { SlackLogOptions } from "../../src";

dotenv.config();

// configuration
const config: SlackLogOptions = {
  token: process.env.TOKEN || "",
  channel: process.env.CHANNEL,
  iconUrl: process.env.ICON_URL,
  name: process.env.NAME,
};

// create the logger instance
const slackLog = new SlackLogger({
  version: "1.4.2", // extract from package.json etc
  channel: config.channel,
  iconUrl: config.iconUrl,
  token: config.token,
  name: config.name,
});

export default slackLog;
