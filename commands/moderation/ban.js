const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'ban',
  description: 'bans a specific user',
  aliases: ['bar', 'outlaw'],
  usage: '[user]',
  cooldown: 2,
  args: -1,
  catergory: 'Moderation',
  async execute(message, args, client) {
    try {
      let BanMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!BanMember) {
        return message.reply("Please make sure you mention a valid user");
      }

      if (!BanMember.bannable) {
        return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
      }

      if (!message.member.hasPermission('BAN_MEMBERS')) {
        return message.reply("Please make sure you have ban perms!")
      }

      let reason = args.slice(1).join(' ');
      if (!reason) reason = "No reason provided";

      BanMember.ban({ reason: reason }).catch(error => message.channel.send(`Sorry ${message.author} I couldn't ban the user`));
      return message.channel.send({
        embed: {
          title: "User Ban",
          description: `**${BanMember.user.tag} has been banned**`,
          fields: [{
            name: '• Reason',
            value: reason,
            inline: false,
          }],
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
