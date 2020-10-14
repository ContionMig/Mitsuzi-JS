const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const Discord = require('discord.js');
const fs = require('fs');

let rawdata = fs.readFileSync('./include/assets/json/game.json');
let Game = JSON.parse(rawdata);

module.exports = {
    name: 'upgrade',
    description: "Buy/View upgrades you can do on your base",
    aliases: ['upgrades'],
    usage: ' [buy/view] [option]',
    cooldown: 2,
    args: 0,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let Options = args[0];
            let ServerPrefix = await db.get(`${message.guild.id}_prefix`);
            let CurrentBase = await db.get(`${message.author.id}_base`);

            let Upgrades = Game.data["Upgrades"];
            let Bases = Game.data["Bases"];

            let CurrentUpgrade = [];
            for (let i = 0; i < Upgrades.length; i++) {
                CurrentUpgrade.push(Util.NotNumberCheck(await db.get(`${message.author.id}_${Upgrades[i]}`))); 
            }

            if (CurrentBase > -1) {
                if (Options == "buy") {
                    let BuyOption = args[1];
                    if (!isNaN(BuyOption)) {
                        let UserBalance = await db.get(`${message.author.id}_balance`);
                        BuyOption -= 1;

                        if ((BuyOption + 1) < 1 || (BuyOption + 1) > Upgrades.length) {
                            return message.reply("Please make sure your buy ID is a proper!");
                        }

                        let TotalUpgrade = await db.get(`${message.author.id}_${Upgrades[BuyOption]}`);
                        let MaxUpgrade = await db.get(`${message.author.id}_base`);
                        MaxUpgrade = Game.bases[Bases[MaxUpgrade]].maxupgrade;

                        if (TotalUpgrade >= MaxUpgrade) {
                            return message.reply("You are not able to upgrade more then what your current base can handle!");
                        }

                        let CostofUpgrade = (Game.upgrades[Upgrades[BuyOption]].value * (CurrentUpgrade[BuyOption] + 1));
                        if (UserBalance < CostofUpgrade) {
                            return message.reply("Please make sure you have enough money to purchase the upgrade!")
                        }


                        db.subtract(`${message.author.id}_balance`, CostofUpgrade);

                        if (Upgrades[BuyOption] == "turret" || Upgrades[BuyOption] == "fireturret" || Upgrades[BuyOption] == "lazerturret") {
                            let Upgrade = Util.NotNumberCheck(Game.upgrades[Upgrades[BuyOption]].upgrade);
                            db.add(`${message.author.id}_defense`, Upgrade);
                        }

                        if (Upgrades[BuyOption] == "incense" || Upgrades[BuyOption] == "chamomile") {
                            let Upgrade = Util.NotNumberCheck(Game.upgrades[Upgrades[BuyOption]].upgrade);
                            db.add(`${message.author.id}_luck`, Upgrade);
                        }

                        db.add(`${message.author.id}_${Upgrades[BuyOption]}`, 1);

                        return message.channel.send({
                            embed: {
                                title: "Upgrade Purchased",
                                description: `You have purchased **${Game.upgrades[Upgrades[BuyOption]].lebel}**! Please use **${ServerPrefix}uprades** to upgrade your base futher or **${ServerPrefix}base** to see your stats!`,
                                color: "#8B0000",
                                footer: {
                                    text: "Requested by " + message.author.tag,
                                    icon_url: message.author.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        });
                    }
                    else {
                        let BuyEmbed = new Discord.MessageEmbed()
                            .setTitle(`Base Upgrades`)
                            .setColor("#8B0000")
                            .setDescription(`You can purchase a upgrade by doing **${ServerPrefix}upgrade buy [id]**`)
                            .setFooter(`Please do ${ServerPrefix}base to see your current base`);

                        for (let i = 0; i < Upgrades.length; i++) {
                            let Catergory = `**${i + 1}) ${Game.upgrades[Upgrades[i]].lebel} (${CurrentUpgrade[i]})**`;
                            let Description = `${Game.upgrades[Upgrades[i]].description}\n\n`;

                            let Cost = Game.upgrades[Upgrades[i]].value;
                            Cost = Cost * (CurrentUpgrade[i] + 1);

                            Description += `**Price:** ${Util.moneyFormat(Cost)}\n`;
                            Description += `**Upgrade:** +${Game.upgrades[Upgrades[i]].upgrade}\n`;

                            BuyEmbed.addField(Catergory, Description, true);
                        }

                        return message.channel.send(BuyEmbed);
                    }
                }
                else {
                    let BuyEmbed = new Discord.MessageEmbed()
                        .setTitle(`Base Upgrades`)
                        .setColor("#8B0000")
                        .setDescription(`You can purchase a upgrade by doing **${ServerPrefix}upgrade buy [id]**`)
                        .setFooter(`Please do ${ServerPrefix}base to see your current base`);

                    for (let i = 0; i < Upgrades.length; i++) {
                        let Catergory = `**${i + 1}) ${Game.upgrades[Upgrades[i]].lebel} (${CurrentUpgrade[i]})**`;
                        let Description = `${Game.upgrades[Upgrades[i]].description}\n\n`;

                        let Cost = Game.upgrades[Upgrades[i]].value;
                        Cost = Cost * (CurrentUpgrade[i] + 1);

                        Description += `**Price:** ${Util.moneyFormat(Cost)}\n`;
                        Description += `**Upgrade:** +${Game.upgrades[Upgrades[i]].upgrade}\n`;

                        BuyEmbed.addField(Catergory, Description, true);
                    }

                    return message.channel.send(BuyEmbed);
                }
            }
            else {
                message.reply(`Please purchase a property by doing **${ServerPrefix}base buy** before making upgrades to your base`);
            }
        }
        catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
