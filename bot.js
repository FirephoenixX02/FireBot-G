// GUILDED.JS VERSION

require("dotenv").config();

const { Client } = require("guilded.js");

const client = new Client({ token: process.env.BOT_TOKEN });

const { Collection } = require("@discordjs/collection");

const { readdir } = require("fs/promises");

const { join } = require("path");

const BOT_PREFIX = ",";

const os = require("os");

client.commands = new Collection();

client.on("ready", () => {
  console.log("Fire Bot is ready...");
});

client.on("messageCreated", async (msg) => {
  if (!msg.content.startsWith(BOT_PREFIX)) return;
  let [commandName, ...args] = msg.content
    .slice(BOT_PREFIX.length)
    .trim()
    .split(/ +/);
  commandName = commandName.toLowerCase();

  const command =
    client.commands.get(commandName) ??
    client.commands.find((x) => x.aliases?.includes(commandName));
  if (!command) return;

  try {
    await command.execute(msg, args, client);
  } catch (e) {
    void client.messages.send(
      msg.channelId,
      "There was an error executing that command!"
    );
    void console.error(e);
  }
});

void (async () => {
  // read the commands dir and have the file extensions.
  const commandDir = await readdir(join(__dirname, "commands"), {
    withFileTypes: true,
  });

  // go through all the files/dirs scanned from the readdir, and make sure we only have js files
  for (const file of commandDir.filter((x) => x.name.endsWith(".js"))) {
    const command = require(join(__dirname, "commands", file.name));
    client.commands.set(command.name, command);
  }
})();

client.login();
