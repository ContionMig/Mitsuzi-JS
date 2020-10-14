const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');

module.exports = {
  name: 'antispam',
  description: 'Toggles the anti spam module for the server',
  aliases: ['as', 'spam'],
  usage: ' [on/off]',
  cooldown: 2,
  args: 1,
  catergory: 'Server Settings',
  async execute(message, args, client) {
    try {
      let Toggle = args[0].toLowerCase();
      if (Toggle != "off" && Toggle != "on") {
        return message.reply("Please choose a option, on or off!");
      }

      if (!message.member.hasPermission('ADMINISTRATOR')) {
        return message.reply("Please make sure you have administrator perms!")
      }

      db.set(`${message.guild.id}_antispam`, Toggle);
      return message.channel.send({
        embed: {
          title: "Server Anti-Spam",
          description: `**Status:** ${Toggle}`,
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
