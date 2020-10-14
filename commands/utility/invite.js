const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'invite',
  description: 'Sends the invite code for the bot',
  aliases: ['link'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Utility',
  async execute(message, args, client) {
    try {
      return message.channel.send({
        embed: {
          title: "Invite Link",
          url: 'https://discord.com/oauth2/authorize?client_id=725245167199584277&scope=bot&permissions=506850422',
          description: "Click on the title to invite the bot into your own server!",
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
