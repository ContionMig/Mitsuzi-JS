const Util = require('../../util/MitUtil.js');
const db = require('../../util/Database.js');
const Discord = require('discord.js');
const fs = require("fs");
const { ownerid } = require('../../config.json');

let EmoteArray = [":first_place:", ":second_place:", ":third_place:", ":military_medal:", ":military_medal:", ":military_medal:", ":military_medal:", ":military_medal:", ":military_medal:", ":military_medal:", ":military_medal:"];
module.exports = {
    name: 'leaderboard',
    description: "Returns the leaderboard of the current server",
    aliases: ['rich', 'lb'],
    usage: '',
    cooldown: 10,
    args: 0,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let ServerPrefix = await db.get(`${message.guild.id}_prefix`);
            let TrackingNode = Util.NotNumberCheck(await db.get(`${message.author.id}_tracking`));
            if (TrackingNode == 0) {
                return message.reply(`Please purchase a **tracking node** using \`\`${ServerPrefix}shop\`\`!`)
            }
            else {
                let timeout = 43200000;
                let LastDaily = Util.NotNumberCheck(await db.get(`${message.author.id}_trackignodetime`));

                let CurrentTimeStamp = new Date().getTime();
                if (!(((CurrentTimeStamp - LastDaily) > timeout) || !LastDaily)) {
                  return message.channel.send({
                    embed: {
                      title: "Leaderboard Cooldown",
                      description: `Please wait for **${Util.msToTime(timeout - (CurrentTimeStamp - LastDaily))}** before using your **Tracking Node** again`,
                      color: "#8B0000",
                      footer: {
                        text: "Requested by " + message.author.tag,
                        icon_url: message.author.displayAvatarURL()
                      },
                      timestamp: new Date()
                    }
                  });
                }


                await db.set(`${message.author.id}_trackignodetime`, CurrentTimeStamp);
                await db.subtract(`${message.author.id}_tracking`, 1);

                let Message = ``;
                let MembersArray = message.guild.members.cache.array();

                let ServerBalance = [];
                for (let i = 0; i < MembersArray.length; i++) {
                    let HasBalance = await db.has(`${MembersArray[i].user.id}_balance`);
                    if (HasBalance) {
                        ServerBalance.push(MembersArray[i]);
                        client.UsersBalance[MembersArray[i].user.id] = await db.get(`${MembersArray[i].user.id}_balance`);
                    }
                }

                ServerBalance.sort(function (a, b) {
                    let BalanceA = 0;
                    let BalanceB = 0;

                    BalanceA = client.UsersBalance[a.user.id];
                    BalanceB = client.UsersBalance[b.user.id];

                    if (BalanceA > BalanceB) { return -1; }
                    if (BalanceA < BalanceB) { return 1; }
                    return 0;
                });

                let NumerLoops = 5;
                if (NumerLoops > ServerBalance.length) {
                    NumerLoops = ServerBalance.length;
                }

                for (let i = 0; i < NumerLoops; i++) {
                    Message += `${EmoteArray[i]} **${Util.moneyFormat(Util.NotNumberCheck(await db.get(`${ServerBalance[i].user.id}_balance`)))}** - ${ServerBalance[i].user.username}\n`
                }

                return message.channel.send({
                    embed: {
                        title: `Top 5 Leaderboard`,
                        description: Message,
                        color: "#8B0000",
                        footer: {
                            text: "Requested by " + message.author.tag,
                            icon_url: message.author.displayAvatarURL()
                        },
                        timestamp: new Date()
                    }
                });
            }
        }
        catch (err) {
            console.log(err);
            return message.reply(`Oh no, an error occurred. Try again later!`);
        }
    }
};
