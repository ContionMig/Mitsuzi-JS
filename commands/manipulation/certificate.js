const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage, registerFont } = require('canvas');
const moment = require('moment');

module.exports = {
    name: 'certificate',
    description: "Sends a certificate of excellence with the name and reason of your choice.",
    aliases: ['award', 'cert'],
    usage: ' [name],[message]',
    cooldown: 2,
    args: -1,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let Full = args.join(" ");
            let Split = Full.split(",");

            let name = Split[0];
            let reason = Split[1];

            const base = await loadImage(`./include/assets/images/certificate.png`);
            registerFont("./include/assets/fonts/oldengl.ttf", { family: 'Old English Text MT' });

            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.font = '30px Old English Text MT';
            ctx.textBaseline = 'top';
            ctx.textAlign = 'center';
            ctx.fillText(reason, 518, 273);
            ctx.fillText(name, 518, 419);
            ctx.fillText(moment().format('MM/DD/YYYY'), 309, 503);

            return message.channel.send({
                embed: {
                    title: "Certificate Machine",
                    image: {
                        url: 'attachment://certificate.png',
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
                    name: `certificate.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
