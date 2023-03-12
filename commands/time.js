const Guilded = require("guilded.js");

module.exports = {
  name: "time",
  description: "See how much time I spend to create the bot",
  execute(msg) {
    const embed = new Guilded.Embed()
      .setTitle("Time Spent: ")
      .addFields([
        {
          name: "Thinking 💭 : ",
          value: "6h",
        },
        {
          name: "Coding :keyboard: : ",
          value: "11h",
        },
        {
          name: "Testing :test_tube: : ",
          value: "23h",
        },
        {
          name: "Cups of Coffee :coffee: :  ",
          value: "5",
        },
        {
          name: "Lines of Code :file_folder: : ",
          value: "1.6k",
        },
      ])
      .setColor("RED");
    msg.send({ embeds: [embed] });
  },
};
