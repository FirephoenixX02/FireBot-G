const https = require("https");
const Guilded = require("guilded.js");

module.exports = {
  name: "lyrics",
  description: "Find lyrics from a song",
  async execute(msg, args) {
    if (!args[0]) {
      return msg.send("Please enter in an song name!");
    }
    https.get(`https://some-random-api.ml/lyrics?title=${args}`, (response) => {
      let rawAPI = ``;

      response.on(`data`, (chunk) => {
        rawAPI += chunk;
      });

      response.on(`end`, () => {
        let res = JSON.parse(rawAPI);
        if (!res) {
          msg.send(
            "There was an error requesting the lyrics, please try again in a few seconds!"
          );
        } else {
          if (res.error != null) {
            msg.send("Couldn't find the lyrics to this song");
          } else {
            let embed = new Guilded.Embed()
              .setTitle(`${res.title} - ${res.author}`)
              .setDescription(res.lyrics)
              .setImage(res.thumbnail.genius)
              .setFooter("Bot made by NieGestorben")
              .setColor("RED");
            msg.send({ embeds: [embed] });
          }
        }
      });
    });
  },
};
