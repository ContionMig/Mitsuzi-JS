const Util = require('../../util/MitUtil.js');
const request = require('node-superfetch');

module.exports = {
    name: 'catfacts',
    description: "Replies with a random fact about cats",
    aliases: ['catfact'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Fun',
    async execute(message, args, client) {
        try {
            const { body } = await request.get('https://cat-fact.herokuapp.com/facts/random');

            return message.channel.send({
                embed: {
                    title: "Cat Facts",
                    description: body.text,
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
