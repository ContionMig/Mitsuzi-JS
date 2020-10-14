const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = {
    name: 'brazzers',
    description: 'Draws an image with the Brazzers logo in the corner.',
    aliases: ['brazzer'],
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

            const base = await loadImage("./include/assets/images/brazzers.png");
			const data = await loadImage(member.user.displayAvatarURL({ size: 4096,format: 'jpg' }));
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0);
			const ratio = base.width / base.height;
			const width = data.width / 3;
			const height = Math.round(width / ratio);
			ctx.drawImage(base, 0, data.height - height, width, height);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
            return message.channel.send({
                embed: {
                    title: "Brazzers Machine",
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
