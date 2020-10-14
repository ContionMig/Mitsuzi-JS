const Util = require('../../util/MitUtil.js');
const {
  prefix,
  token,
  ownerid,
  logchannelid
} = require('../../config.json');


module.exports = {
  name: 'feedback',
  description: 'Sends a suggestion to the developers',
  aliases: ['support', 'suggest'],
  usage: ' [message]',
  cooldown: 2,
  args: -1,
  catergory: 'Utility',
  async execute(message, args, client) {
    try {
      let Message = `**Server Name: ** ${message.guild.name}\n**Author Name:** ${message.author.tag}\n**Feedback:** ${args.join(" ")}`;
      client.users.cache.get(ownerid).send({
        embed: {
          title: "Feedback",
          description: Message,
          color: "#8B0000",
          footer: {
            text: "Requested by " + message.author.tag,
            icon_url: message.author.displayAvatarURL()
          },
          timestamp: new Date()
        }
      });

      return message.channel.send({
        embed: {
          title: "Feedback",
          description: "**Content:** " + args.join(" "),
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
