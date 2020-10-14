const Util = require('../../util/MitUtil.js');
var randomnumber = require('random-number');
const { createCanvas, loadImage, registerFont } = require('canvas');
let Images = ['apollo', 'edgeworth', 'phoenix'];

module.exports = {
    name: 'aceattorney',
    description: "Sends a text box from Ace Attorney with the quote and character of your choice.",
    aliases: ['aa', 'aa-quote'],
    usage: ' [message]',
    cooldown: 2,
    args: -1,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let quote = args.join(" ");
            let RandomImage = Images[Math.floor(Math.random() * Images.length)];
            let FullPath = `./include/assets/images/ace-attorney/${RandomImage}.png`;
            registerFont("./include/assets/fonts/Ace-Attorney.ttf", { family: 'Ace Attorney' });

            const base = await loadImage(FullPath);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.font = '14px Ace Attorney';
            ctx.fillStyle = 'white';
            ctx.textBaseline = 'top';
            ctx.fillText(Util.firstUpperCase(RandomImage), 6, 176);
            let text = await Util.wrapText(ctx, quote, 242);
            text = text.length > 5 ? `${text.slice(0, 5).join('\n')}...` : text.join('\n');
            ctx.fillText(text, 7, 199);

            return message.channel.send({
                embed: {
                    title: "Ace Attorney",
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
