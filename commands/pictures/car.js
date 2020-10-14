const Util = require('../../util/MitUtil.js');
var request = require('request');

module.exports = {
  name: 'car',
  description: "Sends a random picture of a car",
  aliases: ['cars'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Pictures',
  async execute(message, args, client) {
    try {
      let imgs = Math.floor(Math.random() * 80);
      let url = ['https://www.reddit.com/r/carporn/.json?sort=rising&t=hour&limit=100'];
      request({
        method: 'GET',
        uri: url[Math.floor(Math.random() * url.length)]
      }, function (err, response, data) {
        if (err) {
          return console.log(err, null);
        }

        data = JSON.parse(data);
        var mainObj = data.data.children;
        var urls = {};

        for (let i = 0; i < mainObj.length; i++) {
          let url = mainObj[i].data.url;
          urls[i + 1] = url;
        }

        return message.channel.send({
          embed: {
            image: {
              url: urls[imgs],
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
