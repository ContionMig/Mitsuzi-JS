const Util = require('../../util/MitUtil.js');
var randomnumber = require('random-number');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
    name: 'chiidea',
    description: 'Sends a "Daddy, I\'ve got an idea!" Takagi-san meme with the text of your choice.',
    aliases: ['anidea', 'idea'],
    usage: ' [message]',
    cooldown: 2,
    args: -1,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let text = args.join(" ");
            let FullPath = `./include/assets/images/chi-idea.png`;
            registerFont("./include/assets/fonts/wildwordsroman.ttf", { family: 'Wild Words' });

            const base = await loadImage(FullPath);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.font = '15px Wild Words';
            let fontSize = 15;
            while (ctx.measureText(text).width > 500) {
                fontSize--;
                ctx.font = `${fontSize}px Wild Words`;
            }
            const lines = await Util.wrapText(ctx, text, 83);
            const topMost = 137 - (((fontSize * lines.length) / 2) + ((5 * (lines.length - 1)) / 2));
            for (let i = 0; i < lines.length; i++) {
                const height = topMost + ((fontSize + 5) * i);
                ctx.fillText(lines[i], 70, height);
            }

            return message.channel.send({
                embed: {
                    title: "Daddy idea",
                    image: {
                        url: 'attachment://chi-idea.png',
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
                    name: `chi-idea.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
