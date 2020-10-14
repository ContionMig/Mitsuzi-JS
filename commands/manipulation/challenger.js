const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = {
    name: 'challenger',
    description: 'Draws an image or a user\'s avatar over Smash Bros.\'s "Challenger Approaching" screen.',
    aliases: ['approaching'],
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

            let silhouetted = true;
            const base = await loadImage("./include/assets/images/challenger.png");
            const { body } = await request.get(member.user.displayAvatarURL({ size: 4096, format: 'jpg' }));
            const data  = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			const { x, y, width, height } = Util.centerImagePart(data, 256, 256, 484, 98);
			ctx.drawImage(silhouetted ? this.silhouetteImage(data) : data, x, y, width, height);

            return message.channel.send({
                embed: {
                    title: "Challenger",
                    image: {
                        url: 'attachment://challenger.png',
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
                    name: `challenger.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    },

    silhouetteImage(image) {
		if (!Util.hasAlpha(image)) return image;
		const canvas = createCanvas(image.width, image.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		Util.silhouette(ctx, 0, 0, image.width, image.height);
		return canvas;
	}
};
