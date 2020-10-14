const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'clap',
  description: "Adds 👏 inbetween every word",
  aliases: [],
  usage: ' [message]',
  cooldown: 2,
  args: -1,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      let Message = args.join(" 👏 ");

      return message.channel.send({
        embed: {
          title: `Clap Machine`,
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
