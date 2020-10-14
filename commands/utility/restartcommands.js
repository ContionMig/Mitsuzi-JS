const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const { ownerid } = require('../../config.json');
const fs = require('fs');

module.exports = {
    name: 'restartcommands',
    description: "[OWNER] Adds balance to the targeted user",
    aliases: ['restartcommand', 'resetcommands', 'commandsreset', 'refreshcommands'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Utility',
    hidden: true,
    async execute(message, args, client) {
        try {
            if (message.author.id !== ownerid) return;

            let rawdata = fs.readFileSync('./include/assets/json/game.json');
            let Game = JSON.parse(rawdata);

            let ListOfFiles = Game.data["filecommands"];

            for (let i = 0; i < ListOfFiles.length; i++) {
                const commandFiles = fs.readdirSync(`./commands/${ListOfFiles[i]}/`).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    delete require.cache[require.resolve(`../${ListOfFiles[i]}/${file}`)];
                    const command = require(`../${ListOfFiles[i]}/${file}`);
                    client.commands.set(command.name, command);
                }
            }

            return message.channel.send({
                embed: {
                    title: "[Owner] Refreshed Commands",
                    color: "#8B0000",
                    footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                    },
                    timestamp: new Date()
                }
            });
        } catch (e) {
            console.error(e)
        }
    }
};
