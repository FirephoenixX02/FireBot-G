const Guilded = require("guilded.js");

module.exports = {
  name: "dice",
  description: "Rolls a Dice",
  execute(msg, args) {
    const solution = Math.floor(Math.random() * 6) + 1;

    if (!args) {
      msg.channel.send("Please specify a number!");
    } else {
      const embed = new Guilded.Embed()
      .setDescription(solution.toString())
      .setColor("RED")

      msg.send({ embeds: [embed] });
    }
  },
};
