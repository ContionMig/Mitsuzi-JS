const Util = require('../../util/MitUtil.js');
const Discord = require("discord.js");
const db = require('../../util/Database.js');
const { ownerid } = require('../../config.json');

module.exports = {
    name: 'htmlhelp',
    description: 'Returns the help list and all commands',
    aliases: ['adminhelp'],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Utility',
    hidden: true,
    async execute(message, args, client) {
        if (message.author.id !== ownerid) return;

        let commands = client.commands.array();
        let Description = "";

        commands.sort(function (a, b) {
            if (a.catergory < b.catergory) { return -1; }
            if (a.catergory > b.catergory) { return 1; }
            return 0;
        });

        let Catergory = "";
        commands.forEach((cmd) => {
            if (cmd.hidden) return;

            /* 
            <div class="container-command">
            <button type="button" class="container-command btn text-left" data-toggle="collapse" data-target="#demo"><span class="commandnames">Userinfo</span><br><span class="commanddescript">Displays infomation about the user</span></button>
            <div id="demo" class="collapse">
                <div class="command">
                    <p class="commandDescription">
                        <span class="spanLabel">COOLDOWN<br></span>
                        2 Seconds<br>
                        <span class="spanLabel">ALIASES<br></span>
                        ui,user<br><br>
                        <span class="spanLabel">USAGE<br></span>
                        userinfo [user - Optional]
                    </p>
                    </div>
                </div>
            </div>
            */
            if (Catergory != cmd.catergory) {
                Catergory = cmd.catergory;
                Description += `\n----------\n${cmd.catergory}\n----------\n`;
            }

            let ID = Util.makeid(10);
            Description += `
            <div class="container-command">
            <button type="button" class="container-command btn text-left" data-toggle="collapse" data-target="#${ID}"><span class="commandnames">${Util.firstUpperCase(cmd.name)}</span><br><span class="commanddescript">${cmd.description}</span></button>
            <div id="${ID}" class="collapse">
                <div class="command">
                    <p class="commandDescription">
                        <span class="spanLabel">COOLDOWN<br></span>
                        ${cmd.cooldown} Seconds<br>
                        <span class="spanLabel">ALIASES<br></span>
                        ${cmd.aliases}<br><br>
                        <span class="spanLabel">USAGE<br></span>
                        ${cmd.name}${cmd.usage}
                    </p>
                    </div>
                </div>
            </div>
            `;

            console.log(Description);
            Description = "";
        });
    }
};
