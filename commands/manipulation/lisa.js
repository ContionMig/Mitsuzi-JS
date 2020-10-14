const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
    name: 'lisa',
    description: 'Sends a "Lisa Presentation" meme with the presentation of your choice.',
    aliases: ['presentation'],
    usage: ' [message]',
    cooldown: 2,
    args: -1,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let text  = args.join(" ");
            let FullPath = `./include/assets/images/lisa-presentation.png`;
            registerFont("./include/assets/fonts/Noto-Regular.ttf", { family: 'Noto' });

            const base = await loadImage(FullPath);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.font = '40px Noto';
            let fontSize = 40;
            while (ctx.measureText(text).width > 1320) {
                fontSize--;
                ctx.font = `${fontSize}px Noto`;
            }
            const lines = await Util.wrapText(ctx, text, 330);
            const topMost = 185 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
            for (let i = 0; i < lines.length; i++) {
                const height = topMost + ((fontSize + 20) * i);
                ctx.fillText(lines[i], base.width / 2, height);
            }

            return message.channel.send({
                embed: {
                    title: "Lisa Presentation",
                    image: {
                        url: 'attachment://presentation.png',
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
                    name: `presentation.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
