const { canModifyQueue } = require("../../util/MitUtil.js");
const Util = require('../../util/MitUtil.js');

module.exports = {
    name: 'shuffle',
    description: "Shuffles the queue",
    aliases: ['mix'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Music',
    async execute(message, args, client) {
        try {
            const queue = message.client.queue.get(message.guild.id);
            if (!queue) return message.channel.send("There is no queue.").catch(console.error);
            if (!canModifyQueue(message.member)) return;

            if (queue.songs.length < 3) {
                message.reply("Unable to shuffle a queue with less than 3 songs!")
            }

            queue.songs = Util.shuffle(queue.songs);

            queue.connection.dispatcher.end();
            queue.textChannel.send({
                embed: {
                    description: `🔀 ${message.author} shuffled the playlist`,
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            }).catch(console.error);
        }
        catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
