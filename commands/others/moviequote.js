const Util = require('../../util/MitUtil.js');
const cq = require('crazy-quotes');

module.exports = {
    name: 'moviequote',
    description: "Replies with a random quote from a movie",
    aliases: ['moviequotes', 'mq'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Others',
    async execute(message, args, client) {
        try {
            let Quote = cq.oneQuote();

            let Message = `**${Quote.character}:** ${Quote.quote}`;
            return message.channel.send({
                embed: {
                    title: Quote.spokeIn,
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
