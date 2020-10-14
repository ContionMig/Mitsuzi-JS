const Util = require('../../util/MitUtil.js');

module.exports = {
  name: 'choose',
  description: "Chooses a random option that the user provides",
  aliases: ['pick', 'choice'],
  usage: ' [option1] [option2] ...',
  cooldown: 2,
  args: -1,
  catergory: 'Others',
  async execute(message, args, client) {
    try {
      if (args.length == 1) {
        return message.reply("Please have more than 2 options for me to choose from")
      }

      let Choice = Math.floor(Math.random() * args.length);
      while (args[Choice].includes("`")) {
        args[Choice] = args[Choice].replace("`", "");
      }

      let Message = `**Picked:** \`\`${args[Choice]}\`\``;
      return message.channel.send({
        embed: {
          title: `Choose Machine`,
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
