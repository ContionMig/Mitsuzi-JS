const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const Discord = require('discord.js');
const fs = require('fs');

let rawdata = fs.readFileSync('./include/assets/json/game.json');
let Game = JSON.parse(rawdata);

module.exports = {
    name: 'base',
    description: "Buy/View bases which you can use to earn money from",
    aliases: ['bases'],
    usage: ' [buy/view] [option]',
    cooldown: 5,
    args: 0,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let Options = args[0];
            let ServerPrefix = await db.get(`${message.guild.id}_prefix`);
            let CurrentBase = await db.get(`${message.author.id}_base`);

            let Bases = Game.data["Bases"];

            if (Options == "buy" ||
                CurrentBase == -1) {

                let BuyOption = args[1];
                if (!isNaN(BuyOption)) {
                    let UserBalance = Util.NotNumberCheck(await db.get(`${message.author.id}_balance`));
                    BuyOption -= 1;

                    if ((BuyOption + 1) < 1 || (BuyOption + 1) > Bases.length) {
                        return message.reply("Please make sure your buy ID is a proper!");
                    }

                    let CostofProperty = parseInt(Game.bases[Bases[BuyOption]].value);
                    if (UserBalance < CostofProperty) {
                        return message.reply("Please make sure you have enough money to purchase the property!")
                    }

                    let BaseDefense = Game.bases[Bases[BuyOption]].basestats.defend;
                    let BaseLuck = Game.bases[Bases[BuyOption]].basestats.luck;

                    await db.subtract(`${message.author.id}_balance`, CostofProperty);
                    await db.set(`${message.author.id}_base`, BuyOption);

                    await db.set(`${message.author.id}_basedefense`, BaseDefense);
                    await db.set(`${message.author.id}_baseluck`, BaseLuck);

                    return message.channel.send({
                        embed: {
                            title: "Base Purchased",
                            description: `You have purchased **${Game.bases[Bases[BuyOption]].lebel}**! Please use **${ServerPrefix}uprades** to upgrade your base!`,
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
                        .setTitle(`Bases / Properties`)
                        .setColor("#8B0000")
                        .setDescription(`You can purchase a property by doing **${ServerPrefix}base buy [id]**. After doing this, you can then buy upgrades by doing **${ServerPrefix}upgrades**.`)
                        .setFooter(`Please do ${ServerPrefix}base to see your current base`);

                    for (let i = 0; i < Bases.length; i++) {
                        let Catergory = `**${i + 1}) ${Game.bases[Bases[i]].lebel}**`;
                        let Description = `${Game.bases[Bases[i]].description}\n\n`;

                        Description += `**Price:** ${Util.moneyFormat(Game.bases[Bases[i]].value)}\n`;
                        Description += `**Max Upgrade:** ${Game.bases[Bases[i]].maxupgrade}\n\n`;

                        Description += `**Base Stats:**\n`;
                        Description += `**Defend:**         ${Game.bases[Bases[i]].basestats.defend}\n`;
                        Description += `**Luck:**           ${Game.bases[Bases[i]].basestats.luck}\n`;

                        BuyEmbed.addField(Catergory, Description, true);
                    }

                    return message.channel.send(BuyEmbed);
                }
            }
            else if (CurrentBase > -1) {
                let BaseEmbed = new Discord.MessageEmbed()
                    .setTitle(`Your Base`)
                    .setColor("#8B0000")
                    .setDescription(`You can purchase another property by doing **${ServerPrefix}base buy**. After doing this, you can then buy upgrades by doing **${ServerPrefix}upgrades**.`)
                    .setFooter("Requested by " + message.author.tag);

                let UserBase = await db.get(`${message.author.id}_base`);

                BaseEmbed.addField(`Name`, `${Game.bases[Bases[UserBase]].lebel}`, true);
                BaseEmbed.addField(`Price`, `${Util.moneyFormat(Game.bases[Bases[UserBase]].value)}`, true);
                BaseEmbed.addField(`Max Upgrade`, `${Game.bases[Bases[UserBase]].maxupgrade}`, true);

                let AddDenfese = await db.get(`${message.author.id}_defense`);
                let AddLuck = await db.get(`${message.author.id}_luck`);

                let CurrentStats = "";
                CurrentStats = `${Game.bases[Bases[UserBase]].basestats.defend} (+${AddDenfese})\n`;
                BaseEmbed.addField(`**Defense:**`, CurrentStats, true);

                CurrentStats = `${Game.bases[Bases[UserBase]].basestats.luck} (+${AddLuck})\n`;
                BaseEmbed.addField(`**Luck:**`, CurrentStats, true);

                let MoneyPrinter = Util.NotNumberCheck(await db.get(`${message.author.id}_moneyprintermk1`));
                let MoneyPrinter2 = Util.NotNumberCheck(await db.get(`${message.author.id}_moneyprintermk2`));
                let MoneyPrinter3 = Util.NotNumberCheck(await db.get(`${message.author.id}_moneyprintermk3`));
              
                let MoneyPrinterUpgrade = Util.NotNumberCheck(Game.upgrades['moneyprintermk1'].upgrade);
                let MoneyPrinter2Upgrade = Util.NotNumberCheck(Game.upgrades['moneyprintermk2'].upgrade);
                let MoneyPrinter3Upgrade = Util.NotNumberCheck(Game.upgrades['moneyprintermk3'].upgrade);
              
                MoneyPrinter = MoneyPrinter * MoneyPrinterUpgrade;
                MoneyPrinter2 = MoneyPrinter2 * MoneyPrinter2Upgrade;
                MoneyPrinter3 = MoneyPrinter3 * MoneyPrinter3Upgrade;

                CurrentStats = `${Util.moneyFormat(MoneyPrinter + MoneyPrinter2 + MoneyPrinter3)}\n`;
                BaseEmbed.addField(`**Money Printing:**`, CurrentStats, true);

                return message.channel.send(BaseEmbed);
            }
            else {
                let BuyEmbed = new Discord.MessageEmbed()
                    .setTitle(`Bases / Properties`)
                    .setColor("#8B0000")
                    .setDescription(`You can purchase a property by doing **${ServerPrefix}base buy [id]**. After doing this, you can then buy upgrades by doing **${ServerPrefix}upgrades**.`)
                    .setFooter(`Please do ${ServerPrefix}base to see your current base`);

                for (let i = 0; i < Bases.length; i++) {
                    let Catergory = `**${i + 1}) ${Game.bases[Bases[i]].lebel}**`;
                    let Description = `${Game.bases[Bases[i]].description}\n\n`;

                    Description += `**Price:** ${Util.moneyFormat(Game.bases[Bases[i]].value)}\n`;
                    Description += `**Max Upgrade:** ${Game.bases[Bases[i]].maxupgrade}\n\n`;

                    Description += `**Base Stats:**\n`;
                    Description += `Defend:  ${Game.bases[Bases[i]].basestats.defend}\n`;
                    Description += `Luck:    ${Game.bases[Bases[i]].basestats.luck}\n`;

                    BuyEmbed.addField(Catergory, Description, true);
                }

                return message.channel.send(BuyEmbed);
            }
        }
        catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
