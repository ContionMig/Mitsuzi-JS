const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = {
    name: 'bobross',
    description: 'Draws an image or a user\'s avatar over Bob Ross\' canvas.',
    aliases: ['ross'],
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

            const base = await loadImage("./include/assets/images/bob-ross.png");
            const data = await loadImage(member.user.displayAvatarURL({ size: 4096, format: 'jpg' }));
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, base.width, base.height);
            const { x, y, width, height } = Util.centerImagePart(data, 440, 440, 15, 20);
            ctx.drawImage(data, x, y, width, height);
            ctx.drawImage(base, 0, 0);
            return message.channel.send({
                embed: {
                    title: "Bob-Ross Machine",
                    image: {
                        url: 'attachment://bobross.png',
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
                    name: `bobross.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
