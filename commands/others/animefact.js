const Util = require('../../util/MitUtil.js');
const randomfact = require('anime-facts');

module.exports = {
    name: 'animefact',
    description: "Replies with a random facts from an anime",
    aliases: ['animefacts', 'af'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Others',
    async execute(message, args, client) {
        try {
            const fact = randomfact.facts()
            return message.channel.send({
                embed: {
                    title: "Anime Fact",
                    description: fact,
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
