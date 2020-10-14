const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
    name: 'caution',
    description: "Creates a caution sign with the text of your choice.",
    aliases: [],
    usage: ' [message]',
    cooldown: 2,
    args: -1,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let text = args.join(" ");
            const base = await loadImage(`./include/assets/images/caution.png`);
            registerFont("./include/assets/fonts/Noto-Bold.ttf", { family: 'Noto', weight: 'bold' });

            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.font = 'normal bold 60px Noto';
            let fontSize = 60;
            while (ctx.measureText(text).width > 3311) {
                fontSize--;
                ctx.font = `normal bold ${fontSize}px Noto`;
            }
            const lines = await Util.wrapText(ctx, text.toUpperCase(), 895);
            const topMost = 470 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
            for (let i = 0; i < lines.length; i++) {
                const height = topMost + ((fontSize + 20) * i);
                ctx.fillText(lines[i], base.width / 2, height);
            }

            return message.channel.send({
                embed: {
                    title: "Caution Machine",
                    image: {
                        url: 'attachment://caution.png',
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
                    name: `caution.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
