const Util = require('../../util/MitUtil.js');
const answers = [
  'Signs point to yes.',
  'Yes.',
  'Reply hazy, try again.',
  'Without a doubt.',
  'My sources say no.',
  'As I see it, yes.',
  'You may rely on it.',
  'Concentrate and ask again.',
  'Outlook not so good.',
  'It is decidedly so.',
  'Better not tell you now.',
  'Very doubtful.',
  'Yes - definitely.',
  'It is certain.',
  'Cannot predict now.',
  'Most likely.',
  'Ask again later.',
  'My reply is no.',
  'Outlook good.',
  'Don\'t count on it.',
  'Who cares?',
  'Never, ever, ever.',
  'Possibly.',
  'There is a small chance.'
]

module.exports = {
  name: '8ball',
  description: "The bot will try to use a 8ball to answer your question",
  aliases: ['ball', 'ask'],
  usage: ' [question]',
  cooldown: 2,
  args: -1,
  catergory: 'Fun',
  async execute(message, args, client) {
    try {
      let Message = `The magic 8 ball says: \`${answers[Math.floor(Math.random() * answers.length)]}\``;
      return message.channel.send({
        embed: {
          title: "8ball Machine",
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
