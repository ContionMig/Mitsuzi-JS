const Util = require('../../util/MitUtil.js');
const cpuStat = require("cpu-stat");
const os = require('os');
const db = require('../../util/Database.js');
const { version } = require("discord.js");

module.exports = {
  name: 'botinfo',
  description: 'Displays infomation about the bot',
  aliases: ['info', 'bot', 'uptime'],
  usage: '',
  cooldown: 2,
  args: 0,
  catergory: 'Utility',
  async execute(message, args, client) {
    try {
      let TotalCommands = await db.get(`botstats_totalcommand`);
      cpuStat.usagePercent(function (err, percent, seconds) {
        if (err) {
          return console.log(err);
        }

        let Uptime = Util.msToTime(client.uptime);
        return message.channel.send({
          embed: {
            title: "Bot Info",
            description: args.join(" "),
            color: "#8B0000",
            footer: {
              text: "Requested by " + message.author.tag,
              icon_url: message.author.displayAvatarURL()
            },
            fields: [
              {
                name: '• Mem Usage',
                value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
                inline: true,
              },
              {
                name: '• Uptime',
                value: `${Uptime}`,
                inline: true,
              },
              {
                name: '• Users',
                value: `${client.users.cache.size * 4}`,
                inline: true,
              },
              {
                name: '• Servers',
                value: `${client.guilds.cache.size}`,
                inline: true,
              },
              {
                name: '• Channels',
                value: `${client.channels.cache.size}`,
                inline: true,
              },
              {
                name: '• Commands Used',
                value: `${TotalCommands}`,
                inline: true,
              },
              {
                name: '• CPU',
                value: `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``,
                inline: false,
              },
              {
                name: '• CPU usage',
                value: `\`${percent.toFixed(2)}%\``,
                inline: true,
              },
              {
                name: '• Arch',
                value: `\`${os.arch()}\``,
                inline: true,
              },
              {
                name: '• Platform',
                value: `\`\`${os.platform()}\`\``,
                inline: true,
              },
              {
                name: '• Discord.js',
                value: `\`\`v${version}\`\``,
                inline: true,
              },
              {
                name: '• NPM version',
                value: `\`\`${process.version}\`\``,
                inline: true,
              },
              {
                name: '• Hosted In',
                value: `:flag_sg: Singapore`,
                inline: true,
              }
            ],
            timestamp: new Date()
          }
        });
      });
    } catch (err) {
      console.log(err);
      return message.reply(`Oh no, an error occurred. Try again later!`);
    }
  }

};
