const Util = require('../../util/MitUtil.js');
var randomnumber = require('random-number');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = {
    name: 'beautiful',
    description: 'Draws a user\'s avatar over Gravity Falls\' "Oh, this? This is beautiful." meme.',
    aliases: ['thisisbeautiful', 'grunkle'],
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

            const base = await loadImage("./include/assets/images/beautiful.png");
            const { body } = await request.get(member.user.displayAvatarURL({ size: 4096, format: 'jpg' }));
            const avatar = await loadImage(body);
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, base.width, base.height);
            ctx.drawImage(avatar, 249, 24, 105, 105);
            ctx.drawImage(avatar, 249, 223, 105, 105);
            ctx.drawImage(base, 0, 0);

            return message.channel.send({
                embed: {
                    title: "Beautiful",
                    image: {
                        url: 'attachment://beautiful.png',
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
                    name: `beautiful.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
