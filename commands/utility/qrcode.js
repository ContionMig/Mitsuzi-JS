const Util = require('../../util/MitUtil.js');
const request = require('node-superfetch');

module.exports = {
    name: 'qrcode',
    description: 'Converts text to a QR Code.',
    aliases: ['codeqr', 'createqr'],
    usage: ' [text/url]',
    cooldown: 2,
    args: -1,
    catergory: 'Utility',
    async execute(message, args, client) {
        try {
            let text = args.join(" ");
            const { body } = await request
                .get('https://api.qrserver.com/v1/create-qr-code/')
                .query({ data: text });

            return message.channel.send({
                embed: {
                    title: "QR Code Machine",
                    image: {
                        url: 'attachment://qr-code.png',
                    },
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                },
                files: [{
                    attachment: body,
                    name: `qr-code.png`
                }]
            });
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
