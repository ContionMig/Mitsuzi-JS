const Util = require('../../util/MitUtil.js');
var randomnumber = require('random-number');

module.exports = {
  name: 'retard',
  description: "The bot will try to guess how retarded the user is",
  aliases: ['stupid', 'dumb'],
  usage: ' [user - Optional]',
  cooldown: 2,
  args: 0,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      var options = { min: 0, max: 100, integer: true }
      let RetardRate = randomnumber(options) + "%";

      let Message = message.author.username + " is " + RetardRate + " retarded :speaking_head:";
      if (message.mentions.users.first()) {
        Message = message.mentions.users.first().username + " is " + RetardRate + " retarded :speaking_head:";
      }

      return message.channel.send({
        embed: {
          title: "Retard Machine",
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
