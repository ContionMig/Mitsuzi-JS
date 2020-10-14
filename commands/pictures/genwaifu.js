const Util = require('../../util/MitUtil.js');
const request = require('superagent');

module.exports = {
  name: 'genwaifu',
  description: "Responds with a randomly generated waifu which doesn't exist.",
  aliases: [],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Pictures',
  async execute(message, args, client) {
    try {
        const num = Math.floor(Math.random() * 100000);
        return message.channel.send({
            embed: {
              title: "Waifu Machine",
              image: {
                url: `https://www.thiswaifudoesnotexist.net/example-${num}.jpg`,
              },
              color: "#8B0000",
              footer: {
                text: "Requested by " + message.author.tag,
                icon_url: message.author.displayAvatarURL()
              },
              timestamp: new Date()
            }
          });
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
