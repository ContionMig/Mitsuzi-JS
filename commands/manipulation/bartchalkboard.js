const Util = require('../../util/MitUtil.js');
var randomnumber = require('random-number');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
    name: 'bartchalkboard',
    description: `Sends a "Bart Chalkboard" meme with the text of your choice.`,
    aliases: ['bart', 'chalkboard'],
    usage: ' [message]',
    cooldown: 2,
    args: -1,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let text = args.join(" ");
            let FullPath = `./include/assets/images/bart-chalkboard.png`;
            registerFont("./include/assets/fonts/akbar.ttf", { family: 'Akbar' });

            const base = await loadImage(FullPath);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.textBaseline = 'top';
            ctx.font = '19px Akbar';
            ctx.fillStyle = 'white';
            const shortened = Util.shortenText(ctx, text.toUpperCase(), 500);
            const arr = [];
            for (let i = 0; i < 12; i++) arr.push(shortened);
            ctx.fillText(arr.join('\n'), 30, 27);

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
