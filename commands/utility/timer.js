const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');

module.exports = {
    name: 'timer',
    description: "Sets a timer for anywhere from 1 second to 10 minutes.",
    aliases: ['delay'],
    usage: ' [timer (s)]',
    cooldown: 2,
    args: 1,
    catergory: 'Utility',
    async execute(message, args, client) {
        try {
            let time = args[0];
            if (isNaN(time)) {
                return message.reply("Pelase make sure you enter a valid number!");
            }

            const display = time > 59 ? `${time / 60} minutes` : `${time} seconds`;
            await message.channel.send(`🕰️ Set a timer for **${display}**.`);
            await Util.delay(time * 1000);
            return message.channel.send(`🕰️ Your **${display}** timer is finished ${message.author}!`);
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
