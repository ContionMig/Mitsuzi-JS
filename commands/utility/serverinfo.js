const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'serverinfo',
  description: 'Displays infomation about the server',
  aliases: ['server'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Utility',
  async execute(message, args, client) {
    try {
      let sicon = message.guild.iconURL;
      return message.channel.send({
        embed: {
          title: "Server Info",
          color: "#8B0000",
          footer: {
            text: "Requested by " + message.author.tag,
            icon_url: message.author.displayAvatarURL()
          },
          thumbnail: {
            url: sicon,
          },
          fields: [
            {
              name: '• Name',
              value: message.guild.name,
              inline: true,
            },
            {
              name: '• ID',
              value: message.guild.id,
              inline: true,
            },
            {
              name: '• Owner',
              value: message.guild.owner,
              inline: true,
            },
            {
              name: '• Region',
              value: message.guild.region,
              inline: true,
            },
            {
              name: '• Members',
              value: message.guild.memberCount,
              inline: true,
            },
            {
              name: '• Created',
              value: "```" + message.guild.createdAt + "```",
              inline: false,
            }
          ],
          timestamp: new Date()
        }
      });
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
