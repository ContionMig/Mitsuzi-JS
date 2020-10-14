const Util = require('../../util/MitUtil.js');
const ud = require('urban-dictionary')

module.exports = {
  name: 'urban',
  description: "The bot will try to find a defination from the given word",
  aliases: ['defination', 'define'],
  usage: ' [word]',
  cooldown: 2,
  args: -1,
  catergory: 'Others',
  async execute(message, args, client) {
    try {
      if (message.channel.nsfw == true) {
        let SearchTerm = args[0];
        if (args.length > 1) {
          SearchTerm = args.join("+");
        }

        ud.term(SearchTerm, (error, entries, tags, sounds) => {
          if (error) {
            console.error(error.message);
            return message.reply(+"The word you entered could not be found!");
          } else {
            let Description = "** Word: ** " + entries[0].word + "\n\n";
            Description += "** Definition: **\n" + entries[0].definition + "\n\n";
            Description += "** Example: **\n" + entries[0].example + "\n\n";

            return message.channel.send({
              embed: {
                title: "Urban Machine",
                description: Description,
                color: "#8B0000",
                footer: {
                  text: "Requested by " + message.author.tag,
                  icon_url: message.author.displayAvatarURL()
                },
                timestamp: new Date()
              }
            });
          }
        })
      } else {
        message.reply("This isn't NSFW channel!")
      }
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }
};
