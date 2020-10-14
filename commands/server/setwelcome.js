const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');

module.exports = {
  name: 'setwelcome',
  description: 'Enables/Disables the welcome message module',
  aliases: ['welcome'],
  usage: ' [0/channel]',
  cooldown: 2,
  args: 1,
  catergory: 'Server Settings',
  async execute(message, args, client) {
    try {
      if (!message.member.hasPermission('ADMINISTRATOR')) {
        return message.reply("Please make sure you have administrator perms!")
      }

      let Channel = message.mentions.channels.first();
      if (!Channel || Channel.type != "text" || Channel.deleted) {
        db.set(`${message.guild.id}_welcome`, "0");
        return message.channel.send({
          embed: {
            title: "Welcome Log",
            description: `**Status:** Off`,
            color: "#8B0000",
            footer: {
              text: "Requested by " + message.author.tag,
              icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
          }
        });
      }

      db.set(`${message.guild.id}_welcome`, Channel.id);
      return message.channel.send({
        embed: {
          title: "Welcome Log",
          description: `**Welcome Channel:** ${Channel}`,
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
