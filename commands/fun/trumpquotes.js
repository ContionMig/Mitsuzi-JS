const Util = require('../../util/MitUtil.js');
const request = require('node-superfetch');

module.exports = {
    name: 'trumpquotes',
    description: "Replies with a random quote from trump",
    aliases: ['trumpquote'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Fun',
    async execute(message, args, client) {
        try {
            const { body } = await request.get('https://www.tronalddump.io/random/quote');

            return message.channel.send({
                embed: {
                    title: "Trump Quotes",
                    description: body.value,
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
