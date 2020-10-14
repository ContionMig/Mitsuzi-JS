const Util = require('../../util/MitUtil.js');
const request = require('node-superfetch');

module.exports = {
    name: 'xkcd',
    description: "Returns a random xkcd comic",
    aliases: [],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Others',
    async execute(message, args, client) {
        try {
            const current = await request.get('https://xkcd.com/info.0.json');
            const random = Math.floor(Math.random() * current.body.num) + 1;
            const { body } = await request.get(`https://xkcd.com/${random}/info.0.json`);

            return message.channel.send({
                embed: {
                    title: "XKCD Machine",
                    image: {
                        url: body.img,
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
