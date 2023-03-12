const Guilded = require("guilded.js");
const BOT_PREFIX = ",";
const { commands } = require("../bot.js")

module.exports = {
  name: "help",
  description: "Gives a list of all commands",
  async execute(msg, args, client) {
    const data = [];
    const commands = client.commands;

    if (!args.length) {
      data.push(
        "\n\n**To get more info about a specific command, do " +
          BOT_PREFIX +
          "help [command name]**\n\n"
      );

      data.push(commands.map((c) => c.name).join(`\n${BOT_PREFIX}`));

      const embed = new Guilded.Embed()
        .setColor("RED")
        .setTitle("All Fire Bot Commands")
        .setDescription(data.toString())
        .setFooter("Bot made by NieGestorben");

      msg.send({ embeds: [embed] });

      return;
    }

    const name = args[0];
    const cmd =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!cmd) {
      msg.channel.send(`Command \`${name}\` not found.`);

      return;
    }

    data.push(`Name: ${cmd.name}`);

    if (cmd.description) {
      data.push(`Description: ${cmd.description}`);
    }

    if (cmd.aliases) {
      data.push(`Aliases: ${cmd.aliases})`);
    }

    const embed = new Guilded.Embed()
      .setColor("RED")
      .setTitle("Command Info")
      .setDescription(data.toString())
      .setFooter("Bot made by NieGestorben#6618");

    msg.send({ embeds: [embed] });
  },
};
