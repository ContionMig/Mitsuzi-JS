const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    name: 'youdied',
    description: 'Sends a "You Died" screen over an image or a user\'s avatar.',
    aliases: ['dead', 'died', 'die'],
    usage: ' [user]',
    cooldown: 2,
    args: 0,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let member = message.guild.member(message.author);
            if (message.mentions.users.first()) {
                member = message.guild.member(message.mentions.users.first());
            }

            const base = await loadImage("./include/assets/images/you-died.png");
            const data = await loadImage(member.user.displayAvatarURL({ size: 4096, format: 'jpg' }));
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            Util.drawImageWithTint(ctx, data, 'black', 0, 0, data.width, data.height);
            Util.greyscale(ctx, 0, 0, data.width, data.height);
            const { x, y, width, height } = Util.centerImage(base, data);
            ctx.drawImage(base, x, y, width, height);
            const attachment = canvas.toBuffer();
            if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');

            return message.channel.send({
                embed: {
                    title: "You Died",
                    image: {
                        url: 'attachment://you-died.png',
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
                    name: `you-died.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
