const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = {
    name: 'dislike',
    description: 'Sends an "Everyone Disliked That" meme with the image of your choice.',
    aliases: ['disliked'],
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
            const base = await loadImage(body);
            const plate = await loadImage('./include/assets/images/dislike.png');
            const scaleH = plate.width / base.width;
            const height = Math.round(base.height * scaleH);
            const canvas = createCanvas(plate.width, plate.height + height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0, plate.width, height);
            ctx.drawImage(plate, 0, height + 1);
            const attachment = canvas.toBuffer();
            if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');

            return message.channel.send({
                embed: {
                    title: "Everyone Disliked That",
                    image: {
                        url: 'attachment://dislike.png',
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
                    name: `dislike.png`
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
