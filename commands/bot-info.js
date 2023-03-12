module.exports = {
    name: "botinfo",
    description: "Gives you Information about the Bot",
    execute(msg) {
      const Guilded = require("guilded.js");
      const embed = new Guilded.Embed()
        .setColor("RED")
        .setTitle(`FireBot Info`)
        .addFields([
          { name: "Name", value: "FireBot" },
          { name: "Version", value: "1.6" },
          { name: "Developer", value: "[NieGestorben](https://guilded.gg/NieGestorben)" },
          { name: "Creation Date", value: "05.06.2021" },
          {
            name: "Main/Home Server",
            value: "[FireBot Development](https://guilded.gg/FireBot-Dev)",
          },
          { name: "Prefix", value: "," },
          {
            name: "Time since last restart",
            value: Math.round(`${process.uptime().toFixed(2)}` / 60) + "m",
          },
          {
            name: "Invite Link",
            value: "[Invite](https://www.guilded.gg/b/efd84b89-2228-4eba-a1af-11d19a66a6db)"
          }]
        )

        .setFooter("Bot made by NieGestorben");
  
      msg.send({ embeds: [embed] });
    },
  };
  