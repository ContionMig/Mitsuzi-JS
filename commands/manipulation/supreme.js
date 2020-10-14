const Util = require('../../util/MitUtil.js');

module.exports = {
    name: 'supreme',
    description: `Responds with supreme image with your text`,
    aliases: ['supremetext'],
    usage: ' [message]',
    cooldown: 2,
    args: -1,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
			let Text = args.join("%20")
			return message.channel.send({
                embed: {
                    title: "Supreme Machine",
                    image: {
                        url: `https://api.alexflipnote.dev/supreme?text=${Text}`
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
