const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
    name: 'factbook',
    description: `Sends a "Double D\'s Facts Book" meme with the fact of your choice.`,
    aliases: ['eddfact', 'eddfacts'],
    usage: ' [message]',
    cooldown: 2,
    args: -1,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let fact = args.join(" ");
            let FullPath = `./include/assets/images/edd-facts-book.png`;

            registerFont("./include/assets/fonts/Noto-Regular.ttf", { family: 'Noto' });

            const base = await loadImage(FullPath);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.drawImage(base, 0, 0);
            ctx.rotate(15 * (Math.PI / 180));
            ctx.font = '30px Noto';
            let fontSize = 30;
            while (ctx.measureText(fact).width > 458) {
                fontSize--;
                ctx.font = `${fontSize}px Noto`;
            }
            const lines = await Util.wrapText(ctx, fact, 183);
            ctx.fillText(lines.join('\n'), 119, 306, 183);
            ctx.rotate(-15 * (Math.PI / 180));

            return message.channel.send({
                embed: {
                    title: "Fact Book",
                    image: {
                        url: 'attachment://edd-facts-book.png',
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
                    name: `edd-facts-book.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
