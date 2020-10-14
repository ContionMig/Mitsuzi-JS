const Util = require('../../util/MitUtil.js');
const fs = require('fs');

let rawdata = fs.readFileSync('./include/assets/json/topics.json');
let Game = JSON.parse(rawdata);

module.exports = {
  name: 'topic',
  description: "The bot provide a topic to talk about",
  aliases: ['topics'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      
      let Topics = Game["topics"];
      let Topic = Topics[Math.floor(Math.random() * Topics.length)]

      return message.channel.send({
        embed: {
          title: Topic,
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
