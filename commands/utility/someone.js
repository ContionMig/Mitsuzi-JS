const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'someone',
  description: 'The bot will reply with a random person',
  aliases: ['something', 'randompick', 'person'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Utility',
  async execute(message, args, client) {
    try {
      const member = message.guild.members.cache.random(1)[0];
      return message.channel.send({
        embed: {
          title: "Random Person Machine",
          color: "#8B0000",
          fields: [{
            name: '• Username',
            value: member.user.username,
            inline: false,
          },
          {
            name: '• Discriminator',
            value: member.user.discriminator,
            inline: false,
          },
          {
            name: '• User ID',
            value: member.user.id,
            inline: false,
          }
          ],
          thumbnail: {
            url: member.user.displayAvatarURL(),
          },
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
