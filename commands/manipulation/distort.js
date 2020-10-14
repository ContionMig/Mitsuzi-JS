const Util = require('../../util/MitUtil.js');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = {
    name: 'distort',
    description: 'Draws an image or a user\'s avatar but distorted.',
    aliases: [],
    usage: ' [level] [user]',
    cooldown: 2,
    args: -1,
    catergory: 'Memes/Images Manipulation',
    async execute(message, args, client) {
        try {
            let level = args[0];
            if (isNaN(level)) {
                return message.reply("Please make sure your level is a number!");
            }

            if (level > 150) {
                level = 150;
            }

            let member = message.guild.member(message.author);
            if (message.mentions.users.first()) {
                member = message.guild.member(message.mentions.users.first());
            }

			const data = await loadImage(member.user.displayAvatarURL({ size: 4096,format: 'jpg' }));
            const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(data, 0, 0);
			Util.distort(ctx, level, 0, 0, data.width, data.height);
			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
            
            return message.channel.send({
                embed: {
                    title: "Distort Machine",
                    image: {
                        url: 'attachment://distort.png',
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
                    name: `distort.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
