const Util = require('../../util/MitUtil.js');
const map = {
  a: '4',
  e: '3',
  f: 'ph',
  l: '1',
  o: '0',
  s: '5',
  t: '7',
  y: '`/'
}

module.exports = {
  name: 'leet',
  description: 'Translates what the user has typed to leet speak',
  aliases: ['leetspeak', 'leetspeech', 'l33t'],
  usage: ' [message]',
  cooldown: 2,
  args: -1,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      let Content = args.join(" ");
      for (const y in map) {
        Content = Content.replace(new RegExp(y, 'g'), map[y])
      }

      return message.channel.send({
        embed: {
          title: "Leet Machine",
          description: Content,
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
