const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'dog',
  description: "Sends a random dog",
  aliases: ['dogs', 'doggo', 'randomdog', 'woof'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Pictures',
  async execute(message, args, client) {
    try {
      const request = require('superagent')
      request.get('https://random.dog/woof.json?filter=mp4,webm').then(res => {
        if (res.statusCode !== 200) return;
        const DgoPics = (JSON.parse(res.text)).url;
        return message.channel.send({
          embed: {
            title: "Dog Machine",
            image: {
              url: DgoPics,
            },
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
