const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'fact',
  description: "The bot will return a random fact",
  aliases: ['facts'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      const request = require('superagent')
      request.get('https://uselessfacts.jsph.pl/random.json?language=en')
        .then(res => {
          if (res.statusCode !== 200 || !res.body.text) return;
          return message.channel.send({
            embed: {
              title: "Fact Machine",
              description: res.body.text,
              color: "#8B0000",
              footer: {
                text: "Requested by " + message.author.tag,
                icon_url: message.author.displayAvatarURL()
              },
              timestamp: new Date()
            }
          });
        })
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
