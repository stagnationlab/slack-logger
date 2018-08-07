import chalk from "chalk";
import * as fs from "fs";
import inquirer from "inquirer";
import * as path from "path";

// this file manages example configuration and execution, take a look at the example-xxx.ts files for actual examples.

interface ExampleChoiceAnswer {
  exampleName: string;
}

interface ConfigurationAnswers {
  token: string;
  channel: string;
  iconUrl: string;
  name: string;
}

(async () => {
  // check whether .env file exists
  const dotEnvFilename = path.join(__dirname, "..", "..", ".env");
  const dotEnvExists = fs.existsSync(dotEnvFilename);

  if (!dotEnvExists) {
    // notify of the configuration file being missing
    console.log(chalk.bgWhite.black(`\nThe .env configuration file does not exist (checked ${dotEnvFilename})`));
    console.log(
      chalk.bgWhite.black(
        `Please create one based on .env-example or answer the questions below and it will be created for you\n`,
      ),
    );

    // as for configuration info
    const { token, channel, name, iconUrl } = await inquirer.prompt<ConfigurationAnswers>([
      {
        name: "token",
        message: "Please enter your slack integration API token",
        type: "input",
      },
      {
        name: "channel",
        message: "Please enter channel name to post to (make sure to add the bot to this channel)",
        type: "input",
        default: "general",
      },
      {
        name: "name",
        message: "Please enter the slack logger name",
        type: "input",
        default: "Slack Logger",
      },
      {
        name: "iconUrl",
        message: "Please enter the slack logger icon url",
        type: "input",
        default: "https://image.ibb.co/muqycJ/log_info.png",
      },
    ]);

    // build the .env file contents
    const dotEnvContents = `
      TOKEN=${token}
      CHANNEL=${channel}
      NAME=${name}
      ICON_URL=${iconUrl}
    `.replace(/^\s+/gm, "");

    // write the file
    fs.writeFileSync(dotEnvFilename, dotEnvContents, "utf8");
  }

  // ask for example to run
  const { exampleName } = await inquirer.prompt<ExampleChoiceAnswer>([
    {
      name: "exampleName",
      message: "Which example would you like to run?",
      type: "list",
      choices: [
        {
          name: "Manual",
          value: "1-example-manual",
        },
        {
          name: "Bunyan",
          value: "2-example-bunyan",
        },
        {
          name: "Winston",
          value: "3-example-winston",
        },
        {
          name: "Logger",
          value: "4-example-logger",
        },
      ],
    },
  ]);

  // run the chosen example
  const filename = path.join(__dirname, `${exampleName}.js`);

  console.log(`\nRunning ${chalk.bold(filename)}\n`);

  require(filename);

  // quit after a small delay (slackbots does not provide connection closing)
  // setTimeout(() => {
  //   process.exit(0);
  // }, 1000);
})().catch(error => console.error(error));
