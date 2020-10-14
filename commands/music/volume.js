const { canModifyQueue } = require("../../util/MitUtil.js");

module.exports = {
    name: 'volume',
    description: "Change volume of currently playing music",
    aliases: ['v'],
    usage: ' [volume]',
    cooldown: 2,
    args: 0,
    catergory: 'Music',
    async execute(message, args, client) {
        try {
            const queue = message.client.queue.get(message.guild.id);

            if (!queue) return message.reply("There is nothing playing.").catch(console.error);
            if (!canModifyQueue(message.member)) {
                return message.reply("You need to join a voice channel first!").catch(console.error);
            }

            if (!args[0]) return message.channel.send({
                embed: {
                    description: `🔊 The current volume is: **${queue.volume}%**`,
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            }).catch(console.error);
            if (isNaN(args[0])) return message.reply("Please use a number to set volume.").catch(console.error);
            if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
                return message.reply("Please use a number between 0 - 100.").catch(console.error);

            queue.volume = args[0];
            queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

            return queue.textChannel.send({
                embed: {
                    description: `🔊 Volume set to: **${args[0]}%**`,
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            }).catch(console.error);
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
