const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'chuck',
  description: "Sends a random Chuck Norris joke",
  aliases: ['chucknorris', 'cn'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      const request = require('superagent')
      request.get('https://api.icndb.com/jokes/random').then(res => {
        if (res.statusCode !== 200) return;
        const ChunkJoke = (JSON.parse(res.text)).value.joke;
        return message.channel.send({
          embed: {
            title: "Chuck Norris Machine",
            description: ChunkJoke,
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
