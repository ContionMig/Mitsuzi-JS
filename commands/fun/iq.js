const Util = require('../../util/MitUtil.js');
var randomnumber = require('random-number');

module.exports = {
  name: 'iq',
  description: "The bot will try to guess the user's IQ",
  aliases: ['aptitude'],
  usage: ' [user - Optional]',
  cooldown: 2,
  args: 0,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      var options = { min: 20, max: 170, integer: true }
      const RandomIQ = randomnumber(options);

      let Message = "Your IQ is " + RandomIQ + " :brain:";
      if (message.mentions.users.first()) {
        Message = message.mentions.users.first().username + " IQ is " + RandomIQ + " :brain:";
      }

      return message.channel.send({
        embed: {
          title: "IQ Measurement Machine",
          description: Message,
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
