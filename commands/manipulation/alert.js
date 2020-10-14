const Util = require('../../util/MitUtil.js');
var randomnumber = require('random-number');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
    name: 'alert',
    description: "Sends a Presidential Alert message with the text of your choice.",
    aliases: ['emergency'],
    usage: ' [message]',
    cooldown: 2,
    args: -1,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let quote = args.join(" ");
            let FullPath = `./include/assets/images/alert.png`;
            registerFont("./include/assets/fonts/SF-Pro-Display-Medium.otf", { family: 'SF Pro' });

            const base = await loadImage(FullPath);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.font = '30px SF Pro';
            ctx.fillStyle = '#1f1f1f';
            ctx.textBaseline = 'top';
            let text = await Util.wrapText(ctx, quote, 540);
            text = text.length > 3 ? `${text.slice(0, 3).join('\n')}...` : text.join('\n');
            ctx.fillText(text, 48, 178);

            return message.channel.send({
                embed: {
                    title: "Presidential Alert",
                    image: {
                        url: 'attachment://ace-attorney.png',
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
                    name: `ace-attorney.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
