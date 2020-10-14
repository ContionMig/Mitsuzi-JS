const Util = require('../../util/MitUtil.js');
const animeQuotes = require('animequotes')

module.exports = {
    name: 'animequotes',
    description: "Replies with a random quote from an anime",
    aliases: ['animequote', 'aq'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Others',
    async execute(message, args, client) {
        try {
            let Quote = animeQuotes.randomQuote();
            if (args[0]) {
                if (!isNaN(args[0]) && args[0] < 8511 && args[0] > 0) {
                    Quote = animeQuotes.getQuote(args[0]);
                }
            }

            let Message = `**${Quote.name}:** ${Quote.quote}`;
            return message.channel.send({
                embed: {
                    title: Quote.anime,
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
