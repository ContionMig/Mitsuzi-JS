const Util = require('../../util/MitUtil.js');
var randomnumber = require('random-number');

module.exports = {
  name: 'gay',
  description: "The bot will try to guess how gay the user is",
  aliases: ['gayrate', 'howgay'],
  usage: ' [user - Optional]',
  cooldown: 2,
  args: 0,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      var options = { min: 0, max: 100, integer: true }
      let GayRate = randomnumber(options) + "% :rainbow_flag:";

      let Message = message.author.username + "'s gayness is " + GayRate;
      if (message.mentions.users.first()) {
        Message = message.mentions.users.first().username + "'s gayness is " + GayRate;
      }

      return message.channel.send({
        embed: {
          title: "Gayness Machine",
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
