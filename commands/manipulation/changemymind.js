const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
    name: 'changemymind',
    description: `Sends a "Change My Mind" meme with the text of your choice.`,
    aliases: ['changemind', 'mindchange'],
    usage: ' [message]',
    cooldown: 2,
    args: -1,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let text = args.join(" ");
            let FullPath = `./include/assets/images/change-my-mind.png`;

            registerFont("./include/assets/fonts/Noto-Regular.ttf", { family: 'Noto' });

            const base = await loadImage(FullPath);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.drawImage(base, 0, 0);
            ctx.rotate(-6 * (Math.PI / 180));
            ctx.font = '28px Noto';
            let fontSize = 28;
            while (ctx.measureText(text).width > 309) {
                fontSize--;
                ctx.font = `${fontSize}px Noto`;
            }
            const lines = await Util.wrapText(ctx, text, 206);
            ctx.fillText(lines.join('\n'), 184, 253, 206);
            ctx.rotate(6 * (Math.PI / 180));

            return message.channel.send({
                embed: {
                    title: "Change My Mind",
                    image: {
                        url: 'attachment://change-my-mind.png',
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
                    name: `change-my-mind.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
