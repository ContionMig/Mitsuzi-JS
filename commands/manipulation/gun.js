const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = {
    name: 'gun',
    description: 'Draws a gun over an image or a user\'s avatar.',
    aliases: ['shoot'],
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

            const base = await loadImage("./include/assets/images/gun.png");
            const data = await loadImage(member.user.displayAvatarURL({ size: 4096, format: 'jpg' }));
            const canvas = createCanvas(data.width, data.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(data, 0, 0);
            const ratio = (data.height / 2) / base.height;
            const width = base.width * ratio;
            ctx.drawImage(base, data.width - width, data.height - (data.height / 2), width, data.height / 2);
            const attachment = canvas.toBuffer();
            if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');

            return message.channel.send({
                embed: {
                    title: "Hands Up",
                    image: {
                        url: 'attachment://gun.png',
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
                    name: `gun.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
