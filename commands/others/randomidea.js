const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'randomidea',
  description: "Sends a random idea",
  aliases: ['ridea', 'ri'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Others',
  async execute(message, args, client) {
    try {
      const request = require('superagent')
      request.get('http://itsthisforthat.com/api.php?text').then(res => {
        if (res.statusCode !== 200) return;
        return message.channel.send({
          embed: {
            title: res.text,
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
