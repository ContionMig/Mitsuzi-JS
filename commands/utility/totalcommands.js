const Util = require('../../util/MitUtil.js');
const Discord = require("discord.js");
const db = require('../../util/Database.js');

module.exports = {
    name: 'totalcommands',
    description: 'Returns the total commands the bot has',
    aliases: ['totalcommand'],
    usage: '',
    cooldown: 2,
    args: 0,
    hidden: true,
    catergory: 'Utility',
    async execute(message, args, client) {
        try {
            let commands = client.commands.array();
            let ServerPrefix = await db.get(`${message.guild.id}_prefix`);
            let helpEmbed = new Discord.MessageEmbed()
                .setTitle(`Total Commands`)
                .setColor("#8B0000")
                .setDescription(`The bot has a total of ${commands.length} commands!`)
                .setFooter(`Please do ${ServerPrefix}help [command] for more information`);

            return message.channel.send(helpEmbed);
        } catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
