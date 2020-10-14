const Util = require('../../util/MitUtil.js');
var morse = require('morse');

module.exports = {
  name: 'morse',
  description: "Translate morse back and forth",
  aliases: ['cryptanalysis'],
  usage: ' [message]',
  cooldown: 2,
  args: -1,
  catergory: 'Others',
  async execute(message, args, client) {
    try {
      let Morse = args.join(" ");

      var encoded = morse.encode(Morse);
      var decode = morse.decode(Morse);

      let Message = `**Encoded:** \`\`\`${encoded}\`\`\`\n`;
      if (Morse.includes(".") || Morse.includes("-")) {
        Message = `**Decoded:** \`\`\`${decode}\`\`\`\n`;
      }

      return message.channel.send({
        embed: {
          title: `Morse Machine`,
          description: Message,
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
