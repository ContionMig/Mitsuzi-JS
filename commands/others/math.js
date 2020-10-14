const Util = require('../../util/MitUtil.js');
const math = require('mathjs');

module.exports = {
  name: 'math',
  description: "Tries to solve a maths equation",
  aliases: ['maths', 'eval', 'equation'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Others',
  async execute(message, args, client) {
    try {
      let Question = args.join(" ");
      let Answer;
      try {
        Answer = math.evaluate(Question);
      } catch (err) {
        return message.reply(`**Invalid math equation:** ${err}`);
      }

      return message.channel.send({
        embed: {
          title: "Maths  Calculator",
          fields: [
            {
              name: '• Question',
              value: Question,
              inline: false,
            },
            {
              name: '• Answer',
              value: "```" + Answer + "```",
              inline: false,
            },
          ],
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
