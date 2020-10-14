const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'avatar',
  description: 'The bot will repeat what the user has said',
  aliases: ['av', 'pfp'],
  usage: ' [user - Optional]',
  cooldown: 2,
  args: 0,
  catergory: 'Utility',
  async execute(message, args, client) {
    try {
      let ImageURLOptions = { dynamic: true, size: 4096 }
      let Avatar = message.author.avatarURL(ImageURLOptions);
      if (message.mentions.users.first()) {
        Avatar = message.mentions.users.first().avatarURL(ImageURLOptions);
      }

      return message.channel.send({
        embed: {
          title: "Avatar",
          image: {
            url: Avatar,
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
