const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
    name: 'newpassword',
    description: 'Sends a "Weak Password/Strong Password" meme with the passwords of your choice.',
    aliases: [],
    usage: ' [weak],[strong]',
    cooldown: 2,
    args: -1,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let weak, strong;
            let text = args.join(" ").split(",");
            if (text.length < 2) {
                return message.reply("Inproper usage, example ``+newpassword Knees,Arms``")
            }
            weak = text[0];
            strong = text[1];

            let FullPath = `./include/assets/images/new-password.png`;
            registerFont("./include/assets/fonts/Noto-Regular.ttf", { family: 'Noto' });

            const base = await loadImage(FullPath);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(base, 0, 0);
            ctx.font = '25px Noto';
            ctx.fillText(Util.shortenText(ctx, weak, 390), 40, 113);
            ctx.fillText(Util.shortenText(ctx, strong, 390), 40, 351);

            return message.channel.send({
                embed: {
                    title: "Weak/Strong Password",
                    image: {
                        url: 'attachment://new-password.png',
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
                    name: `new-password.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
