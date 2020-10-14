const Util = require('../../util/MitUtil.js');
const fs = require('fs');

let rawdata = fs.readFileSync('./include/assets/json/affirmations.json');
let Game = JSON.parse(rawdata);

module.exports = {
  name: 'affirmations',
  description: "Sends a cheerful motivation text",
  aliases: ['affirmation', 'motivation'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Others',
  async execute(message, args, client) {
    try {
      
      let Affirmations = Game["affirmations"];
      let Affirmation = Affirmations[Math.floor(Math.random() * Affirmations.length)]

      return message.channel.send({
        embed: {
          title: Affirmation,
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
