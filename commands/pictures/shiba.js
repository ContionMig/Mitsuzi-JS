const Util = require('../../util/MitUtil.js');
const request = require('node-superfetch');

module.exports = {
  name: 'shiba',
  description: "Sends a random shiba",
  aliases: ['doge', 'shibe'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Pictures',
  async execute(message, args, client) {
    try {
        const { body } = await request
            .get('https://shibe.online/api/shibes')
            .query({
                count: 1,
                urls: true,
                httpsUrls: true
            });

        return message.channel.send(
            {
                embed: {
                  title: "Shiba Machine",
                  image: {
                    url: body[0],
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
