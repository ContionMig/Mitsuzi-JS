const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'say',
  description: 'The bot will repeat what the user has said',
  aliases: ['repeat'],
  usage: ' [message]',
  cooldown: 2,
  args: -1,
  catergory: 'Utility',
  async execute(message, args, client) {
    try {
      return message.channel.send({
        embed: {
          title: "Repeat After Me",
          description: args.join(" "),
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
