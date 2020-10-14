const Util = require('../../util/MitUtil.js');

module.exports = {
    name: 'pornhub',
    description: `Responds with pornhub image with your text`,
    aliases: ['pornhubtext'],
    usage: ' [text1] [text2]',
    cooldown: 2,
    args: 2,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
			return message.channel.send({
                embed: {
                    title: "PornHub Machine",
                    image: {
                        url: `https://api.alexflipnote.dev/pornhub?text=${args[0]}&text2=${args[1]}`
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
