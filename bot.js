// Fixme's and Todo's are now directly in the code not as issues anymore so i don't have to look at
// the issues section anymore.
// Bug reports are still handled in the issues section.

/* 
  TODO:
- Major UI Polish
*/

require("dotenv").config();

//Web Dashboard Variables

const express = require("express");
const app = express();
const os = require("os");

// Web Dashboard Settings

app.enable("trust proxy"); // If IP is ::1 its localhost
app.set("etag", false); // Disable Cache
app.use(express.static(__dirname + "/website"));
app.disable("x-powered-by");

// Bot Variables

const fs = require("fs");
const { Client, Collection, Embed } = require("guilded.js");
const { addAbortSignal } = require("stream");

//Intents needed for accessing specific information's like Rich Presence or Invite Count

const client = new Client({ token: process.env.BOT_TOKEN });

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const BOT_PREFIX = ",";

client.on("ready", () => {
  console.log("Fire Bot is ready...");
  client.user.setStatus("online");
  client.user.setActivity("FireClient", { type: "PLAYING" });
});

client.on("messageCreate", (msg) => {
  if (!msg.content.startsWith(BOT_PREFIX) || msg.author.bot) return;

  const args = msg.content.slice(BOT_PREFIX.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  const command =
    client.commands.get(cmd) ||
    client.commands.find((a) => a.aliases && a.aliases.includes(cmd));

  try {
    if (command) command.execute(msg, args, client);
  } catch (err) {
    msg.reply("There was an error executing the command!");
    console.log(err);
  }
});

client.on("messageDelete", (msg) => {
  //Ghost Ping Listener

  if (msg.mentions.users.first()) {
    if (msg.mentions.users.first().bot) return;

    const embed = new Embed()
      .setTitle("Ghost Ping")
      .setDescription(
        `${msg.author} ghost pinged ${msg.mentions.users.first()}`
      );

    let channel = msg.guild.channels.cache.find(
      (channel) => channel.name.toLowerCase() === "ghostping"
    );

    channel.send({ embeds: [embed] });
  }
});

client.on("messageUpdate", async (oldMessage) => {
  if (oldMessage.mentions.users.first()) {
    if (oldMessage.mentions.users.first().bot) return;

    const embed = new Embed()
      .setTitle("Ghost Ping")
      .setDescription(
        `${oldMessage.author} ghost pinged ${oldMessage.mentions.users.first()}`
      );

    let channel = oldMessage.guild.channels.cache.find(
      (channel) => channel.name.toLowerCase() === "ghostping"
    );

    channel.send({ embeds: [embed] });
  }
});

//Welcome Message

client.on("guildMemberAdd", (member) => {
  const message = `Welcome <@${member.id}>!`;

  let channel = member.guild.channels.cache.find(
    (channel) => channel.name.toLowerCase() === "newmember"
  );
  channel.send(message);
});

// Bot Login

// Web Dashboard Access Log

app.use((req, res, next) => {
  console.log(
    `Web Dashboard was accessed via ${req.method} on ${req.url}. Status Code: ${req.statusCode}, IP: ${req.ip}`
  );
  next();
});

// Web Dashboard Main Sites

app.get("/", async (req, res) => {
  const ram = Math.round(os.totalmem / (1024 * 1024 * 1024)) + "GB";
  const cores = os.cpus().length;
  const cpu = os.cpus()[0].model;
  const guilds = client.guilds.cache.size;
  const users = client.users.cache.size;
  const version = 1.6;
  const system = os.platform;
  const freemem = Math.round(os.freemem / (1024 * 1024 * 1024)) + "GB";
  const discordapiping = client.ws.ping;
  const uptime = Math.round(`${process.uptime().toFixed(2)}` / 60) + "m";

  let file = fs.readFileSync("./website/html/index.html", { encoding: "utf8" });
  file = file.replace("$$ram$$", ram);
  file = file.replace("$$cores$$", cores);
  file = file.replace("$$cpu$$", cpu);
  file = file.replace("$$guilds$$", guilds);
  file = file.replace("$$users$$", users);
  file = file.replace("$$version$$", version);
  file = file.replace("$$os$$", system);
  file = file.replace("$$freemem$$", freemem);
  file = file.replace("$$apiping$$", discordapiping);
  file = file.replace("$$uptime$$", uptime);

  res.send(file);
});

// Web Dashboard Start

app.listen(process.env.PORT || 3000, () =>
  console.log(`Web Dashboard is now running on port ${process.env.PORT || 3000}`)
);
