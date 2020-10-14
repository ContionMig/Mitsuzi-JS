const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    name: 'worsehitler',
    description: `Draws a user\'s avatar over Family Guy\'s "Worse Than Hitler" meme.`,
    aliases: ['hitler'],
    usage: ' [user]',
    cooldown: 2,
    args: 0,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let member = message.guild.member(message.author);
            if (message.mentions.users.first()) {
                member = message.guild.member(message.mentions.users.first());
            }

            const base = await loadImage("./include/assets/images/worse-than-hitler.png");
			const avatar = await loadImage(member.user.displayAvatarURL({ size: 4096,format: 'jpg' }));
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 47, 42, 140, 140);

            return message.channel.send({
                embed: {
                    title: "Worse Than Hitler",
                    image: {
                        url: 'attachment://worse-than-hitler.png',
                    },
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                },
                files: [{
                    attachment: canvas.toBuffer(),
                    name: `worse-than-hitler.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
