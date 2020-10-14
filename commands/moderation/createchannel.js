const Util = require('../../util/MitUtil.js');
const url = require('url');

let voice = ["voice", "v", "vc", "call", "sound"];

module.exports = {
    name: 'createchannel',
    description: "Creates a channel in the server.",
    aliases: [],
    usage: ' [voice/text] [name]',
    cooldown: 30,
    args: 2,
    catergory: 'Moderation',
    async execute(message, args, client) {
        try {
            if (!message.member.hasPermission('MANAGE_CHANNELS')) {
                return message.reply("Please make sure you have manage channels perms!")
            }

            if (!args[0]) return message.reply('You need to give me the channel type!')
            if (!args[1]) return message.reply('You need to give me the channel name!')

            let type = "text";
            if (voice.indexOf(args[0]) > -1) {
                type = "voice";
            }

            message.guild.channels.create(args[1], { type: type, reason: "Requested by " + message.author.tag }).catch((err) => {
                message.channel.send('There was an error!')
            });

            message.channel.send({
                embed: {
                    title: "Channel Created",
                    description: `Channel ${args[1]} has been created!`,
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            });

        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
