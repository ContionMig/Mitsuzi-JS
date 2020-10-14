const Util = require('../../util/MitUtil.js');
var randomnumber = require('random-number');

module.exports = {
  name: 'dick',
  description: "The bot will try to guess the user's penis size",
  aliases: ['pp', 'penis'],
  usage: ' [user - Optional]',
  cooldown: 2,
  args: 0,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      var options = { min: 0, max: 12, integer: true }
      let Random = randomnumber(options);

      let RandomPP = "8";
      for (let i = 0; i < Random; i++) {
        RandomPP += "=";
      }
      RandomPP += "D";

      let Message = message.author.username + "'s penis\n" + RandomPP;
      if (message.mentions.users.first()) {
        Message = message.mentions.users.first().username + "'s penis\n" + RandomPP;
      }

      return message.channel.send({
        embed: {
          title: "Penis Machine",
          description: Message,
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
