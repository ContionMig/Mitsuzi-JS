const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'kick',
  description: 'kicks a specific user',
  aliases: ['boot'],
  usage: '[user]',
  cooldown: 2,
  args: 1,
  catergory: 'Moderation',
  async execute(message, args, client) {
    try {
      let KickMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!KickMember) {
        return message.reply("Please make sure you mention a valid user");
      }

      if (!KickMember.kickable) {
        return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
      }

      if (!message.member.hasPermission('KICK_MEMBERS')) {
        return message.reply("Please make sure you have kick perms!")
      }

      let reason = args.slice(1).join(' ');
      if (!reason) reason = "No reason provided";

      KickMember.ban({ reason: reason }).catch(error => message.channel.send(`Sorry ${message.author} I couldn't kick the user`));
      return message.channel.send({
        embed: {
          title: "User Kick",
          description: `**${KickMember.user.tag} has been kicked**`,
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
    }
    catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
