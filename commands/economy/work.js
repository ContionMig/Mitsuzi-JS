const Util = require('../../util/MitUtil.js');
const MiniGames = require('../../util//MiniGames.js');
const db = require('../../util/Database.js');
const fs = require('fs');
const Discord = require('discord.js');
const { ownerid } = require('../../config.json');

let rawdata = fs.readFileSync('./include/assets/json/jobs.json');
let Game = JSON.parse(rawdata);

module.exports = {
    name: 'work',
    description: "Get a job and start working to earn",
    aliases: ['wk', 'job'],
    usage: ' [get/view] [jobid/page]',
    cooldown: 5,
    args: 0,
    catergory: 'Economy',
    async execute(message, args, client) {
        try {
            let timeout = 86400000;
            let timeout2 = 3600000;

            let CurrentTimeStamp = new Date().getTime();
            let JobArray = Game["data"];

            let UserJob = await db.get(`${message.author.id}_job`);
            let ServerPrefix = await db.get(`${message.guild.id}_prefix`);

            let UserTimeStamp = await db.get(`${message.author.id}_jobclock`);
            if (UserJob > -1 && !args[0]) {
                if (((CurrentTimeStamp - UserTimeStamp) > timeout) && (UserTimeStamp > 0)) {
                    await db.set(`${message.author.id}_job`, -1);
                    await db.set(`${message.author.id}_promotion`, 0);
                    return message.channel.send({
                        embed: {
                            title: "Job Fired",
                            description: `You have been fired from your job! Please try to work once everyday next time to prevent getting fired!`,
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }

                if (((CurrentTimeStamp - UserTimeStamp) < timeout2) && (UserTimeStamp > 0)) {
                    const timeLeft = timeout2 - (CurrentTimeStamp - UserTimeStamp);
                    return message.channel.send({
                        embed: {
                            title: "Job Cooldown",
                            description: `You may only work once an hour, please try again in **${Util.msToTime(timeLeft)}**!`,
                            color: "#8B0000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }

               
                await db.set(`${message.author.id}_jobclock`, CurrentTimeStamp);
                MiniGames.minigames(message);
            }
            else {
                let Option = "view";
                let OptionNumber = 1;

                if (args[0] == "get") {
                    Option = "get";
                }

                if (args[1]) {
                    if (isNaN(args[1])) {
                        return message.reply(`Please use the command properly, \`\`${ServerPrefix}work [get/view] [jobid/page]\`\``)
                    }
                    OptionNumber = Util.NotNumberCheck(args[1]);
                }
                else if (args[0]) {
                    if (!isNaN(args[0])) {
                        OptionNumber = Util.NotNumberCheck(args[0]);
                    }
                }

                
                if (Option == "view") {
                    let ViewEmbed = new Discord.MessageEmbed()
                        .setTitle(`Jobs`)
                        .setColor("#8B0000")
                        .setDescription(`You can start working a job by doing **${ServerPrefix}work [get] [id]** or switch to a different page by doing **${ServerPrefix}work [view] [page]**`)
                        .setFooter(`Next Page: ${ServerPrefix}work view ${OptionNumber + 1}`);

                    let Start = 6 * (OptionNumber - 1);
                    let End = Start + 6;
                    if (End > JobArray.length) {
                        End = JobArray.length;
                    }


                    for (let i = Start; i < End; i++) {
                        let Catergory = `**${i + 1}) ${Game.jobs[JobArray[i]].lebel}**`;
                        let Description = `${Game.jobs[JobArray[i]].description}\n\n`;

                        Description += `**Min Level:** ${Game.jobs[JobArray[i]].level}\n`;
                        Description += `**Earnings:** ${Util.moneyFormat(Game.jobs[JobArray[i]].earnings)}\n`;
                        Description += `**Max Bonus:** ${Util.moneyFormat(Game.jobs[JobArray[i]].bonus)}\n\n`;

                        Description += `**Max Promotion:** ${Game.jobs[JobArray[i]].maxpromotion}\n`;
                        Description += `**Risk:** ${Game.jobs[JobArray[i]].risk}\n\n`;

                        ViewEmbed.addField(Catergory, Description, true);
                    }

                    return message.channel.send(ViewEmbed);
                }
                else {
                    let Level = await db.get(`${message.author.id}_level`);
                    OptionNumber -= 1;

                    if (OptionNumber > JobArray.length || OptionNumber < 0) {
                        return message.channel.send({
                            embed: {
                                title: "Application Rejected",
                                description: `We could not find the job you are looking for! Please make sure to either use **ID** or **JobIDs**, we only have up to ${JobArray.length} jobs.`,
                                color: "#8B0000",
                                footer: {
                                    text: "Requested by " + message.author.tag,
                                    icon_url: message.author.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        });
                    }

                    if (Level < Game.jobs[JobArray[OptionNumber]].level) {
                        return message.channel.send({
                            embed: {
                                title: "Application Rejected",
                                description: `Due to your level not meeting the job's minimum level requirements, you have been rejected!`,
                                color: "#8B0000",
                                footer: {
                                    text: "Requested by " + message.author.tag,
                                    icon_url: message.author.displayAvatarURL()
                                },
                                timestamp: new Date()
                            }
                        });
                    }

                    await db.set(`${message.author.id}_job`, OptionNumber);
                    await db.set(`${message.author.id}_jobclock`, 0);
                    await db.set(`${message.author.id}_promotion`, 0);
                    return message.channel.send({
                        embed: {
                            title: "Application Accepted",
                            description: `Since you have met the minimum requirements, you have been accepted into ${Game.jobs[JobArray[OptionNumber]].lebel}! You may now start working by doing **${ServerPrefix}work**. Note that you will not be able to leave your job unless you get fired!`,
                            color: "#008000",
                            footer: {
                                text: "Requested by " + message.author.tag,
                                icon_url: message.author.displayAvatarURL()
                            },
                            timestamp: new Date()
                        }
                    });
                }
            }

        } catch (e) {
            console.error(e)
            message.reply("Something went wrong! Please try again later!")
        }
    }
};
