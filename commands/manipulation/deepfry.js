const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = {
    name: 'deepfry',
    description: 'Draws an image or a user\'s avatar but deep-fried.',
    aliases: [],
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

            const { body } = await request.get(member.user.displayAvatarURL({ size: 4096, format: 'jpg' }));
            const data  = await loadImage(body);
            const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0);
			Util.desaturate(ctx, -20, 0, 0, data.width, data.height);
			Util.contrast(ctx, 0, 0, data.width, data.height);
			const attachment = canvas.toBuffer('image/jpeg', { quality: 0.2 });
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');

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
