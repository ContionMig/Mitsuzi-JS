const Util = require('../../util/MitUtil.js');
var randomnumber = require('random-number');

module.exports = {
  name: 'simp',
  description: "The bot will try to guess how simp the user is",
  aliases: ['simprate'],
  usage: ' [user - Optional]',
  cooldown: 2,
  args: 0,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      var options = { min: 0, max: 100, integer: true }
      let SimpRate = randomnumber(options) + "%";

      let Message = message.author.username + " is " + SimpRate + " simp <:5702_SimpPills:706696559395340330>";
      if (message.mentions.users.first()) {
        Message = message.mentions.users.first().username + " is " + SimpRate + " simp <:5702_SimpPills:706696559395340330>";
      }

      return message.channel.send({
        embed: {
          title: "Simp Machine",
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
