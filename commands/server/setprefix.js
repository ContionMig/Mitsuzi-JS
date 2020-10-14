const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');

module.exports = {
  name: 'setprefix',
  description: 'Sets a prefix for this server',
  aliases: ['sp'],
  usage: ' [prefix]',
  cooldown: 2,
  args: 1,
  catergory: 'Server Settings',
  async execute(message, args, client) {
    try {
      let ServerPrefix = args[0];
      if (ServerPrefix.length > 5 || ServerPrefix.length < 1) {
        return message.reply("Please choose a prefix which is 1 - 5 characters");
      }

      if (!message.member.hasPermission('ADMINISTRATOR')) {
        return message.reply("Please make sure you have administrator perms!")
      }

      await db.set(`${message.guild.id}_prefix`, ServerPrefix);
      return message.channel.send({
        embed: {
          title: "Server Prefix",
          description: `**New Server Prefix:** ${ServerPrefix}`,
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
