const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    name: 'communist',
    description: 'Draws the Communist flag over an image or a user\'s avatar.',
    aliases: ['commie', 'communism'],
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

            const base = await loadImage("./include/assets/images/communist.png");
			const data = await loadImage(member.user.displayAvatarURL({ size: 4096,format: 'jpg' }));
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			Util.drawImageWithTint(ctx, data, 'red', 0, 0, data.width, data.height);
			const { x, y, width, height } = Util.centerImage(base, data);
			ctx.globalAlpha = 0.5;
			ctx.drawImage(base, x + (width / 20), y + (height / 20), width * 0.9, height * 0.9);
			ctx.globalAlpha = 1;
			const attachment = canvas.toBuffer();
            if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
            
            return message.channel.send({
                embed: {
                    title: "Communist Machine",
                    image: {
                        url: 'attachment://communist.png',
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
                    name: `communist.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
