const Util = require('../../util/MitUtil.js');
const yoMamma = require('yo-mamma').default;

module.exports = {
  name: 'yomama',
  description: "The bot will try to reply with a random yo mama joke",
  aliases: ['mama'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      let Message = `${yoMamma()}`;
      return message.channel.send({
        embed: {
          title: "Yo Mama Machine",
          description: Message,
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
