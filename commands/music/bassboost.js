const { canModifyQueue } = require("../../util/MitUtil.js");

module.exports = {
    name: 'bassboost',
    description: "Change volume of currently playing music to 1000%",
    aliases: ['er'],
    usage: ' [on/off]',
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

            let EarRape = false;
            if (!args[0]) {
                EarRape = true;
                if (queue.volume == 1000) {
                    EarRape = false;
                }
            }
            else {
                if (args[0] == "off" || args[0] == "o") {
                    EarRape = false;
                }
                else {
                    EarRape = true;
                }
            }

            if (EarRape) {
                queue.volume = 1000;
                queue.connection.dispatcher.setVolumeLogarithmic(1000 / 100);

                return queue.textChannel.send({
                    embed: {
                        description: `🔊 Volume set to: **1000%**`,
                        color: "#8B0000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                }).catch(console.error);
            }
            else {
                queue.volume = 100;
                queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);

                return queue.textChannel.send({
                    embed: {
                        description: `🔊 Volume set to: **100%**`,
                        color: "#8B0000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                }).catch(console.error);
            }
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
