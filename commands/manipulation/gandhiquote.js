const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage, registerFont } = require('canvas');
const moment = require('moment');

module.exports = {
    name: 'gandhiquote',
    description: "Makes Mahatma Gandhi say the quote you want.",
    aliases: ['gandhi', 'mahatmagandhi'],
    usage: ' [message]',
    cooldown: 2,
    args: -1,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let quote  = args.join(" ");
            const base = await loadImage(`./include/assets/images/gandhi-quote.png`);
            registerFont("./include/assets/fonts/lmroman10-italic.otf", { 	family: 'Latin Modern Roman', style: 'italic' });

            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.font = 'italic 50px Latin Modern Roman';
            ctx.fillStyle = 'white';
            let fontSize = 50;
            while (ctx.measureText(quote).width > 945) {
                fontSize--;
                ctx.font = `italic ${fontSize}px Latin Modern Roman`;
            }
            const lines = await Util.wrapText(ctx, quote, 270);
            const topMost = 180 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
            for (let i = 0; i < lines.length; i++) {
                const height = topMost + ((fontSize + 20) * i);
                ctx.fillText(lines[i], 395, height);
            }

            return message.channel.send({
                embed: {
                    title: "Gandhi Quote Machine",
                    image: {
                        url: 'attachment://gandhiquote.png',
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
                    name: `gandhiquote.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
