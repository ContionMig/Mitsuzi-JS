const Util = require('../../util/MitUtil.js');
const {
  prefix,
  token,
  ownerid,
  logchannelid,
  giphy
} = require('../../config.json');
var Giphy = require('giphy-wrapper')(giphy);

module.exports = {
  name: 'gif',
  description: "The bot will try to find a gif from the given tag",
  aliases: ['giphy'],
  usage: ' [tag]',
  cooldown: 2,
  args: -1,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      let SearchTerm = args.join("%20");
      Giphy.random(SearchTerm, function (err, data) {
        if (err) {
          return;
        }

        let GifURL = "https://media3.giphy.com/media/26uf6qaxqHpYXgjWU/giphy.gif?cid=ecf05e472f9638b0e9f3cab17a3aee9e8543e2e430e3525e&rid=giphy.gif";
        if (data.data.length != 0) {
          GifURL = data.data.image_url;
        }

        return message.channel.send({
          embed: {
            title: "Giphy Machine",
            image: {
              url: GifURL,
            },
            color: "#8B0000",
            footer: {
              text: "Requested by " + message.author.tag,
              icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
          }
        });
      });
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
