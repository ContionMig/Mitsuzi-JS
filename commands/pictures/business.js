const Util = require('../../util/MitUtil.js');
var randomCat = require('random-cat');

module.exports = {
    name: 'business',
    description: "Sends a random business",
    aliases: [],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Pictures',
    async execute(message, args, client) {
        try {
            var url = randomCat.get({
                category: 'business'
            });
            return message.channel.send({
                embed: {
                    title: "Business Machine",
                    image: {
                        url: url,
                    },
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
