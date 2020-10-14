const Util = require('../../util/MitUtil.js');
const insulter = require('insult');

module.exports = {
  name: 'insults',
  description: "The bot will try to reply with a random insult",
  aliases: ['insult', 'roast'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      let Message = `${insulter.Insult()}`;
      return message.channel.send({
        embed: {
          title: "Insult Machine",
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
