const Util = require('../../util/MitUtil.js');
const statuses = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline"
};

module.exports = {
  name: 'userinfo',
  description: "Displays infomation about the user",
  aliases: ['ui', 'user'],
  usage: ' [user - Optional]',
  cooldown: 2,
  args: 0,
  catergory: 'Utility',
  async execute(message, args, client) {
    try {
      let member = message.guild.member(message.author);
      if (message.mentions.users.first()) {
        member = message.guild.member(message.mentions.users.first());
      }

      const days = Math.floor((new Date() - member.user.createdAt) / (1000 * 60 * 60 * 24));
      const joinedDays = Math.floor((new Date() - member.joinedAt) / (1000 * 60 * 60 * 24));

      let DateNow = new Date();
      return message.channel.send({
        embed: {
          title: "User Info",
          color: "#8B0000",
          thumbnail: {
            url: member.user.displayAvatarURL({
              size: 512
            }),
          },
          fields: [{
            name: '• Name',
            value: member.user.tag,
            inline: true,
          },
          {
            name: '• ID',
            value: member.id,
            inline: true,
          },
          {
            name: '• Discord Join Date',
            value: `${member.user.createdAt.toDateString()} ( ${days} days ago! )`,
            inline: true,
          },
          {
            name: '• Server Join Date',
            value: `${member.joinedAt.toDateString()} ( ${joinedDays} days ago! )`,
            inline: true,
          },
          {
            name: '• Status',
            value: statuses[member.presence.status],
            inline: true,
          },
          {
            name: '• Bot',
            value: member.user.bot ? "Yes" : "No",
            inline: true,
          },
          {
            name: '• Highest Role',
            value: member.roles.cache.size > 1 ? member.roles.highest.name : "None",
            inline: true,
          },
          {
            name: '• Hoist Role',
            value: member.roles.hoist ? member.roles.hoist.name : "None",
            inline: true,
          }
          ],
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
