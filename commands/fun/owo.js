const Util = require('../../util/MitUtil.js');
const owo = require('owofy');

module.exports = {
  name: 'owo',
  description: "Owofies the given text!",
  aliases: ['owofy'],
  usage: ' [message]',
  cooldown: 2,
  args: -1,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      let OwOText = args.join(" ");
      let Message = `${owo(OwOText)}`;

      return message.channel.send({
        embed: {
          title: `OwO Machine`,
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
