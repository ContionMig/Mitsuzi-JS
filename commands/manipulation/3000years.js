const Util = require('../../util/MitUtil.js');
var randomnumber = require('random-number');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = {
    name: '3000years',
    description: `Draws an image or a user\'s avatar over Pokémon\'s "It\'s been 3000 years" meme.`,
    aliases: ['years', '3ky'],
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

            const base = await loadImage("./include/assets/images/3000-years.png");
			const data = await loadImage(member.user.displayAvatarURL({ size: 4096,format: 'jpg' }));
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(base, 0, 0);
			const { x, y, width, height } = Util.centerImagePart(data, 200, 200, 461, 127);
			ctx.drawImage(data, x, y, width, height);

            return message.channel.send({
                embed: {
                    title: "It's been 3000 Years",
                    image: {
                        url: 'attachment://3000years.png',
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
                    name: `3000years.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
