const Guilded = require("guilded.js");

const ms = require("ms");

const math = require("mathjs");

module.exports = {
  name: "math",
  description: "Calculates a Math equation",

  async execute(msg, args) {
    try {
      const solution = math.evaluate(args.join(" "));
      const embed = new Guilded.Embed()
        .addField("Question", args.join(" "))
        .addField("Solution", solution.toString());

      msg.send({ embeds: [embed] });
    } catch {
      msg.send("Your Question is invalid!");
    }
  },
};
