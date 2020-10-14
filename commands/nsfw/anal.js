const Util = require('../../util/MitUtil.js');
const superagent = require('superagent');

module.exports = {
    name: 'anal',
    description: "Sends a random anal images",
    aliases: ['butthole'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'NSFW',
    async execute(message, args, client) {
        try {
            if (message.channel.nsfw == true) {
                superagent.get('https://nekobot.xyz/api/image').query({ type: 'anal' }).end((err, response) => {
                    return message.channel.send({
                        embed: {
                            title: "NSFW Machine",
                            image: {
                                url: response.body.message,
                            },
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                });
            } else {
                message.reply("This isn't NSFW channel!")
            }
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
