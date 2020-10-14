const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    name: 'worthless',
    description: 'Draws an image or a user\'s avatar over Gravity Falls\' "This is worthless." meme.',
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

            const base = await loadImage("./include/assets/images/worthless.png");
			const data = await loadImage(member.user.displayAvatarURL({ size: 4096,format: 'jpg' }));
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			ctx.rotate(6 * (Math.PI / 180));
			const center1 = Util.centerImagePart(data, 400, 400, 496, 183);
			ctx.drawImage(data, center1.x, center1.y, center1.width, center1.height);
			ctx.rotate(-6 * (Math.PI / 180));
			ctx.translate(canvas.width / 2, canvas.height / 2);
			ctx.rotate(160 * (Math.PI / 180));
			ctx.translate(-(canvas.width / 2), -(canvas.height / 2));
			const center2 = Util.centerImagePart(data, 75, 75, 625, 55);
			ctx.drawImage(data, center2.x, center2.y, center2.width, center2.height);
			ctx.rotate(-160 * (Math.PI / 180));
            
            return message.channel.send({
                embed: {
                    title: "Worthless",
                    image: {
                        url: 'attachment://worthless.png',
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
                    name: `worthless.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
