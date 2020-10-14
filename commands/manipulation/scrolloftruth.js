const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
    name: 'scrolloftruth',
    description: `Sends a "Double D\'s Facts Book" meme with the fact of your choice.`,
    aliases: ['truth', 'scroll'],
    usage: ' [message]',
    cooldown: 2,
    args: -1,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let text = args.join(" ");
            let FullPath = `./include/assets/images/scroll-of-truth.png`;

            registerFont("./include/assets/fonts/Noto-Regular.ttf", { family: 'Noto' });

            const base = await loadImage(FullPath);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.font = '60px Noto';
            let fontSize = 60;
            while (ctx.measureText(text).width > 542) {
                fontSize--;
                ctx.font = `${fontSize}px Noto`;
            }
            const lines = await Util.wrapText(ctx, text, 217);
            const topMost = 850 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
            for (let i = 0; i < lines.length; i++) {
                const height = topMost + ((fontSize + 20) * i);
                ctx.fillText(lines[i], 350, height);
            }

            return message.channel.send({
                embed: {
                    title: "Scroll Of Truth",
                    image: {
                        url: 'attachment://scroll-of-truth.png',
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
                    name: `scroll-of-truth.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
