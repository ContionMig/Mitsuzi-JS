const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'advice',
  description: 'The bot will tell you a random advice',
  aliases: ['advises', 'advices', 'advise'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Fun',
  async execute(message, args, client) {
    const request = require('superagent')
    const res = await request.get('https://api.adviceslip.com/advice')
    try {
      const advice = (JSON.parse(res.text)).slip.advice
      return message.channel.send({
        embed: {
          title: "Advice Machine",
          description: advice,
          color: "#8B0000",
          footer: {
            text: "Requested by " + message.author.tag,
            icon_url: message.author.displayAvatarURL()
          },
          timestamp: new Date()
        }
      });
    } catch (e) {
      console.error(e)
    }
  }
};
