const Util = require('../../util/MitUtil.js');
const request = require('superagent');

module.exports = {
  name: 'duck',
  description: "Sends a random duck picture",
  aliases: ['ducks'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Pictures',
  async execute(message, args, client) {
    try {
        const { body } = await request.get('https://random-d.uk/api/v1/random');
        return message.channel.send({
            embed: {
              title: "Duck Machine",
              image: {
                url: body.url,
              },
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
