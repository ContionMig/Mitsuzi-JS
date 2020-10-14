const Util = require('../../util/MitUtil.js');
const request = require('node-superfetch');

module.exports = {
  name: 'fox',
  description: "Sends a random foxes",
  aliases: ['foxes'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Pictures',
  async execute(message, args, client) {
    try {
        const { body } = await request.get('https://randomfox.ca/floof/');
        return message.channel.send({
                embed: {
                  title: "Fox Machine",
                  image: {
                    url: body.image,
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
