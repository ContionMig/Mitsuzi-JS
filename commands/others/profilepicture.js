const Util = require('../../util/MitUtil.js');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'profilepicture',
    description: `Provides you with a custom profile picture based on your text`,
    aliases: ['customprofile'],
    usage: ' [message]',
    cooldown: 2,
    args: -1,
    catergory: 'Others',
    async execute(message, args, client) {
        try {
			let Text = args.join("%20")
			return message.channel.send({
                embed: {
                    title: "Profile Picture Machine",
                    image: {
                        url: `https://api.adorable.io/avatars/285/${Text}.png`
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
